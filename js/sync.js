/**
 * Family Feud Synchronization Engine
 * Combines BroadcastChannel (same machine / dual screen) + PeerJS WebRTC (mobile buzzers over internet/LAN)
 */

class SyncEngine {
  constructor(role = 'viewer') {
    this.role = role; // 'host' (Admin), 'board' (Projector), or 'client' (Player Buzzer)
    this.channel = null;
    this.peer = null;
    this.connections = new Map(); // For host: Map of peerId -> DataConnection
    this.hostConn = null; // For client: connection to host
    this.listeners = new Set();
    this.isOnline = false;
    this.roomCode = 'FEUD';

    this.initBroadcastChannel();
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
      console.warn('BroadcastChannel not supported in this environment, using localStorage fallback', e);
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

  // --- WebRTC PeerJS Integration ---
  /**
   * Initializes Host (Admin or Board) PeerJS connection
   */
  initHostPeer(roomCode, onStatusChange) {
    this.roomCode = (roomCode || 'FEUD').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const peerId = 'feud-room-' + this.roomCode;

    if (typeof Peer === 'undefined') {
      if (onStatusChange) onStatusChange({ status: 'offline', message: 'WebRTC offline (Local multi-screen active)' });
      return;
    }

    try {
      if (this.peer) this.peer.destroy();
      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        this.isOnline = true;
        if (onStatusChange) onStatusChange({ status: 'connected', peerId: id, roomCode: this.roomCode });
      });

      this.peer.on('connection', (conn) => {
        this.setupHostConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS Host notice:', err);
        if (err.type === 'unavailable-id') {
          // If ID is taken (e.g. host reloaded quickly), fallback or notify
          if (onStatusChange) onStatusChange({ status: 'warning', message: 'Room code already registered. Still syncable via Local Bus.' });
        } else {
          if (onStatusChange) onStatusChange({ status: 'error', message: err.type });
        }
      });

      this.peer.on('disconnected', () => {
        this.isOnline = false;
        if (onStatusChange) onStatusChange({ status: 'disconnected', message: 'Disconnected from Peer Cloud' });
      });
    } catch (e) {
      console.error('Peer init error', e);
      if (onStatusChange) onStatusChange({ status: 'offline', message: 'PeerJS unavailable' });
    }
  }

  setupHostConnection(conn) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      // Send current state to newly joined client
      if (window.gameState) {
        conn.send({
          type: 'STATE_UPDATE',
          payload: window.gameState.get()
        });
      }
    });

    conn.on('data', (data) => {
      // Forward client message to local listeners (Admin and Board)
      this.notifyListeners(data);
      this.broadcastLocal(data.type, data.payload);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      // Notify player left
      this.notifyListeners({ type: 'PLAYER_DISCONNECT', payload: { peerId: conn.peer } });
      this.broadcastLocal('PLAYER_DISCONNECT', { peerId: conn.peer });
    });

    conn.on('error', () => {
      this.connections.delete(conn.peer);
    });
  }

  /**
   * Broadcast message to all connected WebRTC clients
   */
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

  /**
   * Initializes Client (Mobile Buzzer) connection to Host Peer
   */
  initClientPeer(roomCode, playerData, onStatusChange) {
    this.roomCode = (roomCode || 'FEUD').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const targetHostId = 'feud-room-' + this.roomCode;

    if (typeof Peer === 'undefined') {
      if (onStatusChange) onStatusChange({ status: 'offline', message: 'WebRTC library not loaded' });
      return;
    }

    try {
      if (this.peer) this.peer.destroy();
      this.peer = new Peer({
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', () => {
        if (onStatusChange) onStatusChange({ status: 'connecting', message: 'Connecting to Host room...' });
        this.hostConn = this.peer.connect(targetHostId, { reliable: true });

        this.hostConn.on('open', () => {
          this.isOnline = true;
          if (onStatusChange) onStatusChange({ status: 'connected', message: 'Connected to Game!' });
          // Send join announcement
          this.sendToHost('PLAYER_JOIN', playerData);
        });

        this.hostConn.on('data', (data) => {
          this.notifyListeners(data);
        });

        this.hostConn.on('close', () => {
          this.isOnline = false;
          if (onStatusChange) onStatusChange({ status: 'disconnected', message: 'Disconnected from Host' });
        });

        this.hostConn.on('error', (err) => {
          if (onStatusChange) onStatusChange({ status: 'error', message: 'Connection error' });
        });
      });

      this.peer.on('error', (err) => {
        console.warn('Peer client error:', err);
        if (onStatusChange) onStatusChange({ status: 'error', message: err.type });
      });
    } catch (e) {
      console.error('Client peer init error', e);
      if (onStatusChange) onStatusChange({ status: 'offline', message: 'Unable to start Peer' });
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

  // --- Combined Broadcast (Local + WebRTC) ---
  broadcast(type, payload = {}) {
    this.broadcastLocal(type, payload);
    this.broadcastToPeers(type, payload);
  }
}

window.SyncEngine = SyncEngine;
