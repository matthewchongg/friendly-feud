/**
 * Family Feud Synchronization Engine
 * Combines BroadcastChannel (same machine / dual screen) + PeerJS WebRTC (mobile buzzers & remote boards over internet/LAN)
 * Enhanced with connection timeout watchdogs, auto-recovery on room collisions, and multi-STUN servers.
 */

class SyncEngine {
  constructor(role = 'viewer') {
    this.role = role; // 'host' (Admin), 'viewer' (Board / Projector), or 'client' (Player Buzzer)
    this.channel = null;
    this.peer = null;
    this.connections = new Map(); // For host: Map of peerId -> DataConnection
    this.hostConn = null; // For client/viewer: connection to host
    this.listeners = new Set();
    this.isOnline = false;
    this.roomCode = 'FEUD';
    this.playerData = null;
    this.statusCallback = null;
    this.reconnectTimer = null;
    this.connectWatchdog = null;
    this.retryAttempts = 0;
    this.maxRetries = 10;

    this.initBroadcastChannel();

    // Auto-cleanup peer on page unload so room ID is released immediately
    window.addEventListener('beforeunload', () => {
      this.destroyPeer();
    });
  }

  destroyPeer() {
    this._isDestroying = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.connectWatchdog) {
      clearTimeout(this.connectWatchdog);
      this.connectWatchdog = null;
    }
    if (this.hostConn) {
      try {
        if (typeof this.hostConn.removeAllListeners === 'function') this.hostConn.removeAllListeners();
        this.hostConn.close();
      } catch(e){}
      this.hostConn = null;
    }
    if (this.peer) {
      const p = this.peer;
      this.peer = null;
      try {
        // Strip event listeners so no zombie disconnect/error callbacks can fire
        if (typeof p.removeAllListeners === 'function') {
          p.removeAllListeners();
        } else if (typeof p.off === 'function') {
          p.off('open');
          p.off('connection');
          p.off('error');
          p.off('disconnected');
          p.off('close');
        }
        if (!p.destroyed) {
          p.disconnect();
          p.destroy();
        }
      } catch(e){}
    }
    this.isOnline = false;
    this._isConnecting = false;
    this._isDestroying = false;
  }

  // --- BroadcastChannel (Local Dual-Screen Sync) ---
  initBroadcastChannel() {
    try {
      this.channel = new BroadcastChannel('family_feud_bus');
      this.channel.onmessage = (event) => {
        const msg = event.data;
        this.notifyListeners(msg);
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported, using localStorage fallback', e);
      window.addEventListener('storage', (e) => {
        if (e.key === 'feud_bus_msg' && e.newValue) {
          try {
            const msg = JSON.parse(e.newValue);
            this.notifyListeners(msg);
          } catch (err) {}
        }
      });
    }
  }

  broadcastLocal(type, payload = {}) {
    const message = { type, payload, timestamp: Date.now(), senderRole: this.role };
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('Broadcast error', e);
      }
    }
    try {
      localStorage.setItem('feud_bus_msg', JSON.stringify(message));
    } catch (e) {}
  }

  // --- Listener Management ---
  onMessage(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(msg) {
    this.listeners.forEach(cb => {
      try {
        cb(msg);
      } catch (e) {
        console.error('Error in sync listener callback:', e);
      }
    });
  }

  getIceServers() {
    return [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' }
    ];
  }

  getHostPeerId(code) {
    return 'feud-live-' + (code || 'FEUD').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  }

  generateRoomCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'FF-';
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
  }

  // ==========================================
  // HOST PEER (Admin Screen ONLY)
  // Registers feud-live-[CODE] on PeerJS Cloud
  // ==========================================
  initHostPeer(roomCode, onStatusChange) {
    this.role = 'host';
    this.statusCallback = onStatusChange;
    let cleanCode = (roomCode || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode || cleanCode === 'FEUD') {
      cleanCode = this.generateRoomCode();
    }
    this.roomCode = cleanCode;
    const peerId = this.getHostPeerId(this.roomCode);

    if (typeof Peer === 'undefined') {
      if (onStatusChange) onStatusChange({ status: 'offline', message: 'PeerJS script not loaded' });
      return;
    }

    this.destroyPeer();
    this._isConnecting = true;

    if (this.statusCallback) {
      this.statusCallback({ status: 'connecting', roomCode: this.roomCode, message: 'Connecting to Cloud...' });
    }

    try {
      this.peer = new Peer(peerId, {
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        debug: 1,
        config: { iceServers: this.getIceServers() }
      });

      this.peer.on('open', (id) => {
        this.isOnline = true;
        this._isConnecting = false;
        this.retryAttempts = 0;
        this.reclaimAttempts = 0;
        console.log(`[Host] WebRTC Room online with ID: ${id}`);
        if (this.statusCallback) {
          this.statusCallback({
            status: 'connected',
            peerId: id,
            roomCode: this.roomCode,
            connectedCount: this.connections.size
          });
        }
      });

      this.peer.on('connection', (conn) => {
        this.setupHostConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.warn('[Host] PeerJS notice:', err);
        this._isConnecting = false;

        if (err.type === 'unavailable-id') {
          this.isOnline = false;

          // Never auto-switch a special designated event room!
          const isSpecial = (typeof window !== 'undefined' && typeof window.getSpecialRoomConfig === 'function' && window.getSpecialRoomConfig(this.roomCode)) || (this.roomCode === 'FSA-POLYU');
          if (isSpecial) {
            this.reclaimAttempts = (this.reclaimAttempts || 0) + 1;
            if (this.reclaimAttempts > 3) {
              if (this.statusCallback) {
                this.statusCallback({
                  status: 'error',
                  roomCode: this.roomCode,
                  message: `Room "${this.roomCode}" is active in another browser tab or device. Please close other admin tabs and tap Reconnect.`
                });
              }
              return;
            }
            console.warn(`[Host] Special event room "${this.roomCode}" is currently registered on PeerJS cloud (attempt ${this.reclaimAttempts}/3). Reclaiming slot in 3s...`);
            if (this.statusCallback) {
              this.statusCallback({
                status: 'connecting',
                roomCode: this.roomCode,
                message: `Reclaiming room "${this.roomCode}" from previous session...`
              });
            }
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => {
              this.initHostPeer(this.roomCode, this.statusCallback);
            }, 3000);
            return;
          }

          // Normal room auto-collision switch
          const freshCode = this.generateRoomCode();
          console.warn(`[Host] Room "${this.roomCode}" is in use. Auto-switching to fresh unused code "${freshCode}"...`);
          this.roomCode = freshCode;
          if (this.statusCallback) {
            this.statusCallback({
              status: 'code-collision',
              roomCode: this.roomCode,
              message: `Room was in use. Auto-switching to unused code "${this.roomCode}"...`
            });
          }
          if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => {
            this.initHostPeer(this.roomCode, this.statusCallback);
          }, 350);
        } else {
          if (this.statusCallback) {
            this.statusCallback({ status: 'error', errorType: err.type, message: err.message || err.type });
          }
        }
      });

      this.peer.on('disconnected', () => {
        if (this._isDestroying || !this.peer || this.peer.destroyed) return;
        this.isOnline = false;
        this._isConnecting = false;
        console.warn('[Host] PeerJS disconnected from server, attempting reconnect...');
        if (this.statusCallback) this.statusCallback({ status: 'disconnected', message: 'Reconnecting to PeerJS cloud...' });
        
        // Debounce reconnect so it doesn't spam PeerJS in a tight loop
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          if (this._isDestroying || !this.peer || this.peer.destroyed) return;
          try {
            this.peer.reconnect();
          } catch (e) {
            console.warn('[Host] Reconnect failed:', e);
          }
        }, 3000);
      });
    } catch (e) {
      this._isConnecting = false;
      console.error('[Host] Fatal error initializing host peer:', e);
      if (this.statusCallback) this.statusCallback({ status: 'offline', message: 'Peer init failed' });
    }
  }

  setupHostConnection(conn) {
    const onOpen = () => {
      this.connections.set(conn.peer, conn);
      console.log(`[Host] Peer connection open: ${conn.peer} (Total: ${this.connections.size})`);

      // Immediately send welcome packet with current state
      const curState = window.gameState ? window.gameState.get() : null;
      try {
        conn.send({
          type: 'WELCOME_CLIENT',
          payload: {
            roomCode: this.roomCode,
            serverTime: Date.now(),
            state: curState
          }
        });
      } catch (e) {
        console.warn('[Host] Failed to send welcome packet:', e);
      }

      if (this.statusCallback) {
        this.statusCallback({
          status: 'connected',
          roomCode: this.roomCode,
          connectedCount: this.connections.size
        });
      }
    };

    if (conn.open) {
      onOpen();
    } else {
      conn.on('open', onOpen);
    }

    conn.on('data', (data) => {
      if (!data || !data.type) return;

      if (data.type === 'PLAYER_JOIN') {
        const player = data.payload;
        conn.playerInfo = player;
        console.log(`[Host] Player joined via WebRTC: ${player.playerName} (${player.team === 1 ? 'Team 1' : 'Team 2'}) [${conn.peer}]`);

        // Send confirmation back to player
        try {
          conn.send({
            type: 'JOIN_CONFIRMED',
            payload: {
              playerId: player.playerId,
              state: window.gameState ? window.gameState.get() : null
            }
          });
        } catch (e) {}

        this.notifyListeners(data);
        this.broadcastLocal(data.type, data.payload);
        return;
      }

      if (data.type === 'VIEWER_JOIN') {
        conn.isViewer = true;
        console.log(`[Host] Remote Viewer/Board joined: ${conn.peer}`);
        try {
          conn.send({
            type: 'STATE_UPDATE',
            payload: window.gameState ? window.gameState.get() : null
          });
        } catch (e) {}
        return;
      }

      if (data.type === 'PING') {
        try {
          conn.send({ type: 'PONG', payload: { serverTime: Date.now() } });
        } catch(e) {}
        return;
      }

      // Forward client event (e.g. PLAYER_BUZZ) to local listeners and broadcast locally
      this.notifyListeners(data);
      this.broadcastLocal(data.type, data.payload);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      console.log(`[Host] Peer disconnected: ${conn.peer} (Remaining: ${this.connections.size})`);
      if (conn.playerInfo) {
        this.notifyListeners({ type: 'PLAYER_DISCONNECT', payload: conn.playerInfo });
        this.broadcastLocal('PLAYER_DISCONNECT', conn.playerInfo);
      }
      if (this.statusCallback) {
        this.statusCallback({
          status: 'connected',
          roomCode: this.roomCode,
          connectedCount: this.connections.size
        });
      }
    });

    conn.on('error', (err) => {
      console.warn(`[Host] Error on peer connection ${conn.peer}:`, err);
      this.connections.delete(conn.peer);
    });
  }

  // ==========================================
  // VIEWER PEER (Board / Projector Display)
  // Connects to Host without colliding with Host ID
  // ==========================================
  initViewerPeer(roomCode, onStatusChange) {
    this.role = 'viewer';
    this.statusCallback = onStatusChange;
    this.roomCode = (roomCode || 'FEUD').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const targetHostId = this.getHostPeerId(this.roomCode);

    if (typeof Peer === 'undefined') {
      if (onStatusChange) onStatusChange({ status: 'offline', message: 'PeerJS script not loaded' });
      return;
    }

    this.destroyPeer();

    try {
      this.peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        debug: 1,
        config: { iceServers: this.getIceServers() }
      });

      this.peer.on('open', () => {
        this.connectViewerToHost(targetHostId);
      });

      this.peer.on('error', (err) => {
        console.warn('[Viewer] Peer error:', err);
        if (err.type === 'peer-unavailable') {
          if (this.statusCallback) this.statusCallback({ status: 'waiting-host', message: 'Host not online yet. Syncing locally...' });
          this.scheduleViewerReconnect(targetHostId);
        } else {
          if (this.statusCallback) this.statusCallback({ status: 'error', message: err.type });
        }
      });
    } catch (e) {
      console.error('[Viewer] Peer init error:', e);
    }
  }

  connectViewerToHost(targetHostId) {
    if (!this.peer || this.peer.destroyed) return;
    if (this.statusCallback) this.statusCallback({ status: 'connecting', message: 'Connecting to Host room...' });

    if (this.hostConn) {
      try { this.hostConn.close(); } catch(e){}
      this.hostConn = null;
    }

    this.hostConn = this.peer.connect(targetHostId, { reliable: true });

    const onOpen = () => {
      this.isOnline = true;
      if (this.statusCallback) this.statusCallback({ status: 'connected', message: 'Connected to Host!' });
      try {
        this.hostConn.send({ type: 'VIEWER_JOIN', payload: { role: 'board' } });
      } catch (e) {}
    };

    if (this.hostConn.open) {
      onOpen();
    } else {
      this.hostConn.on('open', onOpen);
    }

    this.hostConn.on('data', (data) => {
      if (data && data.type) {
        this.notifyListeners(data);
      }
    });

    this.hostConn.on('close', () => {
      this.isOnline = false;
      if (this.statusCallback) this.statusCallback({ status: 'disconnected', message: 'Lost connection to Host' });
      this.scheduleViewerReconnect(targetHostId);
    });

    this.hostConn.on('error', (err) => {
      console.warn('[Viewer] Host connection error:', err);
    });
  }

  scheduleViewerReconnect(targetHostId) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.peer && !this.peer.destroyed) {
        this.connectViewerToHost(targetHostId);
      }
    }, 4000);
  }

  // ==========================================
  // CLIENT PEER (Player Mobile Buzzer)
  // Connects to Host, sends PLAYER_JOIN, and auto-retries
  // ==========================================
  initClientPeer(roomCode, playerData, onStatusChange) {
    this.role = 'client';
    this.statusCallback = onStatusChange;
    this.playerData = playerData;
    this.roomCode = (roomCode || 'FEUD').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const targetHostId = this.getHostPeerId(this.roomCode);

    if (typeof Peer === 'undefined') {
      if (onStatusChange) onStatusChange({ status: 'offline', message: 'PeerJS script not loaded' });
      return;
    }

    this.destroyPeer();

    try {
      this.peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        debug: 1,
        config: { iceServers: this.getIceServers() }
      });

      this.peer.on('open', () => {
        this.connectClientToHost(targetHostId);
      });

      this.peer.on('error', (err) => {
        console.warn('[Client] Peer error:', err);
        if (err.type === 'peer-unavailable') {
          if (this.statusCallback) {
            this.statusCallback({
              status: 'reconnecting',
              message: `Game room "${this.roomCode}" not found. Retrying in 3s...`,
              roomCode: this.roomCode
            });
          }
          this.scheduleClientReconnect(targetHostId);
        } else {
          if (this.statusCallback) this.statusCallback({ status: 'error', message: err.type, roomCode: this.roomCode });
        }
      });
    } catch (e) {
      console.error('[Client] Init error:', e);
      if (this.statusCallback) this.statusCallback({ status: 'offline', message: 'Unable to start PeerJS' });
    }
  }

  connectClientToHost(targetHostId) {
    if (!this.peer || this.peer.destroyed) return;
    if (this.statusCallback) {
      this.statusCallback({ status: 'connecting', message: `Connecting to room ${this.roomCode}...`, roomCode: this.roomCode });
    }

    if (this.hostConn) {
      try { this.hostConn.close(); } catch(e){}
      this.hostConn = null;
    }

    this.hostConn = this.peer.connect(targetHostId, { reliable: true });

    const onOpen = () => {
      this.isOnline = true;
      this.retryAttempts = 0;
      console.log(`[Client] Connected to host ${targetHostId}!`);
      if (this.statusCallback) {
        this.statusCallback({ status: 'connected', message: 'Connected To Game!', roomCode: this.roomCode });
      }

      // Send join announcement
      this.sendToHost('PLAYER_JOIN', this.playerData);
    };

    if (this.hostConn.open) {
      onOpen();
    } else {
      this.hostConn.on('open', onOpen);
    }

    this.hostConn.on('data', (data) => {
      if (!data || !data.type) return;

      if (data.type === 'WELCOME_CLIENT') {
        // Host requested announcement: send our player data to ensure registration
        this.sendToHost('PLAYER_JOIN', this.playerData);
        if (data.payload && data.payload.state) {
          this.notifyListeners({ type: 'STATE_UPDATE', payload: data.payload.state });
        }
        return;
      }

      if (data.type === 'JOIN_CONFIRMED') {
        if (this.statusCallback) {
          this.statusCallback({ status: 'registered', message: 'Registered With Host!', roomCode: this.roomCode });
        }
        if (data.payload && data.payload.state) {
          this.notifyListeners({ type: 'STATE_UPDATE', payload: data.payload.state });
        }
        return;
      }

      this.notifyListeners(data);
    });

    this.hostConn.on('close', () => {
      this.isOnline = false;
      console.warn('[Client] Disconnected from host');
      if (this.statusCallback) {
        this.statusCallback({
          status: 'reconnecting',
          message: 'Disconnected From Host. Reconnecting...',
          roomCode: this.roomCode
        });
      }
      this.scheduleClientReconnect(targetHostId);
    });

    this.hostConn.on('error', (err) => {
      console.warn('[Client] Host connection error:', err);
    });
  }

  scheduleClientReconnect(targetHostId) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.retryAttempts >= this.maxRetries) {
      if (this.statusCallback) {
        this.statusCallback({
          status: 'failed',
          message: 'Connection Timed Out. Tap "Retry Connection" Below.',
          roomCode: this.roomCode
        });
      }
      return;
    }

    this.retryAttempts++;
    this.reconnectTimer = setTimeout(() => {
      console.log(`[Client] Reconnect attempt ${this.retryAttempts}/${this.maxRetries}...`);
      this.connectClientToHost(targetHostId);
    }, 3500);
  }

  retryClientNow() {
    this.retryAttempts = 0;
    if (this.peer && !this.peer.destroyed) {
      this.connectClientToHost(this.getHostPeerId(this.roomCode));
    } else {
      this.initClientPeer(this.roomCode, this.playerData, this.statusCallback);
    }
  }

  sendToHost(type, payload = {}) {
    const data = { type, payload, timestamp: Date.now() };
    if (this.hostConn && this.hostConn.open) {
      try {
        this.hostConn.send(data);
      } catch (e) {
        console.warn('Error sending to host:', e);
      }
    }
    // Also broadcast on local channel in case client is on same machine
    this.broadcastLocal(type, payload);
  }

  // --- Broadcast to all connected peers (Host only) ---
  broadcastToPeers(type, payload = {}) {
    const data = { type, payload, timestamp: Date.now() };
    this.connections.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(data);
        } catch (e) {
          console.warn('Failed to send to peer', conn.peer, e);
        }
      }
    });
  }

  // --- Combined Broadcast (Local + WebRTC) ---
  broadcast(type, payload = {}) {
    this.broadcastLocal(type, payload);
    this.broadcastToPeers(type, payload);
  }
}

window.SyncEngine = SyncEngine;
