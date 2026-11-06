/**
 * Mobile Player Buzzer Controller
 * Enhanced for Custom Team Names and General Family Feud.
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

  // DOM Elements - Buzzer View
  const playerDisplayName = document.getElementById('playerDisplayName');
  const playerDisplayTeam = document.getElementById('playerDisplayTeam');
  const team1HudScore = document.getElementById('team1HudScore');
  const team2HudScore = document.getElementById('team2HudScore');
  const giantBuzzerBtn = document.getElementById('giantBuzzerBtn');
  const buzzerStatusText = document.getElementById('buzzerStatusText');
  const clientStatusBadge = document.getElementById('clientStatusBadge');
  const currentRoundTag = document.getElementById('currentRoundTag');

  let selectedTeam = 1;
  let playerInfo = null;
  let hasBuzzedThisTurn = false;
  let currentGameState = null;

  // Check URL query parameters for room code
  const urlParams = new URLSearchParams(window.location.search);
  const initialRoom = urlParams.get('room') || 'FEUD';
  if (roomCodeInput) roomCodeInput.value = initialRoom;

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
        return;
      }
      const room = ((roomCodeInput ? roomCodeInput.value : '') || 'FEUD').toUpperCase().trim();

      playerInfo = {
        playerId: 'p-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        playerName: name,
        team: selectedTeam,
        joinedAt: Date.now()
      };

      try {
        localStorage.setItem('feud_player_profile', JSON.stringify({ name, team: selectedTeam }));
      } catch (e) {}

      enterBuzzerView(room);
    });
  }

  function enterBuzzerView(room) {
    if (joinView) joinView.style.display = 'none';
    if (buzzerView) buzzerView.style.display = 'flex';

    if (playerDisplayName) playerDisplayName.textContent = playerInfo.playerName;
    updatePlayerTeamDisplay();

    // Connect via SyncEngine
    sync.initClientPeer(room, playerInfo, (status) => {
      if (!clientStatusBadge) return;
      if (status.status === 'connected') {
        clientStatusBadge.className = 'badge badge-green';
        clientStatusBadge.textContent = 'Connected';
      } else if (status.status === 'connecting') {
        clientStatusBadge.className = 'badge badge-gold';
        clientStatusBadge.textContent = 'Connecting...';
      } else {
        clientStatusBadge.className = 'badge badge-red';
        clientStatusBadge.textContent = 'Offline / Local';
      }
    });
  }

  function updatePlayerTeamDisplay() {
    if (!playerInfo || !playerDisplayTeam) return;
    const tName = currentGameState ? (playerInfo.team === 1 ? currentGameState.team1.name : currentGameState.team2.name) : (playerInfo.team === 1 ? 'Team 1' : 'Team 2');
    playerDisplayTeam.textContent = tName;
    playerDisplayTeam.style.color = playerInfo.team === 1 ? 'var(--team1-color)' : 'var(--team2-color)';
  }

  // Listen to State Updates & Buzz results
  sync.onMessage((msg) => {
    switch (msg.type) {
      case 'STATE_UPDATE':
        handleStateUpdate(msg.payload);
        break;

      case 'FACE_OFF_BUZZ':
        handleFaceOffBuzz(msg.payload);
        break;

      case 'SHOW_STRIKE':
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        break;
    }
  });

  function handleStateUpdate(state) {
    if (!state) return;
    currentGameState = state;

    // Update custom team names on join buttons too
    updateJoinTeamNames(state.team1.name, state.team2.name);

    // Update HUD Scores & Round
    if (team1HudScore) team1HudScore.textContent = `${state.team1.name}: ${state.team1.score}`;
    if (team2HudScore) team2HudScore.textContent = `${state.team2.name}: ${state.team2.score}`;
    if (currentRoundTag) currentRoundTag.textContent = `Round ${state.currentRound}`;

    updatePlayerTeamDisplay();

    // Buzzer lock state
    const isArmed = state.faceOff && state.faceOff.buzzerArmed;
    const hasWinner = state.faceOff && state.faceOff.buzzWinner;

    if (!isArmed && !hasWinner) {
      hasBuzzedThisTurn = false;
      setBuzzerState('LOCKED', 'BUZZERS LOCKED');
    } else if (isArmed && !hasWinner) {
      hasBuzzedThisTurn = false;
      setBuzzerState('ARMED', 'PRESS TO BUZZ!');
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

      case 'LOCKED':
        giantBuzzerBtn.disabled = true;
        giantBuzzerBtn.classList.add('locked');
        giantBuzzerBtn.textContent = 'LOCKED';
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

    hasBuzzedThisTurn = true;

    if (navigator.vibrate) {
      navigator.vibrate([150]);
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
