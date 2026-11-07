/**
 * Mobile Player Buzzer Controller
 * Enhanced for Custom Team Names, General Family Feud, and Robust WebRTC Synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sync = new SyncEngine('client');
  const sound = window.soundEngine;

  // DOM Elements - Join View
  const joinView = document.getElementById('joinView');
  const buzzerView = document.getElementById('buzzerView');
  const playerNameInput = document.getElementById('playerNameInput');
  const roomCodeInput = document.getElementById('roomCodeInput');
  const team1ChoiceBtn = document.getElementById('team1ChoiceBtn');
  const team2ChoiceBtn = document.getElementById('team2ChoiceBtn');
  const joinGameBtn = document.getElementById('joinGameBtn');
  const joinStatusMsg = document.getElementById('joinStatusMsg');

  // DOM Elements - Buzzer View
  const buzzerContainer = document.querySelector('.buzzer-container');
  const playerDisplayName = document.getElementById('playerDisplayName');
  const playerDisplayTeam = document.getElementById('playerDisplayTeam');
  const myTeamScoreCard = document.getElementById('myTeamScoreCard');
  const myTeamNameDisplay = document.getElementById('myTeamNameDisplay');
  const myTeamScoreDisplay = document.getElementById('myTeamScoreDisplay');
  const myPodiumRoleBadge = document.getElementById('myPodiumRoleBadge');
  const giantBuzzerBtn = document.getElementById('giantBuzzerBtn');
  const buzzerStatusText = document.getElementById('buzzerStatusText');
  const clientStatusBadge = document.getElementById('clientStatusBadge');
  const clientStatusDot = document.getElementById('clientStatusDot');
  const clientStatusText = document.getElementById('clientStatusText');
  const buzzerRoomCodeTag = document.getElementById('buzzerRoomCodeTag');
  const currentRoundTag = document.getElementById('currentRoundTag');
  const buzzerDisconnectAlert = document.getElementById('buzzerDisconnectAlert');
  const buzzerDisconnectText = document.getElementById('buzzerDisconnectText');
  const buzzerReconnectBtn = document.getElementById('buzzerReconnectBtn');

  let selectedTeam = 1;
  let playerInfo = null;
  let hasBuzzedThisTurn = false;
  let currentGameState = null;
  let activeRoom = 'FEUD';
  let pingInterval = null;

  // Check URL query parameters for room code
  const urlParams = new URLSearchParams(window.location.search);
  const initialRoom = (urlParams.get('room') || '').toUpperCase().trim();
  activeRoom = initialRoom;
  if (roomCodeInput) {
    roomCodeInput.value = initialRoom;
    if (!initialRoom) roomCodeInput.placeholder = 'ROOM CODE (e.g. FF-4K9A)';
  }
  if (buzzerRoomCodeTag) buzzerRoomCodeTag.textContent = initialRoom || 'ROOM';

  // Check saved player info from localStorage
  const savedPlayer = localStorage.getItem('feud_player_profile');
  if (savedPlayer) {
    try {
      const parsed = JSON.parse(savedPlayer);
      if (playerNameInput) playerNameInput.value = parsed.name || '';
      if (parsed.team) selectTeam(parsed.team);
    } catch (e) {}
  }

  // Pre-load local state if available to show custom team names on join screen
  try {
    const localSavedState = localStorage.getItem('feud_live_state');
    if (localSavedState) {
      const parsed = JSON.parse(localSavedState);
      updateJoinTeamNames(parsed.team1?.name || 'Team 1', parsed.team2?.name || 'Team 2');
    }
  } catch (e) {}

  function updateJoinTeamNames(t1Name, t2Name) {
    if (team1ChoiceBtn) team1ChoiceBtn.textContent = t1Name;
    if (team2ChoiceBtn) team2ChoiceBtn.textContent = t2Name;
  }

  // Team selection
  function selectTeam(teamNum) {
    selectedTeam = teamNum;
    if (team1ChoiceBtn && team2ChoiceBtn) {
      team1ChoiceBtn.classList.toggle('selected-team1', teamNum === 1);
      team2ChoiceBtn.classList.toggle('selected-team2', teamNum === 2);
    }
  }

  if (team1ChoiceBtn) team1ChoiceBtn.addEventListener('click', () => selectTeam(1));
  if (team2ChoiceBtn) team2ChoiceBtn.addEventListener('click', () => selectTeam(2));

  // Join button
  if (joinGameBtn) {
    joinGameBtn.addEventListener('click', () => {
      const name = (playerNameInput ? playerNameInput.value : '').trim();
      if (!name) {
        alert('Please enter your player name!');
        if (playerNameInput) playerNameInput.focus();
        return;
      }
      activeRoom = ((roomCodeInput ? roomCodeInput.value : '') || '').toUpperCase().trim();
      if (!activeRoom) {
        alert('Please enter the Game Room Code displayed on the host or board screen!');
        if (roomCodeInput) roomCodeInput.focus();
        return;
      }

      let pid = localStorage.getItem('feud_player_id');
      if (!pid) {
        pid = 'p-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        localStorage.setItem('feud_player_id', pid);
      }

      playerInfo = {
        playerId: pid,
        playerName: name,
        team: selectedTeam,
        joinedAt: Date.now()
      };

      try {
        localStorage.setItem('feud_player_profile', JSON.stringify({ name, team: selectedTeam }));
      } catch (e) {}

      enterBuzzerView(activeRoom);
    });
  }

  function enterBuzzerView(room) {
    if (joinView) joinView.style.display = 'none';
    if (buzzerView) buzzerView.style.display = 'flex';

    if (playerDisplayName) playerDisplayName.textContent = playerInfo.playerName;
    if (buzzerRoomCodeTag) buzzerRoomCodeTag.textContent = room;
    updatePlayerTeamDisplay();

    // Connect via SyncEngine
    sync.initClientPeer(room, playerInfo, (status) => {
      handleConnectionStatus(status);
    });

    // Start background ping keepalive for mobile screen sleep prevention
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(() => {
      if (sync.isOnline) {
        sync.sendToHost('PING', { playerId: playerInfo.playerId });
      }
    }, 12000);
  }

  function handleConnectionStatus(status) {
    if (!clientStatusBadge) return;

    if (status.status === 'connected' || status.status === 'registered') {
      clientStatusBadge.className = 'status-indicator-btn status-connected';
      if (clientStatusDot) clientStatusDot.className = 'status-dot-circle';
      if (clientStatusText) clientStatusText.textContent = 'Online';
      if (buzzerDisconnectAlert) buzzerDisconnectAlert.style.display = 'none';
    } else if (status.status === 'connecting') {
      clientStatusBadge.className = 'status-indicator-btn status-connecting';
      if (clientStatusDot) clientStatusDot.className = 'status-dot-circle';
      if (clientStatusText) clientStatusText.textContent = 'Connecting...';
      if (buzzerDisconnectAlert) buzzerDisconnectAlert.style.display = 'none';
    } else if (status.status === 'reconnecting') {
      clientStatusBadge.className = 'status-indicator-btn status-reconnecting';
      if (clientStatusDot) clientStatusDot.className = 'status-dot-circle';
      if (clientStatusText) clientStatusText.textContent = 'Retrying...';
      if (buzzerDisconnectAlert) buzzerDisconnectAlert.style.display = 'flex';
      if (buzzerDisconnectText) buzzerDisconnectText.textContent = 'Connecting To Host Room...';
    } else {
      clientStatusBadge.className = 'status-indicator-btn status-offline';
      if (clientStatusDot) clientStatusDot.className = 'status-dot-circle';
      if (clientStatusText) clientStatusText.textContent = 'Offline';
      if (buzzerDisconnectAlert) buzzerDisconnectAlert.style.display = 'flex';
      if (buzzerDisconnectText) buzzerDisconnectText.textContent = 'Connection Lost. Tap To Reconnect.';
    }
  }

  // Tap to Reconnect buttons
  if (buzzerReconnectBtn) {
    buzzerReconnectBtn.addEventListener('click', () => {
      sync.retryClientNow();
    });
  }
  if (clientStatusBadge) {
    clientStatusBadge.addEventListener('click', () => {
      if (!sync.isOnline) {
        sync.retryClientNow();
      }
    });
  }

  // Screen unlock / browser tab refocus auto-reconnect
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && playerInfo) {
      if (!sync.isOnline) {
        console.log('[Buzzer] Tab resumed from background, checking connection...');
        sync.retryClientNow();
      } else {
        // Send a quick ping/announcement to confirm registration
        sync.sendToHost('PLAYER_JOIN', playerInfo);
      }
    }
  });

  function updatePlayerTeamDisplay() {
    if (!playerInfo || !playerDisplayTeam) return;
    const tName = currentGameState ? (playerInfo.team === 1 ? currentGameState.team1.name : currentGameState.team2.name) : (playerInfo.team === 1 ? 'Team 1' : 'Team 2');
    playerDisplayTeam.textContent = tName;
    playerDisplayTeam.style.color = playerInfo.team === 1 ? 'var(--team1-color)' : 'var(--team2-color)';
  }

  // Listen to State Updates & Buzz results
  sync.onMessage((msg) => {
    switch (msg.type) {
      case 'PLAYER_TEAM_CHANGED':
        if (playerInfo && msg.payload && msg.payload.playerId === playerInfo.playerId) {
          console.log(`[Buzzer] Host switched team: Team ${playerInfo.team} -> Team ${msg.payload.newTeam}`);
          playerInfo.team = msg.payload.newTeam;
          selectedTeam = msg.payload.newTeam;
          try {
            localStorage.setItem('feud_player_profile', JSON.stringify({
              name: playerInfo.playerName,
              team: playerInfo.team
            }));
          } catch (e) {}
          if (currentGameState) {
            handleStateUpdate(currentGameState);
          } else {
            updatePlayerTeamDisplay();
          }
        }
        break;

      case 'STATE_UPDATE':
        handleStateUpdate(msg.payload);
        break;

      case 'FACE_OFF_BUZZ':
        handleFaceOffBuzz(msg.payload);
        break;

      case 'SHOW_STRIKE':
        if (navigator.vibrate) {
          try { navigator.vibrate([200, 100, 200]); } catch(e){}
        }
        break;
    }
  });

  function handleStateUpdate(state) {
    if (!state) return;
    currentGameState = state;

    // Check if host updated this player's team or details in connectedPlayers roster
    if (playerInfo && state.connectedPlayers) {
      const serverPlayer = state.connectedPlayers.find(p => p.playerId === playerInfo.playerId);
      if (serverPlayer && serverPlayer.team && serverPlayer.team !== playerInfo.team) {
        console.log(`[Buzzer] Synced team change from roster: Team ${playerInfo.team} -> Team ${serverPlayer.team}`);
        playerInfo.team = serverPlayer.team;
        selectedTeam = serverPlayer.team;
        try {
          localStorage.setItem('feud_player_profile', JSON.stringify({
            name: playerInfo.playerName,
            team: playerInfo.team
          }));
        } catch (e) {}
      }
      if (serverPlayer && typeof serverPlayer.isCaptain !== 'undefined') {
        playerInfo.isCaptain = serverPlayer.isCaptain;
      }
    }

    // Update custom team names on join buttons too
    updateJoinTeamNames(state.team1.name, state.team2.name);

    // 1. Glowing Side Outlines (User's Team Color)
    if (buzzerContainer && playerInfo) {
      buzzerContainer.classList.toggle('team1-active', playerInfo.team === 1);
      buzzerContainer.classList.toggle('team2-active', playerInfo.team === 2);
    }

    // 2. Display ONLY Player's Own Team Score & Name (Enemy Points Hidden!)
    if (playerInfo) {
      const myTeam = playerInfo.team === 1 ? state.team1 : state.team2;
      if (myTeamScoreCard) {
        myTeamScoreCard.classList.toggle('is-team-1', playerInfo.team === 1);
        myTeamScoreCard.classList.toggle('is-team-2', playerInfo.team === 2);
      }
      if (myTeamNameDisplay) myTeamNameDisplay.textContent = myTeam.name || (playerInfo.team === 1 ? 'Team 1' : 'Team 2');
      if (myTeamScoreDisplay) myTeamScoreDisplay.textContent = `${myTeam.score || 0} PTS`;

      // Check if this player is appointed Face-Off representative (Head Player)
      const isHead = state.faceOff && (
        (playerInfo.team === 1 && state.faceOff.headPlayerTeam1 === playerInfo.playerId) ||
        (playerInfo.team === 2 && state.faceOff.headPlayerTeam2 === playerInfo.playerId)
      );

      if (myPodiumRoleBadge) {
        myPodiumRoleBadge.style.display = isHead ? 'inline-block' : 'none';
      }
    }

    // 3. Compact HUD: Round number #1 format
    if (currentRoundTag) currentRoundTag.textContent = `#${state.currentRound}`;

    updatePlayerTeamDisplay();

    // 4. Head Player Buzzer availability logic
    const isArmed = state.faceOff && state.faceOff.buzzerArmed;
    const hasWinner = state.faceOff && state.faceOff.buzzWinner;

    const myTeamPlayers = (state.connectedPlayers && playerInfo) ? state.connectedPlayers.filter(p => p.team === playerInfo.team) : [];
    const isSinglePlayer = myTeamPlayers.length <= 1;
    const headId = playerInfo ? (playerInfo.team === 1 ? state.faceOff?.headPlayerTeam1 : state.faceOff?.headPlayerTeam2) : null;

    const isHead = playerInfo && state.faceOff && (
      isSinglePlayer ||
      !headId ||
      headId === playerInfo.playerId
    );

    if (myPodiumRoleBadge) {
      myPodiumRoleBadge.style.display = isHead ? 'inline-block' : 'none';
    }

    if (!isArmed && !hasWinner) {
      hasBuzzedThisTurn = false;
      setBuzzerState('LOCKED', 'BUZZERS LOCKED');
    } else if (isArmed && !hasWinner) {
      hasBuzzedThisTurn = false;
      if (isHead) {
        setBuzzerState('ARMED', 'PRESS TO BUZZ! (AT PODIUM)');
      } else {
        const headPlayer = state.connectedPlayers ? state.connectedPlayers.find(p => p.playerId === headId) : null;
        const repName = headPlayer ? headPlayer.playerName : 'Head Player';
        setBuzzerState('SPECTATING', `SPECTATING: ${repName} is buzzing for your team!`);
      }
    } else if (hasWinner) {
      const winner = state.faceOff.buzzWinner;
      const isMe = playerInfo && winner.playerId === playerInfo.playerId;

      if (isMe) {
        setBuzzerState('BUZZED_1ST', 'YOU BUZZED 1ST!');
      } else {
        const winnerTeamName = winner.team === 1 ? state.team1.name : state.team2.name;
        setBuzzerState('LOCKED_OUT', `${winner.playerName} (${winnerTeamName}) was 1st!`);
      }
    }
  }

  function handleFaceOffBuzz(winner) {
    if (!playerInfo) return;
    if (winner.playerId === playerInfo.playerId) {
      setBuzzerState('BUZZED_1ST', 'YOU BUZZED 1ST!');
    } else {
      setBuzzerState('LOCKED_OUT', `${winner.playerName} buzzed first!`);
    }
  }

  function setBuzzerState(type, text) {
    if (!giantBuzzerBtn || !buzzerStatusText) return;

    giantBuzzerBtn.classList.remove('locked', 'buzzed-1st', 'buzzed-2nd');
    buzzerStatusText.textContent = text;

    switch (type) {
      case 'ARMED':
        giantBuzzerBtn.disabled = false;
        giantBuzzerBtn.textContent = 'BUZZ!';
        break;

      case 'SPECTATING':
      case 'LOCKED':
        giantBuzzerBtn.disabled = true;
        giantBuzzerBtn.classList.add('locked');
        giantBuzzerBtn.textContent = type === 'SPECTATING' ? 'WAIT' : 'LOCKED';
        break;

      case 'BUZZED_1ST':
        giantBuzzerBtn.disabled = true;
        giantBuzzerBtn.classList.add('buzzed-1st');
        giantBuzzerBtn.textContent = '1ST!';
        break;

      case 'LOCKED_OUT':
        giantBuzzerBtn.disabled = true;
        giantBuzzerBtn.classList.add('locked');
        giantBuzzerBtn.textContent = 'WAIT';
        break;
    }
  }

  function triggerBuzz() {
    if (!playerInfo || hasBuzzedThisTurn || (giantBuzzerBtn && giantBuzzerBtn.disabled)) {
      return;
    }

    // Strictly verify appointed head player for the round if multiple teammates present
    const myTeamPlayers = (currentGameState && currentGameState.connectedPlayers && playerInfo) ? currentGameState.connectedPlayers.filter(p => p.team === playerInfo.team) : [];
    const isSinglePlayer = myTeamPlayers.length <= 1;
    const headId = playerInfo ? (playerInfo.team === 1 ? currentGameState?.faceOff?.headPlayerTeam1 : currentGameState?.faceOff?.headPlayerTeam2) : null;

    const isHead = isSinglePlayer || !headId || headId === playerInfo.playerId;

    if (!isHead && currentGameState && currentGameState.faceOff && currentGameState.faceOff.buzzerArmed) {
      console.log('[Buzzer] Buzz rejected: Player is not appointed head player at the podium.');
      return;
    }

    hasBuzzedThisTurn = true;

    if (navigator.vibrate) {
      try { navigator.vibrate([150]); } catch(e) {}
    }

    sound.playBuzzerHit();

    sync.sendToHost('PLAYER_BUZZ', {
      playerId: playerInfo.playerId,
      playerName: playerInfo.playerName,
      team: playerInfo.team,
      timestamp: Date.now()
    });
  }

  if (giantBuzzerBtn) {
    giantBuzzerBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerBuzz();
    }, { passive: false });

    giantBuzzerBtn.addEventListener('click', () => {
      triggerBuzz();
    });
  }
});
