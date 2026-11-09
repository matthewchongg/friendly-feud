/**
 * Family Feud Game Board Controller (Projector / Main Display)
 * Enhanced for Custom Team Names, Dynamic Total Rounds, and General Family Feud.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sync = new SyncEngine('board');
  const sound = window.soundEngine;
  const confetti = new ConfettiCannon('confettiCanvas');

  // DOM Elements
  const team1NameEl = document.getElementById('team1Name');
  const team1ScoreEl = document.getElementById('team1Score');
  const team1CardEl = document.getElementById('team1Card');

  const team2NameEl = document.getElementById('team2Name');
  const team2ScoreEl = document.getElementById('team2Score');
  const team2CardEl = document.getElementById('team2Card');

  const bankScoreEl = document.getElementById('bankScore');
  const roundPillEl = document.getElementById('roundPill');
  const questionTextEl = document.getElementById('questionText');
  const cardsGridEl = document.getElementById('cardsGrid');

  const strikesOverlayEl = document.getElementById('strikesOverlay');
  const strikeSymbolsEl = document.getElementById('strikeSymbols');

  const eventBannerEl = document.getElementById('eventBanner');
  const ribbonTitleEl = document.getElementById('ribbonTitle');
  const ribbonDescEl = document.getElementById('ribbonDesc');
  const timerBadgeEl = document.getElementById('timerBadge');
  const timerCountEl = document.getElementById('timerCount');

  const winnerModalEl = document.getElementById('winnerModal');
  const winnerTeamNameEl = document.getElementById('winnerTeamName');
  const finalTeam1LabelEl = document.getElementById('finalTeam1Label');
  const finalTeam2LabelEl = document.getElementById('finalTeam2Label');
  const finalTeam1ScoreEl = document.getElementById('finalTeam1Score');
  const finalTeam2ScoreEl = document.getElementById('finalTeam2Score');

  const roomBadgeEl = document.getElementById('roomBadge');
  const boardPlayersBadgeEl = document.getElementById('boardPlayersBadge');
  const boardPlayerCountEl = document.getElementById('boardPlayerCount');
  const boardQrBtn = document.getElementById('boardQrBtn');
  const boardQrModal = document.getElementById('boardQrModal');
  const boardQrCanvas = document.getElementById('boardQrCanvas');
  const boardQrUrl = document.getElementById('boardQrUrl');
  const closeBoardQrBtn = document.getElementById('closeBoardQrBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Load initial state
  let state = window.gameState.get();
  renderState(state);

  // Parse room code from query params if given
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = (urlParams.get('room') || state.roomCode || '').toUpperCase().trim();
  if (roomBadgeEl) roomBadgeEl.textContent = roomParam ? `ROOM: ${roomParam}` : 'ROOM: WAITING...';

  // Start Sync Engine as VIEWER (Board connects to Host without fighting for host ID)
  if (roomParam) {
    sync.initViewerPeer(roomParam, (status) => {
      console.log('[Board] Sync status:', status);
      if (status.status === 'connected') {
        if (roomBadgeEl) {
          roomBadgeEl.className = 'badge badge-green';
          roomBadgeEl.textContent = `ROOM: ${roomParam} (LIVE)`;
        }
      }
    });
  }

  // Listen to sync messages from Admin or Local Broadcast
  sync.onMessage((msg) => {
    switch (msg.type) {
      case 'STATE_UPDATE':
        state = msg.payload;
        window.gameState.update(state);
        renderState(state);
        if (state.roomCode && roomBadgeEl) {
          roomBadgeEl.textContent = `ROOM: ${state.roomCode}${sync.isOnline ? ' (LIVE)' : ''}`;
        }
        break;

      case 'PLAY_SOUND':
        handleSound(msg.payload.sound);
        break;

      case 'SHOW_STRIKE':
        showStrikeAnimation(msg.payload.count || 1);
        break;

      case 'TIMER_TICK':
        updateTimerDisplay(msg.payload.remaining, msg.payload.duration);
        break;

      case 'TIMER_TIMEOUT':
        sound.playTimeOut();
        if (timerBadgeEl) timerBadgeEl.classList.add('danger');
        break;

      case 'FACE_OFF_BUZZ':
        sound.playBuzzerHit();
        showBuzzBanner(msg.payload);
        break;

      case 'DECLARE_WINNER':
        showGrandWinner(msg.payload);
        break;
    }
  });

  function renderState(s) {
    if (!s) return;

    // Custom Team Names & Scores
    if (team1NameEl) team1NameEl.textContent = s.team1.name || 'Team 1';
    if (team1ScoreEl) team1ScoreEl.textContent = s.team1.score;
    if (team2NameEl) team2NameEl.textContent = s.team2.name || 'Team 2';
    if (team2ScoreEl) team2ScoreEl.textContent = s.team2.score;

    // Active controlling team highlight
    if (team1CardEl && team2CardEl) {
      team1CardEl.classList.toggle('active-control', s.controllingTeam === 1);
      team2CardEl.classList.toggle('active-control', s.controllingTeam === 2);
    }

    // Bank & Dynamic Custom Rounds Info
    if (bankScoreEl) bankScoreEl.textContent = s.bank || 0;
    const multiplierText = s.multiplier > 1 ? ` (${s.multiplier}X POINTS)` : '';
    const totalRounds = s.totalRounds || 3;
    if (roundPillEl) roundPillEl.textContent = `ROUND ${s.currentRound} OF ${totalRounds}${multiplierText}`;

    // Question
    if (questionTextEl) {
      questionTextEl.textContent = s.currentQuestion ? s.currentQuestion.question : 'Ready for Face-Off Question...';
    }

    // Render Answer Cards (Max 8 slots)
    renderCards(s.currentQuestion ? s.currentQuestion.answers : []);

    // Connected Players Count on Board
    if (boardPlayersBadgeEl && boardPlayerCountEl) {
      const pCount = s.connectedPlayers ? s.connectedPlayers.length : 0;
      boardPlayerCountEl.textContent = pCount;
      boardPlayersBadgeEl.style.display = pCount > 0 ? 'inline-flex' : 'none';
    }

    // Phase Banner logic
    renderPhaseBanner(s);

    // Winner modal check
    if (s.phase === 'GRAND_WINNER' && s.winner) {
      showGrandWinner(s.winner);
    } else {
      if (winnerModalEl) winnerModalEl.classList.remove('active');
    }
  }

  function renderCards(answers = []) {
    if (!cardsGridEl) return;
    cardsGridEl.innerHTML = '';

    for (let i = 0; i < 8; i++) {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'card-slot';

      if (i < answers.length) {
        const ans = answers[i];
        if (ans.revealed) {
          slotDiv.classList.add('revealed');
        }

        slotDiv.innerHTML = `
          <div class="card-inner">
            <div class="card-face card-front">
              <div class="slot-number-circle">${i + 1}</div>
            </div>
            <div class="card-face card-back">
              <span class="card-answer-text">${ans.text}</span>
              <div class="card-points-box">${ans.points}</div>
            </div>
          </div>
        `;
      } else {
        slotDiv.classList.add('empty-slot');
        slotDiv.innerHTML = `
          <div class="card-inner">
            <div class="card-face card-front"></div>
          </div>
        `;
      }

      cardsGridEl.appendChild(slotDiv);
    }
  }

  function renderPhaseBanner(s) {
    if (!eventBannerEl) return;

    if (s.phase === 'STEAL') {
      eventBannerEl.className = 'status-ribbon steal-mode';
      const stealTeam = s.steal && s.steal.stealingTeam === 1 ? s.team1.name : s.team2.name;
      if (ribbonTitleEl) ribbonTitleEl.textContent = 'STEAL OPPORTUNITY!';
      if (ribbonDescEl) ribbonDescEl.textContent = `${stealTeam} - 15 Seconds Group Conferral!`;
    } else if (s.phase === 'FACE_OFF') {
      eventBannerEl.className = 'status-ribbon';
      if (ribbonTitleEl) ribbonTitleEl.textContent = 'THE FACE-OFF';
      if (s.faceOff && s.faceOff.buzzWinner) {
        const winnerTeam = s.faceOff.buzzWinner.team === 1 ? s.team1.name : s.team2.name;
        if (ribbonDescEl) ribbonDescEl.textContent = `BUZZ IN: ${s.faceOff.buzzWinner.playerName} (${winnerTeam})`;
      } else {
        const t1Head = s.connectedPlayers ? s.connectedPlayers.find(p => p.playerId === s.faceOff.headPlayerTeam1) : null;
        const t2Head = s.connectedPlayers ? s.connectedPlayers.find(p => p.playerId === s.faceOff.headPlayerTeam2) : null;
        if (t1Head && t2Head) {
          if (ribbonDescEl) ribbonDescEl.textContent = s.faceOff.buzzerArmed ? `AT PODIUM: ${t1Head.playerName} vs ${t2Head.playerName} — BUZZERS ARMED!` : `AT PODIUM: ${t1Head.playerName} vs ${t2Head.playerName}`;
        } else {
          if (ribbonDescEl) ribbonDescEl.textContent = s.faceOff.buzzerArmed ? 'BUZZERS ARMED! FIRST TO BUZZ WINS.' : 'Waiting for Face-Off...';
        }
      }
    } else if (s.phase === 'BOARD_PLAY') {
      eventBannerEl.className = 'status-ribbon';
      const cTeamName = s.controllingTeam === 1 ? s.team1.name : s.team2.name;
      if (ribbonTitleEl) ribbonTitleEl.textContent = 'PLAYING THE BOARD';
      if (ribbonDescEl) ribbonDescEl.textContent = `${cTeamName} in control. No consultation!`;
    } else {
      eventBannerEl.className = 'status-ribbon';
      if (ribbonTitleEl) ribbonTitleEl.textContent = 'FAMILY FEUD';
      if (ribbonDescEl) ribbonDescEl.textContent = 'Let\'s Play The Feud!';
    }
  }

  function showStrikeAnimation(count) {
    if (!strikesOverlayEl || !strikeSymbolsEl) return;
    strikeSymbolsEl.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const x = document.createElement('span');
      x.className = 'strike-big-x';
      x.textContent = 'X';
      strikeSymbolsEl.appendChild(x);
    }

    strikesOverlayEl.classList.add('active');

    if (count >= 3) {
      sound.playTripleStrike();
    } else if (count === 2) {
      sound.playDoubleStrike();
    } else {
      sound.playStrike();
    }

    setTimeout(() => {
      strikesOverlayEl.classList.remove('active');
    }, 1800);
  }

  function showBuzzBanner(data) {
    if (ribbonDescEl) {
      const tName = data.teamName || (data.team === 1 ? state.team1.name : state.team2.name);
      ribbonDescEl.textContent = `BUZZ: ${data.playerName} (${tName})`;
    }
  }

  function updateTimerDisplay(remaining, duration) {
    if (!timerBadgeEl || !timerCountEl) return;
    timerBadgeEl.style.display = 'flex';
    timerCountEl.textContent = `${remaining}s`;

    timerBadgeEl.classList.remove('warning', 'danger');
    if (remaining <= 5 && remaining > 0) {
      timerBadgeEl.classList.add('danger');
      sound.playTick();
    } else if (remaining <= 10) {
      timerBadgeEl.classList.add('warning');
    }
  }

  function showGrandWinner(winnerData) {
    if (!winnerModalEl) return;
    winnerModalEl.classList.add('active');
    if (winnerTeamNameEl) winnerTeamNameEl.textContent = winnerData.name || 'WINNER';
    if (finalTeam1LabelEl) finalTeam1LabelEl.textContent = state.team1.name;
    if (finalTeam2LabelEl) finalTeam2LabelEl.textContent = state.team2.name;
    if (finalTeam1ScoreEl) finalTeam1ScoreEl.textContent = state.team1.score;
    if (finalTeam2ScoreEl) finalTeam2ScoreEl.textContent = state.team2.score;

    confetti.start(8000);
    sound.playFanfare();
  }

  function handleSound(type) {
    switch (type) {
      case 'DING': sound.playDing(); break;
      case 'STRIKE': sound.playStrike(); break;
      case 'DOUBLE_STRIKE': sound.playDoubleStrike(); break;
      case 'TRIPLE_STRIKE': sound.playTripleStrike(); break;
      case 'FACE_OFF': sound.playFaceOff(); break;
      case 'THEME_PLAY': sound.playTheme(); break;
      case 'THEME_STOP': sound.stopTheme(); break;
      case 'BUZZER': sound.playBuzzerHit(); break;
      case 'STEAL_GONG': sound.playStealGong(); break;
      case 'FANFARE': sound.playFanfare(); break;
    }
  }

  // QR Code on Board Screen
  if (boardQrBtn) {
    boardQrBtn.addEventListener('click', () => {
      try {
        const buzzerUrl = new URL('buzzer.html', window.location.href);
        const curRoom = state.roomCode || roomParam;
        buzzerUrl.searchParams.set('room', curRoom);
        const finalUrl = buzzerUrl.href;

        if (boardQrUrl) boardQrUrl.textContent = finalUrl;
        if (window.QRCodeRenderer && boardQrCanvas) {
          window.QRCodeRenderer.toCanvas(boardQrCanvas, finalUrl, { width: 220, colorDark: '#000000' });
        }
        if (boardQrModal) boardQrModal.classList.add('active');
      } catch (e) {
        console.warn('Error generating QR on board:', e);
      }
    });
  }

  if (closeBoardQrBtn) {
    closeBoardQrBtn.addEventListener('click', () => {
      if (boardQrModal) boardQrModal.classList.remove('active');
    });
  }

  // Header controls
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      soundToggleBtn.innerHTML = isMuted ? '🔇 Unmute' : '🔊 Sound FX';
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Keyboard Hotkeys on the Board screen
  window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '8') {
      const index = parseInt(e.key, 10) - 1;
      if (state.currentQuestion && state.currentQuestion.answers[index]) {
        const ans = state.currentQuestion.answers[index];
        ans.revealed = !ans.revealed;
        if (ans.revealed) {
          state.bank = (state.bank || 0) + (ans.points * state.multiplier);
          sound.playDing();
        } else {
          state.bank = Math.max(0, (state.bank || 0) - (ans.points * state.multiplier));
        }
        window.gameState.update(state);
        sync.broadcast('STATE_UPDATE', state);
        renderState(state);
      }
    }
    if (e.key.toLowerCase() === 'x') {
      state.strikes = Math.min(3, (state.strikes || 0) + 1);
      showStrikeAnimation(state.strikes);
      window.gameState.update(state);
      sync.broadcast('SHOW_STRIKE', { count: state.strikes });
      sync.broadcast('STATE_UPDATE', state);
    }
  });
});
