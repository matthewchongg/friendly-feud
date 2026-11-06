/**
 * Family Feud Admin / Supervisor Controller
 * Enhanced with Question Bank Tabs, Spreadsheet Upload (CSV & XLSX),
 * Active Question Banner, Dynamic Rounds, and Custom Team Names.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sync = new SyncEngine('host');
  const sound = window.soundEngine;
  const qManager = window.questionManager;

  let state = window.gameState.get();
  let timerInterval = null;

  // DOM Elements - Navigation & Room
  const roomCodeInput = document.getElementById('roomCodeInput');
  const setRoomBtn = document.getElementById('setRoomBtn');
  const randomRoomBtn = document.getElementById('randomRoomBtn');
  const reconnectWebRtcBtn = document.getElementById('reconnectWebRtcBtn');
  const clearRosterBtn = document.getElementById('clearRosterBtn');
  const webrtcStatusEl = document.getElementById('webrtcStatus');
  const openBoardBtn = document.getElementById('openBoardBtn');
  const openBuzzerBtn = document.getElementById('openBuzzerBtn');
  const showQrBtn = document.getElementById('showQrBtn');
  const qrModalEl = document.getElementById('qrModal');
  const qrCanvas = document.getElementById('qrCanvas');
  const qrJoinUrlEl = document.getElementById('qrJoinUrl');

  // DOM Elements - Rounds & Multipliers
  const roundButtonsContainer = document.getElementById('roundButtonsContainer');
  const totalRoundsInput = document.getElementById('totalRoundsInput');
  const updateRoundsCountBtn = document.getElementById('updateRoundsCountBtn');
  const multiplierSelect = document.getElementById('multiplierSelect');
  const resetRoundBtn = document.getElementById('resetRoundBtn');
  const nextRoundBtn = document.getElementById('nextRoundBtn');
  const declareWinnerBtn = document.getElementById('declareWinnerBtn');

  // DOM Elements - Teams Setup
  const team1NameInput = document.getElementById('team1NameInput');
  const team2NameInput = document.getElementById('team2NameInput');
  const updateTeamsBtn = document.getElementById('updateTeamsBtn');
  const team1ScoreDisplay = document.getElementById('team1ScoreDisplay');
  const team2ScoreDisplay = document.getElementById('team2ScoreDisplay');

  // DOM Elements - Face-Off
  const armBuzzerBtn = document.getElementById('armBuzzerBtn');
  const resetBuzzerBtn = document.getElementById('resetBuzzerBtn');
  const firstBuzzBox = document.getElementById('firstBuzzBox');
  const secondBuzzBox = document.getElementById('secondBuzzBox');
  const firstPlayerText = document.getElementById('firstPlayerText');
  const secondPlayerText = document.getElementById('secondPlayerText');
  const faceoffStatusText = document.getElementById('faceoffStatusText');

  const ruleDirectWinBtn = document.getElementById('ruleDirectWinBtn');
  const rulePassOpponentBtn = document.getElementById('rulePassOpponentBtn');
  const ruleDefaultControlBtn = document.getElementById('ruleDefaultControlBtn');

  // DOM Elements - Board Play & Timer
  const controllingTeamSelect = document.getElementById('controllingTeamSelect');
  const turnPlayerDisplay = document.getElementById('turnPlayerDisplay');
  const nextPlayerTurnBtn = document.getElementById('nextPlayerTurnBtn');
  const startTimer20Btn = document.getElementById('startTimer20Btn');
  const pauseTimerBtn = document.getElementById('pauseTimerBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');
  const timerDigitsEl = document.getElementById('timerDigits');

  // DOM Elements - Active Question Banner & Answers Matrix
  const activeQIndexBadge = document.getElementById('activeQIndexBadge');
  const activeQStatsBadge = document.getElementById('activeQStatsBadge');
  const prevQBtn = document.getElementById('prevQBtn');
  const nextQBtn = document.getElementById('nextQBtn');
  const manageQuestionsMainBtn = document.getElementById('manageQuestionsMainBtn');
  const adminQuestionText = document.getElementById('adminQuestionText');
  const adminQuestionSelect = document.getElementById('adminQuestionSelect');
  const revealedPointsSummary = document.getElementById('revealedPointsSummary');
  const adminAnswersList = document.getElementById('adminAnswersList');

  // DOM Elements - Strikes & Steal
  const strikeCountDisplay = document.getElementById('strikeCountDisplay');
  const addStrike1Btn = document.getElementById('addStrike1Btn');
  const addStrike2Btn = document.getElementById('addStrike2Btn');
  const addStrike3Btn = document.getElementById('addStrike3Btn');
  const clearStrikesBtn = document.getElementById('clearStrikesBtn');

  const startSteal15Btn = document.getElementById('startSteal15Btn');
  const stealSuccessBtn = document.getElementById('stealSuccessBtn');
  const stealFailedBtn = document.getElementById('stealFailedBtn');

  // DOM Elements - Bank & Manual Scores
  const adminBankScore = document.getElementById('adminBankScore');
  const awardBankTeam1Btn = document.getElementById('awardBankTeam1Btn');
  const awardBankTeam2Btn = document.getElementById('awardBankTeam2Btn');
  const clearBankBtn = document.getElementById('clearBankBtn');

  const team1Plus10 = document.getElementById('team1Plus10');
  const team1Minus10 = document.getElementById('team1Minus10');
  const team2Plus10 = document.getElementById('team2Plus10');
  const team2Minus10 = document.getElementById('team2Minus10');

  // DOM Elements - Players Roster
  const connectedCountEl = document.getElementById('connectedCount');
  const playersRosterList = document.getElementById('playersRosterList');

  // DOM Elements - Question Bank & Spreadsheet Modal
  const manageQuestionsBtn = document.getElementById('manageQuestionsBtn');
  const uploadSpreadsheetSidebarBtn = document.getElementById('uploadSpreadsheetSidebarBtn');
  const downloadTemplateSidebarBtn = document.getElementById('downloadTemplateSidebarBtn');
  const totalQuestionsCountBadge = document.getElementById('totalQuestionsCountBadge');

  const questionsModalEl = document.getElementById('questionsModal');
  const tabBankBtn = document.getElementById('tabBankBtn');
  const tabSpreadsheetBtn = document.getElementById('tabSpreadsheetBtn');
  const tabBuilderBtn = document.getElementById('tabBuilderBtn');
  const tabBankCount = document.getElementById('tabBankCount');

  const qSearchInput = document.getElementById('qSearchInput');
  const customQListEl = document.getElementById('customQList');
  const exportQBtn = document.getElementById('exportQBtn');
  const importQInput = document.getElementById('importQInput');
  const resetDefaultQBtn = document.getElementById('resetDefaultQBtn');

  // Spreadsheet upload elements
  const spreadsheetDropzone = document.getElementById('spreadsheetDropzone');
  const spreadsheetFileInput = document.getElementById('spreadsheetFileInput');
  const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');

  // Question Builder Form elements
  const builderModeTitle = document.getElementById('builderModeTitle');
  const builderPointsSumBadge = document.getElementById('builderPointsSumBadge');
  const editingQuestionIdInput = document.getElementById('editingQuestionId');
  const qPromptInput = document.getElementById('qPromptInput');
  const answersBuilderDiv = document.getElementById('answersBuilder');
  const clearBuilderRowsBtn = document.getElementById('clearBuilderRowsBtn');
  const saveCustomQBtn = document.getElementById('saveCustomQBtn');
  const cancelEditQBtn = document.getElementById('cancelEditQBtn');

  // Sound FX buttons
  const sfxDingBtn = document.getElementById('sfxDing');
  const sfxStrikeBtn = document.getElementById('sfxStrike');
  const sfxTripleStrikeBtn = document.getElementById('sfxTripleStrike');
  const sfxBuzzerBtn = document.getElementById('sfxBuzzer');
  const sfxGongBtn = document.getElementById('sfxGong');
  const sfxFanfareBtn = document.getElementById('sfxFanfare');
  const sfxMuteBtn = document.getElementById('sfxMute');

  // --- Initial Setup ---
  initRoom();
  buildAnswersInputForm();
  renderDynamicRoundsBar();
  populateQuestionDropdown();

  // If question was not set or invalid, load default
  if (!state.currentQuestion || !state.currentQuestion.answers) {
    loadQuestion(qManager.getAll()[0]);
  } else {
    // Ensure currentQuestion matches bank ID if present
    const matched = qManager.getById(state.currentQuestion.id);
    if (!matched) {
      loadQuestion(qManager.getAll()[0]);
    }
  }

  renderUI();

  // --- WebRTC & Sync Setup ---
  function initRoom() {
    const code = (state.roomCode || 'FEUD').toUpperCase().trim();
    if (roomCodeInput) roomCodeInput.value = code;

    sync.initHostPeer(code, (evt) => {
      if (!webrtcStatusEl) return;
      if (evt.status === 'connected') {
        webrtcStatusEl.className = 'badge badge-green';
        webrtcStatusEl.textContent = `🟢 Online: ${code} (${evt.connectedCount || 0} buzzers)`;
        webrtcStatusEl.title = `Host active. Peer ID: feud-room-${code}. Devices connected: ${evt.connectedCount || 0}`;
      } else if (evt.status === 'id-taken') {
        webrtcStatusEl.className = 'badge badge-gold';
        webrtcStatusEl.textContent = `⚠️ Room "${code}" Busy (Click "🎲 New")`;
        webrtcStatusEl.title = 'Room code is occupied or clearing. Click "🎲 New" for a fresh room code.';
      } else if (evt.status === 'disconnected') {
        webrtcStatusEl.className = 'badge badge-gold';
        webrtcStatusEl.textContent = '🟡 Reconnecting...';
      } else {
        webrtcStatusEl.className = 'badge badge-red';
        webrtcStatusEl.textContent = '🔴 Offline (Local Bus)';
      }
    });
  }

  sync.onMessage((msg) => {
    switch (msg.type) {
      case 'PLAYER_JOIN':
        handlePlayerJoin(msg.payload);
        break;
      case 'PLAYER_BUZZ':
        handlePlayerBuzz(msg.payload);
        break;
      case 'PLAYER_DISCONNECT':
        handlePlayerDisconnect(msg.payload);
        break;
    }
  });

  function broadcastState() {
    window.gameState.update(state);
    sync.broadcast('STATE_UPDATE', state);
  }

  // --- Custom Team Names Update ---
  function updateTeamNames() {
    const t1 = team1NameInput ? team1NameInput.value.trim() : '';
    const t2 = team2NameInput ? team2NameInput.value.trim() : '';

    state.team1.name = t1 || 'Team 1';
    state.team2.name = t2 || 'Team 2';

    broadcastState();
    renderUI();
  }

  if (updateTeamsBtn) {
    updateTeamsBtn.addEventListener('click', updateTeamNames);
  }

  [team1NameInput, team2NameInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', updateTeamNames);
      inp.addEventListener('change', updateTeamNames);
      inp.addEventListener('blur', updateTeamNames);
    }
  });

  // --- Dynamic Custom Amounts of Rounds ---
  function renderDynamicRoundsBar() {
    if (!roundButtonsContainer) return;
    roundButtonsContainer.innerHTML = '';

    const total = state.totalRounds || 3;
    if (totalRoundsInput) totalRoundsInput.value = total;

    for (let r = 1; r <= total; r++) {
      const btn = document.createElement('button');
      btn.className = `round-btn ${state.currentRound === r ? 'active' : ''}`;
      const mult = state.roundMultipliers && state.roundMultipliers[r] ? state.roundMultipliers[r] : (r >= 3 ? 3 : r);
      btn.textContent = `Round ${r} (${mult}X)`;

      btn.addEventListener('click', () => {
        setRound(r);
      });

      roundButtonsContainer.appendChild(btn);
    }
  }

  function setRound(r) {
    state.currentRound = r;
    const mult = (state.roundMultipliers && state.roundMultipliers[r]) ? state.roundMultipliers[r] : (r >= 3 ? 3 : r);
    state.multiplier = mult;
    if (multiplierSelect) multiplierSelect.value = mult;

    broadcastState();
    renderDynamicRoundsBar();
    renderUI();
  }

  if (updateRoundsCountBtn) {
    updateRoundsCountBtn.addEventListener('click', () => {
      const count = parseInt(totalRoundsInput.value, 10);
      if (isNaN(count) || count < 1 || count > 15) {
        alert('Please enter a valid round count between 1 and 15.');
        return;
      }
      state.totalRounds = count;
      if (state.currentRound > count) {
        state.currentRound = count;
      }
      broadcastState();
      renderDynamicRoundsBar();
      renderUI();
    });
  }

  if (nextRoundBtn) {
    nextRoundBtn.addEventListener('click', () => {
      const total = state.totalRounds || 3;
      if (state.currentRound < total) {
        window.gameState.resetRound();
        state = window.gameState.get();
        setRound(state.currentRound + 1);
      } else {
        alert(`You are already on the final round (Round ${total})! Click "Declare Grand Winner" when finished.`);
      }
    });
  }

  if (multiplierSelect) {
    multiplierSelect.addEventListener('change', () => {
      const val = parseInt(multiplierSelect.value, 10) || 1;
      state.multiplier = val;
      if (!state.roundMultipliers) state.roundMultipliers = {};
      state.roundMultipliers[state.currentRound] = val;
      broadcastState();
      renderDynamicRoundsBar();
    });
  }

  // --- Face-Off Buzzer Logic ---
  function handlePlayerBuzz(player) {
    if (!state.faceOff.buzzerArmed) return;

    // Enforce Head Player rule: only appointed representative from each team can buzz!
    if (state.faceOff.headPlayerTeam1 && player.team === 1 && player.playerId !== state.faceOff.headPlayerTeam1) {
      console.log(`[Admin] Buzz ignored: ${player.playerName} is not Team 1's appointed head player.`);
      return;
    }
    if (state.faceOff.headPlayerTeam2 && player.team === 2 && player.playerId !== state.faceOff.headPlayerTeam2) {
      console.log(`[Admin] Buzz ignored: ${player.playerName} is not Team 2's appointed head player.`);
      return;
    }

    sound.playBuzzerHit();

    if (!state.faceOff.buzzWinner) {
      state.faceOff.buzzWinner = player;
      state.faceOff.buzzerArmed = false;
      const tName = player.team === 1 ? state.team1.name : state.team2.name;
      state.faceOff.statusText = `1st Buzz: ${player.playerName} (${tName})!`;
      
      sync.broadcast('FACE_OFF_BUZZ', player);
      broadcastState();
      renderUI();
    } else if (!state.faceOff.secondBuzz && player.playerId !== state.faceOff.buzzWinner.playerId) {
      state.faceOff.secondBuzz = player;
      broadcastState();
      renderUI();
    }
  }

  function handlePlayerJoin(player) {
    if (!player || !player.playerId) return;
    const existingIdx = state.connectedPlayers.findIndex(p => p.playerId === player.playerId);
    if (existingIdx >= 0) {
      state.connectedPlayers[existingIdx] = player;
    } else {
      state.connectedPlayers.push(player);
    }

    // Auto-assign head player if not set yet for this team
    if (player.team === 1 && !state.faceOff.headPlayerTeam1) {
      state.faceOff.headPlayerTeam1 = player.playerId;
    } else if (player.team === 2 && !state.faceOff.headPlayerTeam2) {
      state.faceOff.headPlayerTeam2 = player.playerId;
    }

    broadcastState();
    renderUI();
  }
    broadcastState();
    renderUI();
  }

  function handlePlayerDisconnect(payload) {}

  // --- Active Question Navigation & Management ---
  function populateQuestionDropdown() {
    if (!adminQuestionSelect) return;
    adminQuestionSelect.innerHTML = '';
    const all = qManager.getAll();

    all.forEach((q, idx) => {
      const opt = document.createElement('option');
      opt.value = q.id;
      opt.textContent = `${idx + 1}. ${q.question}`;
      adminQuestionSelect.appendChild(opt);
    });

    if (state.currentQuestion) {
      adminQuestionSelect.value = state.currentQuestion.id;
    }

    const totalCount = all.length;
    if (totalQuestionsCountBadge) totalQuestionsCountBadge.textContent = `${totalCount} Loaded`;
    if (tabBankCount) tabBankCount.textContent = totalCount;
  }

  function loadQuestion(q) {
    if (!q) return;
    state.currentQuestion = {
      id: q.id,
      question: q.question,
      answers: q.answers.map(a => ({
        text: a.text,
        points: a.points,
        revealed: false
      }))
    };
    broadcastState();
    renderUI();
  }

  if (adminQuestionSelect) {
    adminQuestionSelect.addEventListener('change', () => {
      const q = qManager.getById(adminQuestionSelect.value);
      if (q) loadQuestion(q);
    });
  }

  if (prevQBtn) {
    prevQBtn.addEventListener('click', () => {
      const all = qManager.getAll();
      if (!all || all.length === 0) return;
      const currentIdx = state.currentQuestion ? all.findIndex(q => q.id === state.currentQuestion.id) : 0;
      const prevIdx = currentIdx <= 0 ? all.length - 1 : currentIdx - 1;
      loadQuestion(all[prevIdx]);
    });
  }

  if (nextQBtn) {
    nextQBtn.addEventListener('click', () => {
      const all = qManager.getAll();
      if (!all || all.length === 0) return;
      const currentIdx = state.currentQuestion ? all.findIndex(q => q.id === state.currentQuestion.id) : 0;
      const nextIdx = (currentIdx + 1) % all.length;
      loadQuestion(all[nextIdx]);
    });
  }

  // --- Render Admin UI ---
  function renderUI() {
    // Teams & Scores
    if (team1NameInput && document.activeElement !== team1NameInput) {
      team1NameInput.value = state.team1.name;
    }
    if (team2NameInput && document.activeElement !== team2NameInput) {
      team2NameInput.value = state.team2.name;
    }
    if (team1ScoreDisplay) team1ScoreDisplay.textContent = state.team1.score;
    if (team2ScoreDisplay) team2ScoreDisplay.textContent = state.team2.score;
    if (adminBankScore) adminBankScore.textContent = state.bank;

    if (awardBankTeam1Btn) awardBankTeam1Btn.textContent = `Award Bank ➔ ${state.team1.name}`;
    if (awardBankTeam2Btn) awardBankTeam2Btn.textContent = `Award Bank ➔ ${state.team2.name}`;

    // Face-Off Display
    if (faceoffStatusText) faceoffStatusText.textContent = state.faceOff.statusText;
    if (firstPlayerText) {
      firstPlayerText.textContent = state.faceOff.buzzWinner ? `${state.faceOff.buzzWinner.playerName} (${state.faceOff.buzzWinner.team === 1 ? state.team1.name : state.team2.name})` : 'Waiting...';
    }
    if (secondPlayerText) {
      secondPlayerText.textContent = state.faceOff.secondBuzz ? `${state.faceOff.secondBuzz.playerName} (${state.faceOff.secondBuzz.team === 1 ? state.team1.name : state.team2.name})` : 'Waiting...';
    }
    if (firstBuzzBox) firstBuzzBox.classList.toggle('buzz-first', !!state.faceOff.buzzWinner);
    if (secondBuzzBox) secondBuzzBox.classList.toggle('buzz-second', !!state.faceOff.secondBuzz);

    if (armBuzzerBtn) {
      armBuzzerBtn.textContent = state.faceOff.buzzerArmed ? '🔴 BUZZERS LIVE (Armed)' : '⚡ ARM BUZZERS';
      armBuzzerBtn.className = state.faceOff.buzzerArmed ? 'btn-danger' : 'btn-primary';
    }

    // Controlling Team dropdown
    if (controllingTeamSelect) {
      controllingTeamSelect.options[1].textContent = `1. ${state.team1.name}`;
      controllingTeamSelect.options[2].textContent = `2. ${state.team2.name}`;
      controllingTeamSelect.value = state.controllingTeam || '';
    }
    renderTurnPlayer();

    // Active Question Banner Details
    if (state.currentQuestion) {
      if (adminQuestionText) adminQuestionText.textContent = state.currentQuestion.question;
      const allQ = qManager.getAll();
      const currentIdx = allQ.findIndex(q => q.id === state.currentQuestion.id);
      if (activeQIndexBadge) {
        activeQIndexBadge.textContent = currentIdx >= 0 ? `Question #${currentIdx + 1} of ${allQ.length}` : 'Custom Question';
      }
      const totalPts = state.currentQuestion.answers.reduce((acc, a) => acc + (a.points || 0), 0);
      if (activeQStatsBadge) {
        activeQStatsBadge.textContent = `${state.currentQuestion.answers.length} Answers · ${totalPts} Pts`;
      }
      if (adminQuestionSelect && state.currentQuestion.id) {
        adminQuestionSelect.value = state.currentQuestion.id;
      }
    } else {
      if (adminQuestionText) adminQuestionText.textContent = 'No Question Loaded';
    }

    // Strikes Display
    renderStrikesDisplay();

    // Answers Matrix
    renderAdminAnswers();

    // Players Roster
    renderRoster();
  }

  function renderTurnPlayer() {
    if (!turnPlayerDisplay) return;
    if (!state.controllingTeam) {
      turnPlayerDisplay.textContent = 'None';
      return;
    }
    const teamKey = state.controllingTeam === 1 ? 'team1' : 'team2';
    const teamPlayers = state.connectedPlayers.filter(p => p.team === state.controllingTeam);

    if (teamPlayers.length === 0) {
      turnPlayerDisplay.textContent = `${state.controllingTeam === 1 ? state.team1.name : state.team2.name} (No device joined)`;
      return;
    }

    const turnIdx = state.turnIndex[teamKey] % teamPlayers.length;
    const currentP = teamPlayers[turnIdx];
    turnPlayerDisplay.textContent = `${currentP.playerName} (Player ${turnIdx + 1} of ${teamPlayers.length})`;
  }

  function renderStrikesDisplay() {
    if (!strikeCountDisplay) return;
    strikeCountDisplay.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      const pip = document.createElement('span');
      pip.className = `strike-pip ${i <= state.strikes ? 'active' : ''}`;
      pip.textContent = 'X';
      strikeCountDisplay.appendChild(pip);
    }
  }

  function renderAdminAnswers() {
    if (!adminAnswersList) return;
    adminAnswersList.innerHTML = '';

    if (!state.currentQuestion || !state.currentQuestion.answers) return;

    let revealedPts = 0;
    const totalPts = state.currentQuestion.answers.reduce((acc, a) => acc + a.points, 0);

    state.currentQuestion.answers.forEach((ans, idx) => {
      if (ans.revealed) revealedPts += ans.points;

      const row = document.createElement('div');
      row.className = `answer-admin-item ${ans.revealed ? 'revealed' : ''}`;

      row.innerHTML = `
        <div class="answer-info">
          <span class="answer-rank-pill">#${idx + 1}</span>
          <span class="answer-name">${ans.text}</span>
          <span class="answer-points">${ans.points} pts</span>
        </div>
        <button class="reveal-toggle-btn ${ans.revealed ? 'btn-hide' : 'btn-reveal'}">
          ${ans.revealed ? 'Hide on Board' : 'Reveal Answer'}
        </button>
      `;

      row.querySelector('.reveal-toggle-btn').addEventListener('click', () => {
        toggleAnswerReveal(idx);
      });

      adminAnswersList.appendChild(row);
    });

    if (revealedPointsSummary) {
      revealedPointsSummary.textContent = `Revealed: ${revealedPts} / ${totalPts} pts | Multiplier: ${state.multiplier}X`;
    }
  }

  function toggleAnswerReveal(index) {
    const ans = state.currentQuestion.answers[index];
    ans.revealed = !ans.revealed;

    const pointsToAdd = ans.points * state.multiplier;
    if (ans.revealed) {
      state.bank = (state.bank || 0) + pointsToAdd;
      sound.playDing();
      sync.broadcast('PLAY_SOUND', { sound: 'DING' });
    } else {
      state.bank = Math.max(0, (state.bank || 0) - pointsToAdd);
    }

    broadcastState();
    renderUI();
  }

  function renderRoster() {
    if (connectedCountEl) connectedCountEl.textContent = state.connectedPlayers.length;
    
    const team1ListEl = document.getElementById('team1PlayersList');
    const team2ListEl = document.getElementById('team2PlayersList');
    const team1CountBadge = document.getElementById('team1CountBadge');
    const team2CountBadge = document.getElementById('team2CountBadge');
    const team1HeadNameDisplay = document.getElementById('team1HeadNameDisplay');
    const team2HeadNameDisplay = document.getElementById('team2HeadNameDisplay');

    if (!team1ListEl || !team2ListEl) return;
    team1ListEl.innerHTML = '';
    team2ListEl.innerHTML = '';

    const t1Players = state.connectedPlayers.filter(p => p.team === 1);
    const t2Players = state.connectedPlayers.filter(p => p.team === 2);

    if (team1CountBadge) team1CountBadge.textContent = `${t1Players.length} Players`;
    if (team2CountBadge) team2CountBadge.textContent = `${t2Players.length} Players`;

    // Ensure valid head players
    if (t1Players.length > 0 && (!state.faceOff.headPlayerTeam1 || !t1Players.some(p => p.playerId === state.faceOff.headPlayerTeam1))) {
      state.faceOff.headPlayerTeam1 = t1Players[0].playerId;
    }
    if (t2Players.length > 0 && (!state.faceOff.headPlayerTeam2 || !t2Players.some(p => p.playerId === state.faceOff.headPlayerTeam2))) {
      state.faceOff.headPlayerTeam2 = t2Players[0].playerId;
    }

    const t1Head = t1Players.find(p => p.playerId === state.faceOff.headPlayerTeam1);
    const t2Head = t2Players.find(p => p.playerId === state.faceOff.headPlayerTeam2);

    if (team1HeadNameDisplay) team1HeadNameDisplay.textContent = t1Head ? t1Head.playerName : 'None appointed';
    if (team2HeadNameDisplay) team2HeadNameDisplay.textContent = t2Head ? t2Head.playerName : 'None appointed';

    // Render Team 1 Players
    if (t1Players.length === 0) {
      team1ListEl.innerHTML = '<div style="color:var(--text-muted);font-size:0.8rem;padding:6px;">No players on Team 1 yet.</div>';
    } else {
      t1Players.forEach((p) => {
        team1ListEl.appendChild(createPlayerRosterItem(p, 1));
      });
    }

    // Render Team 2 Players
    if (t2Players.length === 0) {
      team2ListEl.innerHTML = '<div style="color:var(--text-muted);font-size:0.8rem;padding:6px;">No players on Team 2 yet.</div>';
    } else {
      t2Players.forEach((p) => {
        team2ListEl.appendChild(createPlayerRosterItem(p, 2));
      });
    }
  }

  function createPlayerRosterItem(p, teamNum) {
    const isHead = (teamNum === 1 && state.faceOff.headPlayerTeam1 === p.playerId) ||
                   (teamNum === 2 && state.faceOff.headPlayerTeam2 === p.playerId);

    const item = document.createElement('div');
    item.className = `player-roster-item ${isHead ? 'is-podium-rep' : ''}`;
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.style.alignItems = 'center';
    item.style.padding = '6px 8px';
    item.style.background = isHead ? 'rgba(246,185,59,0.18)' : 'rgba(0,0,0,0.3)';
    item.style.border = `1px solid ${isHead ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}`;
    item.style.borderRadius = '6px';
    item.style.marginBottom = '6px';

    item.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;overflow:hidden;">
        <strong style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">${p.playerName}</strong>
        ${isHead ? '<span class="head-rep-tag" title="Face-Off Podium Representative for this round">⭐ Rep</span>' : ''}
        ${p.isCaptain ? '<span style="color:var(--gold-primary);font-size:0.75rem;" title="Team Captain">👑</span>' : ''}
      </div>
      <div style="display:flex;gap:4px;align-items:center;">
        <button class="icon-btn rep-btn" style="padding:2px 6px;font-size:0.7rem;${isHead ? 'background:var(--gold-primary);color:#071330;' : ''}" title="Appoint as Face-Off representative for this round">⭐ Rep</button>
        <button class="icon-btn captain-btn" style="padding:2px 6px;font-size:0.7rem;" title="Toggle Team Captain">👑</button>
        <button class="icon-btn switch-team-btn" style="padding:2px 6px;font-size:0.7rem;" title="Switch to other team">⇄</button>
      </div>
    `;

    item.querySelector('.rep-btn').addEventListener('click', () => {
      if (teamNum === 1) state.faceOff.headPlayerTeam1 = p.playerId;
      else state.faceOff.headPlayerTeam2 = p.playerId;
      broadcastState();
      renderUI();
    });

    item.querySelector('.captain-btn').addEventListener('click', () => {
      p.isCaptain = !p.isCaptain;
      broadcastState();
      renderUI();
    });

    item.querySelector('.switch-team-btn').addEventListener('click', () => {
      p.team = p.team === 1 ? 2 : 1;
      if (state.faceOff.headPlayerTeam1 === p.playerId) state.faceOff.headPlayerTeam1 = null;
      if (state.faceOff.headPlayerTeam2 === p.playerId) state.faceOff.headPlayerTeam2 = null;
      broadcastState();
      renderUI();
    });

    return item;
  }

  // Auto-Pick Next Pair for Face-Off
  const autoPickNextPairBtn = document.getElementById('autoPickNextPairBtn');
  if (autoPickNextPairBtn) {
    autoPickNextPairBtn.addEventListener('click', () => {
      const t1 = state.connectedPlayers.filter(p => p.team === 1);
      const t2 = state.connectedPlayers.filter(p => p.team === 2);

      if (t1.length > 0) {
        const curIdx1 = t1.findIndex(p => p.playerId === state.faceOff.headPlayerTeam1);
        const nextIdx1 = (curIdx1 + 1) % t1.length;
        state.faceOff.headPlayerTeam1 = t1[nextIdx1].playerId;
      }

      if (t2.length > 0) {
        const curIdx2 = t2.findIndex(p => p.playerId === state.faceOff.headPlayerTeam2);
        const nextIdx2 = (curIdx2 + 1) % t2.length;
        state.faceOff.headPlayerTeam2 = t2[nextIdx2].playerId;
      }

      broadcastState();
      renderUI();
    });
  }

  // --- The Face-Off Mechanics Buttons ---
  if (armBuzzerBtn) {
    armBuzzerBtn.addEventListener('click', () => {
      state.faceOff.buzzerArmed = !state.faceOff.buzzerArmed;
      if (state.faceOff.buzzerArmed) {
        state.faceOff.buzzWinner = null;
        state.faceOff.secondBuzz = null;

        const t1 = state.connectedPlayers.filter(p => p.team === 1);
        const t2 = state.connectedPlayers.filter(p => p.team === 2);
        const rep1 = t1.find(p => p.playerId === state.faceOff.headPlayerTeam1);
        const rep2 = t2.find(p => p.playerId === state.faceOff.headPlayerTeam2);
        const names = rep1 && rep2 ? ` (${rep1.playerName} vs ${rep2.playerName})` : '';

        state.faceOff.statusText = `BUZZERS ARMED${names}! First to buzz answers.`;
      } else {
        state.faceOff.statusText = 'Buzzers Locked.';
      }
      broadcastState();
      renderUI();
    });
  }

  if (resetBuzzerBtn) {
    resetBuzzerBtn.addEventListener('click', () => {
      state.faceOff.buzzerArmed = false;
      state.faceOff.buzzWinner = null;
      state.faceOff.secondBuzz = null;
      state.faceOff.statusText = 'Podiums Ready. Arm buzzers to start.';
      broadcastState();
      renderUI();
    });
  }

  if (ruleDirectWinBtn) {
    ruleDirectWinBtn.addEventListener('click', () => {
      if (!state.faceOff.buzzWinner) {
        alert('No player has buzzed in yet!');
        return;
      }
      const winTeam = state.faceOff.buzzWinner.team;
      state.controllingTeam = winTeam;
      state.phase = 'BOARD_PLAY';
      state.faceOff.statusText = `#1 Answer Revealed! ${winTeam === 1 ? state.team1.name : state.team2.name} gains control.`;
      broadcastState();
      renderUI();
    });
  }

  if (rulePassOpponentBtn) {
    rulePassOpponentBtn.addEventListener('click', () => {
      if (!state.faceOff.buzzWinner) {
        alert('No player has buzzed in yet!');
        return;
      }
      const oppTeam = state.faceOff.buzzWinner.team === 1 ? 2 : 1;
      const oppName = oppTeam === 1 ? state.team1.name : state.team2.name;
      state.faceOff.statusText = `Answer on board but not #1! Pass to ${oppName} to beat rank.`;
      broadcastState();
      renderUI();
    });
  }

  if (ruleDefaultControlBtn) {
    ruleDefaultControlBtn.addEventListener('click', () => {
      if (!state.faceOff.buzzWinner) {
        alert('No player has buzzed in yet!');
        return;
      }
      const defTeam = state.faceOff.buzzWinner.team;
      state.controllingTeam = defTeam;
      state.phase = 'BOARD_PLAY';
      state.faceOff.statusText = `Neither guessed on board! Control defaults to ${defTeam === 1 ? state.team1.name : state.team2.name}.`;
      broadcastState();
      renderUI();
    });
  }

  // --- Board Play & Turn Management ---
  if (controllingTeamSelect) {
    controllingTeamSelect.addEventListener('change', () => {
      state.controllingTeam = controllingTeamSelect.value ? parseInt(controllingTeamSelect.value, 10) : null;
      state.phase = state.controllingTeam ? 'BOARD_PLAY' : 'FACE_OFF';
      broadcastState();
      renderUI();
    });
  }

  if (nextPlayerTurnBtn) {
    nextPlayerTurnBtn.addEventListener('click', () => {
      if (!state.controllingTeam) return;
      const teamKey = state.controllingTeam === 1 ? 'team1' : 'team2';
      state.turnIndex[teamKey] = (state.turnIndex[teamKey] || 0) + 1;
      broadcastState();
      renderTurnPlayer();
    });
  }

  // --- Countdown Timer System (20s turn / 15s steal) ---
  function startTimer(seconds, type = 'TURN') {
    clearInterval(timerInterval);
    state.timer.duration = seconds;
    state.timer.remaining = seconds;
    state.timer.running = true;
    state.timer.type = type;

    if (timerDigitsEl) timerDigitsEl.textContent = `${seconds}s`;

    timerInterval = setInterval(() => {
      if (state.timer.remaining > 0) {
        state.timer.remaining--;
        sync.broadcast('TIMER_TICK', { remaining: state.timer.remaining, duration: state.timer.duration });
        if (timerDigitsEl) timerDigitsEl.textContent = `${state.timer.remaining}s`;

        if (state.timer.remaining <= 5 && state.timer.remaining > 0) {
          sound.playTick();
        }
      } else {
        clearInterval(timerInterval);
        state.timer.running = false;
        sound.playTimeOut();
        sync.broadcast('TIMER_TIMEOUT', {});
        if (timerDigitsEl) timerDigitsEl.textContent = '0s (TIME UP)';
      }
    }, 1000);

    broadcastState();
  }

  if (startTimer20Btn) {
    startTimer20Btn.addEventListener('click', () => {
      startTimer(20, 'TURN');
    });
  }

  if (pauseTimerBtn) {
    pauseTimerBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      state.timer.running = false;
      broadcastState();
      if (timerDigitsEl) timerDigitsEl.textContent += ' (PAUSED)';
    });
  }

  if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      state.timer.remaining = 20;
      state.timer.running = false;
      broadcastState();
      if (timerDigitsEl) timerDigitsEl.textContent = '20s';
    });
  }

  // --- Strikes Supervisor ---
  function applyStrike(count) {
    state.strikes = count;
    sound.playStrike();
    sync.broadcast('SHOW_STRIKE', { count: count });

    if (state.strikes >= 3 && state.controllingTeam) {
      state.phase = 'STEAL';
      state.steal.active = true;
      state.steal.controllingTeam = state.controllingTeam;
      state.steal.stealingTeam = state.controllingTeam === 1 ? 2 : 1;
      sound.playStealGong();
      sync.broadcast('PLAY_SOUND', { sound: 'STEAL_GONG' });
    }

    broadcastState();
    renderUI();
  }

  if (addStrike1Btn) addStrike1Btn.addEventListener('click', () => applyStrike(1));
  if (addStrike2Btn) addStrike2Btn.addEventListener('click', () => applyStrike(2));
  if (addStrike3Btn) addStrike3Btn.addEventListener('click', () => applyStrike(3));
  if (clearStrikesBtn) clearStrikesBtn.addEventListener('click', () => {
    state.strikes = 0;
    broadcastState();
    renderUI();
  });

  // --- The Steal Phase ---
  if (startSteal15Btn) {
    startSteal15Btn.addEventListener('click', () => {
      startTimer(15, 'STEAL');
    });
  }

  if (stealSuccessBtn) {
    stealSuccessBtn.addEventListener('click', () => {
      const stealingTeam = state.steal.stealingTeam || (state.controllingTeam === 1 ? 2 : 1);
      const points = state.bank || 0;

      if (stealingTeam === 1) {
        state.team1.score += points;
      } else {
        state.team2.score += points;
      }

      state.bank = 0;
      state.phase = 'ROUND_SUMMARY';
      sound.playDing();
      sync.broadcast('PLAY_SOUND', { sound: 'DING' });
      alert(`STEAL SUCCESSFUL! ${stealingTeam === 1 ? state.team1.name : state.team2.name} steals ${points} points!`);

      broadcastState();
      renderUI();
    });
  }

  if (stealFailedBtn) {
    stealFailedBtn.addEventListener('click', () => {
      const originalTeam = state.steal.controllingTeam || state.controllingTeam || 1;
      const points = state.bank || 0;

      if (originalTeam === 1) {
        state.team1.score += points;
      } else {
        state.team2.score += points;
      }

      state.bank = 0;
      state.phase = 'ROUND_SUMMARY';
      sound.playStrike();
      sync.broadcast('PLAY_SOUND', { sound: 'STRIKE' });
      alert(`STEAL FAILED! ${originalTeam === 1 ? state.team1.name : state.team2.name} retains ${points} points!`);

      broadcastState();
      renderUI();
    });
  }

  if (resetRoundBtn) {
    resetRoundBtn.addEventListener('click', () => {
      if (confirm('Reset the current round board and bank?')) {
        clearInterval(timerInterval);
        window.gameState.resetRound();
        state = window.gameState.get();
        broadcastState();
        renderUI();
      }
    });
  }

  if (declareWinnerBtn) {
    declareWinnerBtn.addEventListener('click', () => {
      let winner = null;
      if (state.team1.score > state.team2.score) {
        winner = { team: 1, name: state.team1.name, score: state.team1.score };
      } else if (state.team2.score > state.team1.score) {
        winner = { team: 2, name: state.team2.name, score: state.team2.score };
      } else {
        winner = { team: 0, name: 'IT IS A TIE!', score: state.team1.score };
      }

      state.phase = 'GRAND_WINNER';
      state.winner = winner;
      sound.playFanfare();
      sync.broadcast('DECLARE_WINNER', winner);
      broadcastState();
      renderUI();
    });
  }

  // --- Bank & Manual Score Adjustments ---
  if (awardBankTeam1Btn) {
    awardBankTeam1Btn.addEventListener('click', () => {
      state.team1.score += state.bank;
      state.bank = 0;
      sound.playDing();
      broadcastState();
      renderUI();
    });
  }

  if (awardBankTeam2Btn) {
    awardBankTeam2Btn.addEventListener('click', () => {
      state.team2.score += state.bank;
      state.bank = 0;
      sound.playDing();
      broadcastState();
      renderUI();
    });
  }

  if (clearBankBtn) {
    clearBankBtn.addEventListener('click', () => {
      state.bank = 0;
      broadcastState();
      renderUI();
    });
  }

  if (team1Plus10) team1Plus10.addEventListener('click', () => { state.team1.score += 10; broadcastState(); renderUI(); });
  if (team1Minus10) team1Minus10.addEventListener('click', () => { state.team1.score = Math.max(0, state.team1.score - 10); broadcastState(); renderUI(); });
  if (team2Plus10) team2Plus10.addEventListener('click', () => { state.team2.score += 10; broadcastState(); renderUI(); });
  if (team2Minus10) team2Minus10.addEventListener('click', () => { state.team2.score = Math.max(0, state.team2.score - 10); broadcastState(); renderUI(); });

  // --- Room Setup & Popouts ---
  if (setRoomBtn) {
    setRoomBtn.addEventListener('click', () => {
      const newCode = (roomCodeInput.value || 'FEUD').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      state.roomCode = newCode;
      initRoom();
      broadcastState();
    });
  }

  if (randomRoomBtn) {
    randomRoomBtn.addEventListener('click', () => {
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'FF-';
      for (let i = 0; i < 4; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      state.roomCode = code;
      if (roomCodeInput) roomCodeInput.value = code;
      initRoom();
      broadcastState();
      renderUI();
    });
  }

  if (reconnectWebRtcBtn) {
    reconnectWebRtcBtn.addEventListener('click', () => {
      initRoom();
    });
  }

  if (clearRosterBtn) {
    clearRosterBtn.addEventListener('click', () => {
      if (confirm('Clear connected players roster? (Players can simply refresh or re-buzz to rejoin)')) {
        state.connectedPlayers = [];
        broadcastState();
        renderUI();
      }
    });
  }

  if (openBoardBtn) {
    openBoardBtn.addEventListener('click', () => {
      window.open(`board.html?room=${encodeURIComponent(state.roomCode)}`, '_blank');
    });
  }

  if (openBuzzerBtn) {
    openBuzzerBtn.addEventListener('click', () => {
      window.open(`buzzer.html?room=${encodeURIComponent(state.roomCode)}`, '_blank');
    });
  }

  // --- QR Code Modal ---
  if (showQrBtn) {
    showQrBtn.addEventListener('click', () => {
      try {
        const buzzerUrl = new URL('buzzer.html', window.location.href);
        buzzerUrl.searchParams.set('room', state.roomCode);
        const finalUrl = buzzerUrl.href;

        if (qrJoinUrlEl) qrJoinUrlEl.textContent = finalUrl;

        if (window.QRCodeRenderer && qrCanvas) {
          window.QRCodeRenderer.toCanvas(qrCanvas, finalUrl, { width: 220, colorDark: '#071330' });
        }

        const fileNoticeEl = document.getElementById('qrFileProtocolNotice');
        if (fileNoticeEl) {
          fileNoticeEl.style.display = window.location.protocol === 'file:' ? 'block' : 'none';
        }

        if (qrModalEl) qrModalEl.classList.add('active');
      } catch (e) {
        console.warn('Error generating QR:', e);
      }
    });
  }

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Sound FX buttons
  if (sfxDingBtn) sfxDingBtn.addEventListener('click', () => { sound.playDing(); sync.broadcast('PLAY_SOUND', { sound: 'DING' }); });
  if (sfxStrikeBtn) sfxStrikeBtn.addEventListener('click', () => { sound.playStrike(); sync.broadcast('PLAY_SOUND', { sound: 'STRIKE' }); });
  if (sfxTripleStrikeBtn) sfxTripleStrikeBtn.addEventListener('click', () => { sound.playTripleStrike(); sync.broadcast('PLAY_SOUND', { sound: 'TRIPLE_STRIKE' }); });
  if (sfxBuzzerBtn) sfxBuzzerBtn.addEventListener('click', () => { sound.playBuzzerHit(); sync.broadcast('PLAY_SOUND', { sound: 'BUZZER' }); });
  if (sfxGongBtn) sfxGongBtn.addEventListener('click', () => { sound.playStealGong(); sync.broadcast('PLAY_SOUND', { sound: 'STEAL_GONG' }); });
  if (sfxFanfareBtn) sfxFanfareBtn.addEventListener('click', () => { sound.playFanfare(); sync.broadcast('PLAY_SOUND', { sound: 'FANFARE' }); });
  if (sfxMuteBtn) {
    sfxMuteBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      sfxMuteBtn.textContent = isMuted ? '🔇 Sound: Off' : '🔊 Sound: On';
    });
  }

  // --- Modal Tabs Switching ---
  function switchModalTab(tabId) {
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });
  }

  document.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchModalTab(btn.getAttribute('data-tab'));
    });
  });

  // Modal Open Triggers
  function openQuestionsModal(tabId = 'tabBank') {
    renderQuestionsManagerList();
    switchModalTab(tabId);
    if (questionsModalEl) questionsModalEl.classList.add('active');
  }

  if (manageQuestionsBtn) {
    manageQuestionsBtn.addEventListener('click', () => openQuestionsModal('tabBank'));
  }
  if (manageQuestionsMainBtn) {
    manageQuestionsMainBtn.addEventListener('click', () => openQuestionsModal('tabBank'));
  }
  if (uploadSpreadsheetSidebarBtn) {
    uploadSpreadsheetSidebarBtn.addEventListener('click', () => openQuestionsModal('tabSpreadsheet'));
  }
  if (downloadTemplateSidebarBtn) {
    downloadTemplateSidebarBtn.addEventListener('click', () => qManager.downloadSampleTemplate());
  }

  // --- Spreadsheet Upload (CSV & Excel .xlsx / .xls) ---
  if (downloadTemplateBtn) {
    downloadTemplateBtn.addEventListener('click', () => {
      qManager.downloadSampleTemplate();
    });
  }

  function handleSpreadsheetFile(file) {
    if (!file) return;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      if (typeof XLSX === 'undefined') {
        alert('Excel reader library is loading. Please try again or upload a .csv file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const result = qManager.importFromSpreadsheetData(jsonRows);
          if (result.success) {
            alert(`Successfully imported ${result.count} questions from Excel!`);
            renderQuestionsManagerList();
            populateQuestionDropdown();
            loadQuestion(qManager.getAll()[0]);
            switchModalTab('tabBank');
          } else {
            alert('Excel import failed: ' + result.error);
          }
        } catch (err) {
          alert('Could not parse Excel spreadsheet: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const rows = qManager.parseCSV(text);
          const result = qManager.importFromSpreadsheetData(rows);
          if (result.success) {
            alert(`Successfully imported ${result.count} questions from CSV!`);
            renderQuestionsManagerList();
            populateQuestionDropdown();
            loadQuestion(qManager.getAll()[0]);
            switchModalTab('tabBank');
          } else {
            alert('CSV import failed: ' + result.error);
          }
        } catch (err) {
          alert('Could not parse CSV: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  }

  if (spreadsheetFileInput) {
    spreadsheetFileInput.addEventListener('change', (e) => {
      handleSpreadsheetFile(e.target.files[0]);
    });
  }

  if (spreadsheetDropzone) {
    spreadsheetDropzone.addEventListener('click', () => {
      if (spreadsheetFileInput) spreadsheetFileInput.click();
    });

    spreadsheetDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      spreadsheetDropzone.classList.add('dragover');
    });

    spreadsheetDropzone.addEventListener('dragleave', () => {
      spreadsheetDropzone.classList.remove('dragover');
    });

    spreadsheetDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      spreadsheetDropzone.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleSpreadsheetFile(e.dataTransfer.files[0]);
      }
    });
  }

  // --- Tab 1: Render Question Bank List with Search ---
  function renderQuestionsManagerList(searchQuery = '') {
    if (!customQListEl) return;
    customQListEl.innerHTML = '';
    const all = qManager.getAll();
    const query = searchQuery.trim().toLowerCase();

    const filtered = query
      ? all.filter(q => q.question.toLowerCase().includes(query) || q.answers.some(a => a.text.toLowerCase().includes(query)))
      : all;

    if (tabBankCount) tabBankCount.textContent = all.length;
    if (totalQuestionsCountBadge) totalQuestionsCountBadge.textContent = `${all.length} Loaded`;

    if (filtered.length === 0) {
      customQListEl.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);">No questions found matching "${searchQuery}".</div>`;
      return;
    }

    filtered.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'q-bank-card';
      const totalPts = q.answers.reduce((acc, a) => acc + (a.points || 0), 0);
      const isCurrent = state.currentQuestion && state.currentQuestion.id === q.id;

      // Generate answer pills preview
      const pillsHtml = q.answers.map((a, i) => `
        <span class="q-ans-pill">#${i + 1} ${a.text} (${a.points})</span>
      `).join('');

      card.innerHTML = `
        <div class="q-bank-header">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span class="badge ${isCurrent ? 'badge-green' : 'badge-gold'}" style="font-size:0.75rem;">
                ${isCurrent ? 'ACTIVE ON BOARD' : `Question #${idx + 1}`}
              </span>
              <span style="font-size:0.8rem;color:var(--text-muted);font-weight:700;">${q.answers.length} Answers · ${totalPts} Total Pts</span>
            </div>
            <div class="q-bank-prompt">${q.question}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button class="btn-primary load-q-btn" style="padding:5px 12px;font-size:0.8rem;">
              ▶ Load
            </button>
            <button class="btn-secondary edit-q-btn" style="padding:5px 10px;font-size:0.8rem;">
              ✏️ Edit
            </button>
            <button class="icon-btn del-q-btn" style="padding:5px 10px;font-size:0.8rem;color:var(--strike-red);">
              🗑️
            </button>
          </div>
        </div>
        <div class="q-answers-pills">
          ${pillsHtml}
        </div>
      `;

      card.querySelector('.load-q-btn').addEventListener('click', () => {
        loadQuestion(q);
        if (questionsModalEl) questionsModalEl.classList.remove('active');
      });

      card.querySelector('.edit-q-btn').addEventListener('click', () => {
        startEditingQuestion(q);
      });

      card.querySelector('.del-q-btn').addEventListener('click', () => {
        if (confirm(`Delete question "${q.question}"?`)) {
          qManager.deleteQuestion(q.id);
          renderQuestionsManagerList(qSearchInput ? qSearchInput.value : '');
          populateQuestionDropdown();
        }
      });

      customQListEl.appendChild(card);
    });
  }

  if (qSearchInput) {
    qSearchInput.addEventListener('input', () => {
      renderQuestionsManagerList(qSearchInput.value);
    });
  }

  // --- Tab 3: Question Builder (Add / Edit) ---
  function buildAnswersInputForm() {
    if (!answersBuilderDiv) return;
    answersBuilderDiv.innerHTML = '';

    for (let i = 1; i <= 8; i++) {
      const row = document.createElement('div');
      row.className = 'answers-builder-row';
      row.innerHTML = `
        <div class="answers-builder-rank">#${i}</div>
        <input type="text" class="form-input q-ans-text" placeholder="Answer #${i} text">
        <input type="number" class="form-input q-ans-pts" placeholder="Pts" min="0" max="100">
        <button type="button" class="icon-btn clear-row-btn" style="padding:6px;justify-content:center;color:var(--text-muted);" title="Clear Row">✕</button>
      `;

      const ptsInput = row.querySelector('.q-ans-pts');
      ptsInput.addEventListener('input', updateBuilderPointsSum);

      row.querySelector('.clear-row-btn').addEventListener('click', () => {
        row.querySelector('.q-ans-text').value = '';
        row.querySelector('.q-ans-pts').value = '';
        updateBuilderPointsSum();
      });

      answersBuilderDiv.appendChild(row);
    }
    updateBuilderPointsSum();
  }

  function updateBuilderPointsSum() {
    if (!answersBuilderDiv || !builderPointsSumBadge) return;
    const ptsInputs = answersBuilderDiv.querySelectorAll('.q-ans-pts');
    let sum = 0;
    ptsInputs.forEach(inp => {
      sum += parseInt(inp.value, 10) || 0;
    });
    builderPointsSumBadge.textContent = `Total Points: ${sum} pts`;
  }

  function resetBuilderForm() {
    if (editingQuestionIdInput) editingQuestionIdInput.value = '';
    if (qPromptInput) qPromptInput.value = '';
    if (builderModeTitle) builderModeTitle.textContent = '➕ Create New Question';
    if (saveCustomQBtn) saveCustomQBtn.textContent = '💾 Save Question to Bank';
    if (cancelEditQBtn) cancelEditQBtn.style.display = 'none';

    if (answersBuilderDiv) {
      answersBuilderDiv.querySelectorAll('.q-ans-text').forEach(i => i.value = '');
      answersBuilderDiv.querySelectorAll('.q-ans-pts').forEach(i => i.value = '');
    }
    updateBuilderPointsSum();
  }

  if (clearBuilderRowsBtn) {
    clearBuilderRowsBtn.addEventListener('click', () => {
      if (answersBuilderDiv) {
        answersBuilderDiv.querySelectorAll('.q-ans-text').forEach(i => i.value = '');
        answersBuilderDiv.querySelectorAll('.q-ans-pts').forEach(i => i.value = '');
      }
      updateBuilderPointsSum();
    });
  }

  function startEditingQuestion(q) {
    resetBuilderForm();
    if (editingQuestionIdInput) editingQuestionIdInput.value = q.id;
    if (qPromptInput) qPromptInput.value = q.question;
    if (builderModeTitle) builderModeTitle.textContent = `✏️ Edit Question`;
    if (saveCustomQBtn) saveCustomQBtn.textContent = '💾 Update Question in Bank';
    if (cancelEditQBtn) cancelEditQBtn.style.display = 'block';

    const textInputs = answersBuilderDiv.querySelectorAll('.q-ans-text');
    const ptsInputs = answersBuilderDiv.querySelectorAll('.q-ans-pts');

    q.answers.forEach((ans, i) => {
      if (i < 8) {
        textInputs[i].value = ans.text || '';
        ptsInputs[i].value = ans.points || '';
      }
    });

    updateBuilderPointsSum();
    switchModalTab('tabBuilder');
  }

  if (cancelEditQBtn) {
    cancelEditQBtn.addEventListener('click', () => {
      resetBuilderForm();
      switchModalTab('tabBank');
    });
  }

  if (saveCustomQBtn) {
    saveCustomQBtn.addEventListener('click', () => {
      const prompt = qPromptInput ? qPromptInput.value.trim() : '';
      if (!prompt) {
        alert('Please enter a question prompt.');
        return;
      }

      const answers = [];
      const textInputs = answersBuilderDiv.querySelectorAll('.q-ans-text');
      const ptsInputs = answersBuilderDiv.querySelectorAll('.q-ans-pts');

      for (let i = 0; i < textInputs.length; i++) {
        const txt = textInputs[i].value.trim();
        const pts = parseInt(ptsInputs[i].value, 10) || 0;
        if (txt) {
          answers.push({ text: txt, points: pts });
        }
      }

      if (answers.length < 2) {
        alert('Please provide at least 2 answers.');
        return;
      }

      const editingId = editingQuestionIdInput ? editingQuestionIdInput.value : '';
      let savedQ;

      if (editingId) {
        // Update existing question
        savedQ = qManager.updateQuestion(editingId, prompt, answers);
        alert('Question updated successfully!');
      } else {
        // Create new question
        savedQ = qManager.addQuestion(prompt, answers);
        alert('Question saved to bank successfully!');
      }

      resetBuilderForm();
      renderQuestionsManagerList();
      populateQuestionDropdown();

      // If active question was updated, reload it
      if (state.currentQuestion && state.currentQuestion.id === savedQ.id) {
        loadQuestion(savedQ);
      }

      switchModalTab('tabBank');
    });
  }

  // --- Export / Import JSON & Reset Defaults ---
  if (exportQBtn) {
    exportQBtn.addEventListener('click', () => {
      const json = qManager.exportToJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `family-feud-questions-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importQInput) {
    importQInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = qManager.importFromJSON(evt.target.result);
        if (res.success) {
          alert(`Successfully imported ${res.count} questions from JSON!`);
          renderQuestionsManagerList();
          populateQuestionDropdown();
          loadQuestion(qManager.getAll()[0]);
        } else {
          alert('Failed to import questions: ' + res.error);
        }
      };
      reader.readAsText(file);
    });
  }

  if (resetDefaultQBtn) {
    resetDefaultQBtn.addEventListener('click', () => {
      if (confirm('Reset question bank to default questions?')) {
        qManager.resetToDefaults();
        renderQuestionsManagerList();
        populateQuestionDropdown();
        loadQuestion(qManager.getAll()[0]);
      }
    });
  }

  // ==========================================
  // ADMIN PASSWORD SECURITY & SETTINGS (GETTER & SETTER)
  // ==========================================
  const adminAuthOverlay = document.getElementById('adminAuthOverlay');
  const adminPasswordAuthInput = document.getElementById('adminPasswordAuthInput');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const adminUnlockBtn = document.getElementById('adminUnlockBtn');

  const passwordSettingsBtn = document.getElementById('passwordSettingsBtn');
  const passwordModal = document.getElementById('passwordModal');
  const adminCurrentPasswordDisplay = document.getElementById('adminCurrentPasswordDisplay');
  const copyAdminPasswordBtn = document.getElementById('copyAdminPasswordBtn');
  const adminNewPasswordInput = document.getElementById('adminNewPasswordInput');
  const saveAdminPasswordBtn = document.getElementById('saveAdminPasswordBtn');
  const lockScreenNowBtn = document.getElementById('lockScreenNowBtn');

  function getAdminPassword() {
    return localStorage.getItem('feud_admin_password') || 'feudadmin';
  }

  function checkAdminAuth() {
    const isAuthed = sessionStorage.getItem('feud_admin_auth') === 'true';
    if (!isAuthed) {
      if (adminAuthOverlay) adminAuthOverlay.style.display = 'flex';
      if (adminPasswordAuthInput) {
        setTimeout(() => adminPasswordAuthInput.focus(), 150);
      }
    } else {
      if (adminAuthOverlay) adminAuthOverlay.style.display = 'none';
    }
  }

  if (adminUnlockBtn && adminPasswordAuthInput) {
    const attemptUnlock = () => {
      const inputPass = adminPasswordAuthInput.value.trim();
      if (inputPass === getAdminPassword()) {
        sessionStorage.setItem('feud_admin_auth', 'true');
        if (adminAuthOverlay) adminAuthOverlay.style.display = 'none';
        if (authErrorMsg) authErrorMsg.style.display = 'none';
        adminPasswordAuthInput.value = '';
      } else {
        if (authErrorMsg) authErrorMsg.style.display = 'block';
        adminPasswordAuthInput.focus();
        adminPasswordAuthInput.select();
      }
    };

    adminUnlockBtn.addEventListener('click', attemptUnlock);
    adminPasswordAuthInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attemptUnlock();
    });
  }

  // Password Settings Modal (Getter & Setter)
  if (passwordSettingsBtn) {
    passwordSettingsBtn.addEventListener('click', () => {
      if (adminCurrentPasswordDisplay) {
        adminCurrentPasswordDisplay.value = getAdminPassword();
      }
      if (passwordModal) passwordModal.classList.add('active');
    });
  }

  if (copyAdminPasswordBtn) {
    copyAdminPasswordBtn.addEventListener('click', () => {
      const pass = getAdminPassword();
      navigator.clipboard.writeText(pass).then(() => {
        copyAdminPasswordBtn.textContent = 'Copied!';
        setTimeout(() => copyAdminPasswordBtn.textContent = 'Copy', 1500);
      });
    });
  }

  if (saveAdminPasswordBtn) {
    saveAdminPasswordBtn.addEventListener('click', () => {
      const newPass = adminNewPasswordInput ? adminNewPasswordInput.value.trim() : '';
      if (!newPass || newPass.length < 4) {
        alert('Please enter a password of at least 4 characters.');
        return;
      }
      localStorage.setItem('feud_admin_password', newPass);
      if (adminCurrentPasswordDisplay) adminCurrentPasswordDisplay.value = newPass;
      if (adminNewPasswordInput) adminNewPasswordInput.value = '';
      alert('Admin password updated successfully!');
    });
  }

  if (lockScreenNowBtn) {
    lockScreenNowBtn.addEventListener('click', () => {
      sessionStorage.removeItem('feud_admin_auth');
      if (passwordModal) passwordModal.classList.remove('active');
      checkAdminAuth();
    });
  }

  // Run initial password authentication check
  checkAdminAuth();

  // ==========================================
  // AI QUESTION GENERATOR (PG GUARDRAILS)
  // ==========================================
  const aiTopicInput = document.getElementById('aiTopicInput');
  const aiGenerateBtn = document.getElementById('aiGenerateBtn');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const saveGeminiKeyBtn = document.getElementById('saveGeminiKeyBtn');
  const aiStatusArea = document.getElementById('aiStatusArea');
  const aiResultCard = document.getElementById('aiResultCard');
  const aiSourceBadge = document.getElementById('aiSourceBadge');
  const aiPointsTotalBadge = document.getElementById('aiPointsTotalBadge');
  const aiGeneratedQuestionText = document.getElementById('aiGeneratedQuestionText');
  const aiGeneratedAnswersList = document.getElementById('aiGeneratedAnswersList');
  const aiRegenerateBtn = document.getElementById('aiRegenerateBtn');
  const aiAddToBankBtn = document.getElementById('aiAddToBankBtn');
  const aiPlayNowBtn = document.getElementById('aiPlayNowBtn');

  // Load saved Gemini API key if present
  const savedGeminiKey = localStorage.getItem('feud_gemini_api_key') || '';
  if (geminiApiKeyInput) geminiApiKeyInput.value = savedGeminiKey;

  if (saveGeminiKeyBtn) {
    saveGeminiKeyBtn.addEventListener('click', () => {
      const key = geminiApiKeyInput ? geminiApiKeyInput.value.trim() : '';
      localStorage.setItem('feud_gemini_api_key', key);
      saveGeminiKeyBtn.textContent = 'Saved!';
      setTimeout(() => saveGeminiKeyBtn.textContent = 'Save Key', 1500);
    });
  }

  let latestAiQuestion = null;

  async function handleAiGenerate() {
    const prompt = (aiTopicInput ? aiTopicInput.value : '').trim();
    if (!prompt) {
      alert('Please enter a topic prompt (e.g. "Beach vacation packing", "Excuses for being late").');
      if (aiTopicInput) aiTopicInput.focus();
      return;
    }

    if (aiStatusArea) {
      aiStatusArea.style.display = 'block';
      aiStatusArea.textContent = '✨ Thinking up wholesome, PG survey answers...';
    }
    if (aiResultCard) aiResultCard.style.display = 'none';

    try {
      const key = geminiApiKeyInput ? geminiApiKeyInput.value.trim() : (localStorage.getItem('feud_gemini_api_key') || '');
      const res = await qManager.generateQuestionWithAI(prompt, key);

      latestAiQuestion = res.question;

      if (aiStatusArea) aiStatusArea.style.display = 'none';
      if (aiResultCard) aiResultCard.style.display = 'block';

      if (aiSourceBadge) aiSourceBadge.textContent = res.source;
      const totalPts = res.question.answers.reduce((sum, a) => sum + (a.points || 0), 0);
      if (aiPointsTotalBadge) aiPointsTotalBadge.textContent = `Total: ${totalPts} Pts`;

      if (aiGeneratedQuestionText) aiGeneratedQuestionText.textContent = res.question.question;
      if (aiGeneratedAnswersList) {
        aiGeneratedAnswersList.innerHTML = '';
        res.question.answers.forEach((ans, idx) => {
          const item = document.createElement('div');
          item.className = 'answer-card-preview';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.background = 'rgba(255,255,255,0.06)';
          item.style.padding = '8px 12px';
          item.style.borderRadius = '6px';
          item.style.marginBottom = '6px';
          item.innerHTML = `<span><strong>${idx + 1}.</strong> ${ans.text}</span> <span style="color:var(--gold-primary);font-weight:800;">${ans.points} pts</span>`;
          aiGeneratedAnswersList.appendChild(item);
        });
      }
    } catch (err) {
      if (aiStatusArea) {
        aiStatusArea.style.display = 'block';
        aiStatusArea.innerHTML = `<span style="color:#ff7675;">${err.message}</span>`;
      }
    }
  }

  if (aiGenerateBtn) aiGenerateBtn.addEventListener('click', handleAiGenerate);
  if (aiRegenerateBtn) aiRegenerateBtn.addEventListener('click', handleAiGenerate);
  if (aiTopicInput) {
    aiTopicInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAiGenerate();
    });
  }

  if (aiAddToBankBtn) {
    aiAddToBankBtn.addEventListener('click', () => {
      if (!latestAiQuestion) return;
      qManager.add(latestAiQuestion);
      populateQuestionDropdown();
      renderQuestionsManagerList();
      aiAddToBankBtn.textContent = '✅ Added to Bank!';
      setTimeout(() => aiAddToBankBtn.textContent = '📋 Add to Bank', 1500);
    });
  }

  if (aiPlayNowBtn) {
    aiPlayNowBtn.addEventListener('click', () => {
      if (!latestAiQuestion) return;
      qManager.add(latestAiQuestion);
      populateQuestionDropdown();
      renderQuestionsManagerList();
      loadQuestion(latestAiQuestion);
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  }
});
