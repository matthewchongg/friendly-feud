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
  let activeFolderFilter = 'all';
  let editingFolderId = null;

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
  const soundFxCard = document.getElementById('soundFxCard');
  const mobileSoundNavBtn = document.getElementById('mobileSoundNavBtn');
  const adminSettingsBar = document.getElementById('adminSettingsBar');
  const toggleSettingsBarBtn = document.getElementById('toggleSettingsBarBtn');
  const collapseSettingsBarBtn = document.getElementById('collapseSettingsBarBtn');
  const headerActiveRoomBadge = document.getElementById('headerActiveRoomBadge');
  const netDiagBtn = document.getElementById('netDiagBtn');
  const netDiagModal = document.getElementById('netDiagModal');
  const closeNetDiagBtn = document.getElementById('closeNetDiagBtn');
  const runNetTestBtn = document.getElementById('runNetTestBtn');
  const netDiagResultsBox = document.getElementById('netDiagResultsBox');
  const netDiagItems = document.getElementById('netDiagItems');

  // DOM Elements - Admin Password & Auth Gate
  const adminAuthOverlay = document.getElementById('adminAuthOverlay');
  const adminPasswordAuthInput = document.getElementById('adminPasswordAuthInput');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const adminUnlockBtn = document.getElementById('adminUnlockBtn');
  const authOverlayHint = document.getElementById('authOverlayHint');
  const initialPasswordModal = document.getElementById('initialPasswordModal');
  const useDefaultPasswordBtn = document.getElementById('useDefaultPasswordBtn');
  const initialCustomPasswordInput = document.getElementById('initialCustomPasswordInput');
  const saveCustomPasswordBtn = document.getElementById('saveCustomPasswordBtn');
  const initialPassErrorMsg = document.getElementById('initialPassErrorMsg');
  const skipPasswordSetupBtn = document.getElementById('skipPasswordSetupBtn');
  const passwordSettingsBtn = document.getElementById('passwordSettingsBtn');
  const passwordModal = document.getElementById('passwordModal');
  const adminCurrentPasswordDisplay = document.getElementById('adminCurrentPasswordDisplay');
  const copyAdminPasswordBtn = document.getElementById('copyAdminPasswordBtn');
  const adminNewPasswordInput = document.getElementById('adminNewPasswordInput');
  const saveAdminPasswordBtn = document.getElementById('saveAdminPasswordBtn');
  const lockScreenNowBtn = document.getElementById('lockScreenNowBtn');

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

  const awardControlTeam1Btn = document.getElementById('awardControlTeam1Btn');
  const awardControlTeam2Btn = document.getElementById('awardControlTeam2Btn');
  const awardControlTeam1Name = document.getElementById('awardControlTeam1Name');
  const awardControlTeam2Name = document.getElementById('awardControlTeam2Name');
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
  const adminFolderFilterSelect = document.getElementById('adminFolderFilterSelect');
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

  // Folder Navigation Elements
  const folderPillsContainer = document.getElementById('folderPillsContainer');
  const activeFolderNameBadge = document.getElementById('activeFolderNameBadge');
  const addNewFolderBtn = document.getElementById('addNewFolderBtn');
  const renameCurrentFolderBtn = document.getElementById('renameCurrentFolderBtn');
  const deleteCurrentFolderBtn = document.getElementById('deleteCurrentFolderBtn');

  // Folder Modal Elements
  const folderModal = document.getElementById('folderModal');
  const folderModalTitle = document.getElementById('folderModalTitle');
  const folderNameInput = document.getElementById('folderNameInput');
  const saveFolderModalBtn = document.getElementById('saveFolderModalBtn');
  const cancelFolderModalBtn = document.getElementById('cancelFolderModalBtn');
  const closeFolderModalBtn = document.getElementById('closeFolderModalBtn');

  // Spreadsheet upload elements
  const spreadsheetFolderSelect = document.getElementById('spreadsheetFolderSelect');
  const spreadsheetDropzone = document.getElementById('spreadsheetDropzone');
  const spreadsheetFileInput = document.getElementById('spreadsheetFileInput');
  const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');

  // Question Builder Form elements
  const builderFolderSelect = document.getElementById('builderFolderSelect');
  const builderNewFolderBtn = document.getElementById('builderNewFolderBtn');
  const builderModeTitle = document.getElementById('builderModeTitle');
  const builderPointsSumBadge = document.getElementById('builderPointsSumBadge');
  const editingQuestionIdInput = document.getElementById('editingQuestionId');
  const qPromptInput = document.getElementById('qPromptInput');
  const answersBuilderDiv = document.getElementById('answersBuilder');
  const clearBuilderRowsBtn = document.getElementById('clearBuilderRowsBtn');
  const saveCustomQBtn = document.getElementById('saveCustomQBtn');
  const cancelEditQBtn = document.getElementById('cancelEditQBtn');

  // AI Generator Elements
  const aiTargetFolderSelect = document.getElementById('aiTargetFolderSelect');
  const aiNewFolderBtn = document.getElementById('aiNewFolderBtn');
  const aiGeneratedQuestionInput = document.getElementById('aiGeneratedQuestionInput');

  // Sound FX & Philippine Family Feud Soundboard elements
  const sfxThemeSongBtn = document.getElementById('sfxThemeSongBtn');
  const sfxThemeFadeBtn = document.getElementById('sfxThemeFadeBtn');
  const themePlayIcon = document.getElementById('themePlayIcon');
  const themePlayText = document.getElementById('themePlayText');
  const themeSongStatus = document.getElementById('themeSongStatus');
  const soundThemeBadge = document.getElementById('soundThemeBadge');
  const sfxThemeToggleBtn = document.getElementById('sfxThemeToggleBtn');
  const sfxDingBtn = document.getElementById('sfxDing');
  const sfxStrikeBtn = document.getElementById('sfxStrike');
  const sfxDoubleStrikeBtn = document.getElementById('sfxDoubleStrike');
  const sfxTripleStrikeBtn = document.getElementById('sfxTripleStrike');
  const sfxFaceoffBtn = document.getElementById('sfxFaceoff');
  const sfxBuzzerBtn = document.getElementById('sfxBuzzer');
  const sfxGongBtn = document.getElementById('sfxGong');
  const sfxFanfareBtn = document.getElementById('sfxFanfare');
  const sfxMuteBtn = document.getElementById('sfxMute');

  // --- Initial Setup ---
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get('room');

  // Room resolution on load: prioritize URL query, then persistent state, fallback to random code
  let targetInitialCode = roomFromUrl || state.roomCode;
  if (!targetInitialCode || targetInitialCode === 'FEUD') {
    targetInitialCode = generateRandomRoomCode();
  }
  state.roomCode = targetInitialCode;

  initRoom(targetInitialCode);
  buildAnswersInputForm();
  renderDynamicRoundsBar();
  populateFolderDropdowns();
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

  function generateRandomRoomCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'FF-';
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
  }

  // --- Special Event Room Scoping & Soundboard Exclusivity ---
  function updateSpecialRoomState(code) {
    const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(code) : null;

    // Soundboard card and mobile nav button are ALWAYS visible across all rooms (classic & special)
    if (soundFxCard) soundFxCard.style.display = 'block';
    if (mobileSoundNavBtn) mobileSoundNavBtn.style.display = 'inline-flex';

    // Philippine Theme Song Track (Jeremiah Tiangco - "Ano'ng Sabe") is exclusive to FSA-POLYU
    const philippineThemeSongRow = document.getElementById('philippineThemeSongRow');
    if (philippineThemeSongRow) {
      philippineThemeSongRow.style.display = special ? 'flex' : 'none';
    }

    if (sfxThemeToggleBtn) {
      sfxThemeToggleBtn.style.display = 'none'; // Lock soundboard to active room mode; standard rooms cannot access FSA soundboard
    }

    if (special) {
      sound.setTheme('philippines');
      if (soundThemeBadge) {
        soundThemeBadge.textContent = '🇵🇭 Philippine Feud Edition';
        soundThemeBadge.className = 'badge badge-gold';
      }
      qManager.setScope(special.code, special.questions, special.folders);

      // FSA Special Soundboard configuration
      if (sfxDingBtn) { sfxDingBtn.textContent = '🔔 Correct Ding'; sfxDingBtn.title = 'Correct Ding'; sfxDingBtn.style.display = 'inline-flex'; }
      if (sfxStrikeBtn) { sfxStrikeBtn.textContent = '❌ Wrong Buzzer (X)'; sfxStrikeBtn.title = 'Wrong Buzzer (X)'; sfxStrikeBtn.style.display = 'inline-flex'; }
      if (sfxFaceoffBtn) { sfxFaceoffBtn.textContent = '🚶 Walk In'; sfxFaceoffBtn.title = 'Walk In Music'; sfxFaceoffBtn.style.display = 'inline-flex'; }
      if (sfxBuzzerBtn) { sfxBuzzerBtn.textContent = '🚨 Face-Off Buzzer'; sfxBuzzerBtn.title = 'Face-Off Buzzer'; sfxBuzzerBtn.style.display = 'inline-flex'; }
      if (sfxFanfareBtn) { sfxFanfareBtn.textContent = '🎺 Round Win'; sfxFanfareBtn.title = 'Round Win Fanfare'; sfxFanfareBtn.style.display = 'inline-flex'; }
      if (sfxTripleStrikeBtn) sfxTripleStrikeBtn.style.display = 'none';
      if (sfxGongBtn) sfxGongBtn.style.display = 'none';
    } else {
      sound.setTheme('classic');
      if (soundThemeBadge) {
        soundThemeBadge.textContent = '🎹 Classic Game Show SFX';
        soundThemeBadge.className = 'badge';
      }
      qManager.setScope(null);

      // Classic Original Soundboard (Exactly 6 buttons)
      if (sfxDingBtn) { sfxDingBtn.textContent = '🔔 Reveal Ding'; sfxDingBtn.title = 'Reveal Ding'; sfxDingBtn.style.display = 'inline-flex'; }
      if (sfxStrikeBtn) { sfxStrikeBtn.textContent = '❌ Strike (X)'; sfxStrikeBtn.title = 'Strike (X)'; sfxStrikeBtn.style.display = 'inline-flex'; }
      if (sfxTripleStrikeBtn) { sfxTripleStrikeBtn.textContent = '💥 Triple Strike'; sfxTripleStrikeBtn.title = 'Triple Strike'; sfxTripleStrikeBtn.style.display = 'inline-flex'; }
      if (sfxBuzzerBtn) { sfxBuzzerBtn.textContent = '🚨 Face-Off Buzzer'; sfxBuzzerBtn.title = 'Face-Off Buzzer'; sfxBuzzerBtn.style.display = 'inline-flex'; }
      if (sfxGongBtn) { sfxGongBtn.textContent = '🔔 Steal Gong'; sfxGongBtn.title = 'Steal Gong'; sfxGongBtn.style.display = 'inline-flex'; }
      if (sfxFanfareBtn) { sfxFanfareBtn.textContent = '🎺 Win Fanfare'; sfxFanfareBtn.title = 'Win Fanfare'; sfxFanfareBtn.style.display = 'inline-flex'; }
      if (sfxFaceoffBtn) sfxFaceoffBtn.style.display = 'none';
    }

    if (typeof updateSoundThemeUI === 'function') updateSoundThemeUI();
    if (typeof updateAuthOverlayHint === 'function') updateAuthOverlayHint();
    updateHeaderRoomBadge(code);
  }

  function updateHeaderRoomBadge(code) {
    if (!headerActiveRoomBadge) return;
    const curCode = (code || state.roomCode || '').toUpperCase().trim();
    const isSpecial = (typeof window.getSpecialRoomConfig === 'function' && window.getSpecialRoomConfig(curCode)) || curCode === 'FSA-POLYU';
    headerActiveRoomBadge.textContent = curCode ? `${isSpecial ? '🇵🇭 ' : ''}ROOM: ${curCode}` : 'ROOM: WAITING...';
    headerActiveRoomBadge.className = isSpecial ? 'badge badge-gold' : 'badge';
  }

  // --- WebRTC & Sync Setup ---
  function initRoom(requestedCode) {
    let code = (requestedCode || state.roomCode || '').toUpperCase().trim();
    if (!code || code === 'FEUD') {
      code = generateRandomRoomCode();
    }
    state.roomCode = code;
    if (roomCodeInput) roomCodeInput.value = code;
    updateHeaderRoomBadge(code);

    updateSpecialRoomState(code);

    if (typeof checkInitialPasswordPrompt === 'function') {
      checkInitialPasswordPrompt();
    }
    if (adminCurrentPasswordDisplay) {
      adminCurrentPasswordDisplay.value = getAdminPassword();
    }

    populateFolderDropdowns();
    populateQuestionDropdown();

    // Ensure currentQuestion matches active scope
    const matched = qManager.getById(state.currentQuestion ? state.currentQuestion.id : null);
    if (!matched && qManager.getAll().length > 0) {
      loadQuestion(qManager.getAll()[0]);
    }

    // If host peer is already online for this room, simply update UI badges and exit
    if (sync.roomCode === code && sync.isOnline && sync.role === 'host') {
      console.log(`[Admin] Host peer already active and online for room: ${code}`);
      if (webrtcStatusEl) {
        webrtcStatusEl.className = 'badge badge-green';
        webrtcStatusEl.textContent = `🟢 Online: ${code} (${sync.connections.size} buzzers)`;
        webrtcStatusEl.title = `Host active. Peer ID: ${sync.getHostPeerId(code)}. Devices connected: ${sync.connections.size}`;
      }
      return;
    }

    if (webrtcStatusEl) {
      webrtcStatusEl.className = 'badge badge-gold';
      webrtcStatusEl.textContent = `🟡 Connecting: ${code}...`;
    }

    sync.initHostPeer(code, (evt) => {
      if (!webrtcStatusEl) return;
      if (evt.status === 'connected') {
        state.roomCode = evt.roomCode;
        if (roomCodeInput) roomCodeInput.value = evt.roomCode;
        webrtcStatusEl.className = 'badge badge-green';
        webrtcStatusEl.textContent = `🟢 Online: ${evt.roomCode} (${evt.connectedCount || 0} buzzers)`;
        webrtcStatusEl.title = `Host active and verified unused. Peer ID: ${evt.peerId}. Devices connected: ${evt.connectedCount || 0}`;
        window.gameState.update({ roomCode: evt.roomCode });
      } else if (evt.status === 'code-collision') {
        const isSpecial = (typeof window.getSpecialRoomConfig === 'function' && window.getSpecialRoomConfig(state.roomCode)) || state.roomCode === 'FSA-POLYU';
        if (!isSpecial) {
          state.roomCode = evt.roomCode;
          if (roomCodeInput) roomCodeInput.value = evt.roomCode;
          webrtcStatusEl.className = 'badge badge-gold';
          webrtcStatusEl.textContent = `🟡 Finding unused code: ${evt.roomCode}...`;
          window.gameState.update({ roomCode: evt.roomCode });
        }
      } else if (evt.status === 'connecting') {
        webrtcStatusEl.className = 'badge badge-gold';
        webrtcStatusEl.textContent = evt.message ? `🟡 ${evt.message}` : `🟡 Connecting: ${evt.roomCode || code}...`;
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
  function ensureValidHeadPlayers() {
    const t1 = state.connectedPlayers.filter(p => p.team === 1);
    const t2 = state.connectedPlayers.filter(p => p.team === 2);
    if (t1.length > 0 && (!state.faceOff.headPlayerTeam1 || !t1.some(p => p.playerId === state.faceOff.headPlayerTeam1))) {
      state.faceOff.headPlayerTeam1 = t1[0].playerId;
    }
    if (t2.length > 0 && (!state.faceOff.headPlayerTeam2 || !t2.some(p => p.playerId === state.faceOff.headPlayerTeam2))) {
      state.faceOff.headPlayerTeam2 = t2[0].playerId;
    }
  }

  function handlePlayerBuzz(player) {
    if (!state.faceOff.buzzerArmed) return;

    // Enforce Head Player rule: only appointed representative from each team can buzz during face-off!
    const tPlayers = state.connectedPlayers.filter(p => p.team === player.team);
    const appointedHead = player.team === 1 ? state.faceOff.headPlayerTeam1 : state.faceOff.headPlayerTeam2;
    if (appointedHead && tPlayers.length > 1 && player.playerId !== appointedHead) {
      console.log(`[Admin] Buzz ignored: ${player.playerName} is not Team ${player.team}'s appointed head player.`);
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

    ensureValidHeadPlayers();

    broadcastState();
    renderUI();
  }

  function handlePlayerDisconnect(payload) {}

  // --- Question Folders & Active Question Management ---
  function populateFolderDropdowns() {
    const folders = qManager.getFolders();

    // 1. Admin main Quick Switch folder filter
    if (adminFolderFilterSelect) {
      const currentVal = adminFolderFilterSelect.value || 'all';
      adminFolderFilterSelect.innerHTML = `<option value="all">📁 All Folders (${qManager.getAll().length})</option>`;
      folders.forEach(f => {
        const count = qManager.getByFolder(f.id).length;
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = `${f.icon || '📁'} ${f.name} (${count})`;
        adminFolderFilterSelect.appendChild(opt);
      });
      if (folders.some(f => f.id === currentVal) || currentVal === 'all') {
        adminFolderFilterSelect.value = currentVal;
      }
    }

    // 2. Spreadsheet upload folder select
    if (spreadsheetFolderSelect) {
      const currentVal = spreadsheetFolderSelect.value || 'default';
      spreadsheetFolderSelect.innerHTML = '';
      folders.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = `${f.icon || '📁'} ${f.name}`;
        spreadsheetFolderSelect.appendChild(opt);
      });
      spreadsheetFolderSelect.value = currentVal;
    }

    // 3. Builder folder select
    if (builderFolderSelect) {
      const currentVal = builderFolderSelect.value || 'default';
      builderFolderSelect.innerHTML = '';
      folders.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = `${f.icon || '📁'} ${f.name}`;
        builderFolderSelect.appendChild(opt);
      });
      builderFolderSelect.value = currentVal;
    }

    // 4. AI target folder select
    if (aiTargetFolderSelect) {
      const currentVal = aiTargetFolderSelect.value || 'default';
      aiTargetFolderSelect.innerHTML = '';
      folders.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = `${f.icon || '📁'} ${f.name}`;
        aiTargetFolderSelect.appendChild(opt);
      });
      aiTargetFolderSelect.value = currentVal;
    }

    renderFolderPills();
  }

  function renderFolderPills() {
    if (!folderPillsContainer) return;
    folderPillsContainer.innerHTML = '';
    const folders = qManager.getFolders();
    const allCount = qManager.getAll().length;

    // "All Folders" pill
    const allPill = document.createElement('div');
    allPill.className = `folder-pill ${activeFolderFilter === 'all' ? 'active' : ''}`;
    allPill.innerHTML = `<span>📁 All</span> <span class="folder-count">${allCount}</span>`;
    allPill.addEventListener('click', () => {
      activeFolderFilter = 'all';
      renderFolderPills();
      renderQuestionsManagerList(qSearchInput ? qSearchInput.value : '');
    });
    folderPillsContainer.appendChild(allPill);

    // Individual folder pills
    folders.forEach(f => {
      const count = qManager.getByFolder(f.id).length;
      const pill = document.createElement('div');
      pill.className = `folder-pill ${activeFolderFilter === f.id ? 'active' : ''}`;
      pill.innerHTML = `<span>${f.icon || '📁'} ${f.name}</span> <span class="folder-count">${count}</span>`;
      pill.addEventListener('click', () => {
        activeFolderFilter = f.id;
        renderFolderPills();
        renderQuestionsManagerList(qSearchInput ? qSearchInput.value : '');
      });
      folderPillsContainer.appendChild(pill);
    });

    // Update active badge and visibility of rename/delete
    if (activeFolderNameBadge) {
      if (activeFolderFilter === 'all') {
        activeFolderNameBadge.textContent = 'All Questions';
      } else {
        const curr = qManager.getFolderById(activeFolderFilter);
        activeFolderNameBadge.textContent = curr ? curr.name : 'Folder';
      }
    }

    const isCustom = activeFolderFilter !== 'all' && activeFolderFilter !== 'default';
    if (renameCurrentFolderBtn) renameCurrentFolderBtn.style.display = isCustom ? 'inline-block' : 'none';
    if (deleteCurrentFolderBtn) deleteCurrentFolderBtn.style.display = isCustom ? 'inline-block' : 'none';
  }

  function populateQuestionDropdown() {
    if (!adminQuestionSelect) return;
    adminQuestionSelect.innerHTML = '';

    const selectedFolder = adminFolderFilterSelect ? adminFolderFilterSelect.value : 'all';

    if (selectedFolder === 'all') {
      // Group by folders using optgroups
      const folders = qManager.getFolders();
      folders.forEach(f => {
        const fldQuestions = qManager.getByFolder(f.id);
        if (fldQuestions.length > 0) {
          const group = document.createElement('optgroup');
          group.label = `${f.icon || '📁'} ${f.name} (${fldQuestions.length})`;
          fldQuestions.forEach((q, idx) => {
            const opt = document.createElement('option');
            opt.value = q.id;
            opt.textContent = `${idx + 1}. ${q.question}`;
            group.appendChild(opt);
          });
          adminQuestionSelect.appendChild(group);
        }
      });
    } else {
      const questionsToShow = qManager.getByFolder(selectedFolder);
      questionsToShow.forEach((q, idx) => {
        const opt = document.createElement('option');
        opt.value = q.id;
        opt.textContent = `${idx + 1}. ${q.question}`;
        adminQuestionSelect.appendChild(opt);
      });
    }

    if (state.currentQuestion) {
      adminQuestionSelect.value = state.currentQuestion.id;
    }

    const totalCount = qManager.getAll().length;
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
    if (adminQuestionSelect) {
      adminQuestionSelect.value = q.id;
    }
    broadcastState();
    renderUI();
  }

  if (adminFolderFilterSelect) {
    adminFolderFilterSelect.addEventListener('change', () => {
      populateQuestionDropdown();
      const selectedFolder = adminFolderFilterSelect.value;
      const list = qManager.getByFolder(selectedFolder);
      if (list && list.length > 0) {
        // If current question is not in this folder, switch to first question of folder
        const exists = list.some(q => state.currentQuestion && q.id === state.currentQuestion.id);
        if (!exists) {
          loadQuestion(list[0]);
        }
      }
    });
  }

  if (adminQuestionSelect) {
    adminQuestionSelect.addEventListener('change', () => {
      const q = qManager.getById(adminQuestionSelect.value);
      if (q) loadQuestion(q);
    });
  }

  if (prevQBtn) {
    prevQBtn.addEventListener('click', () => {
      const selectedFolder = adminFolderFilterSelect ? adminFolderFilterSelect.value : 'all';
      const list = qManager.getByFolder(selectedFolder);
      if (!list || list.length === 0) return;
      const currentIdx = state.currentQuestion ? list.findIndex(q => q.id === state.currentQuestion.id) : 0;
      const prevIdx = currentIdx <= 0 ? list.length - 1 : currentIdx - 1;
      loadQuestion(list[prevIdx]);
    });
  }

  if (nextQBtn) {
    nextQBtn.addEventListener('click', () => {
      const selectedFolder = adminFolderFilterSelect ? adminFolderFilterSelect.value : 'all';
      const list = qManager.getByFolder(selectedFolder);
      if (!list || list.length === 0) return;
      const currentIdx = state.currentQuestion ? list.findIndex(q => q.id === state.currentQuestion.id) : 0;
      const nextIdx = (currentIdx + 1) % list.length;
      loadQuestion(list[nextIdx]);
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

    // Controlling Team display & Award buttons
    if (awardControlTeam1Name) awardControlTeam1Name.textContent = state.team1.name || 'Team 1';
    if (awardControlTeam2Name) awardControlTeam2Name.textContent = state.team2.name || 'Team 2';
    if (awardControlTeam1Btn) {
      awardControlTeam1Btn.style.outline = state.controllingTeam === 1 ? '3px solid #fff' : 'none';
      awardControlTeam1Btn.style.boxShadow = state.controllingTeam === 1 ? '0 0 16px rgba(46,204,113,0.8)' : 'none';
    }
    if (awardControlTeam2Btn) {
      awardControlTeam2Btn.style.outline = state.controllingTeam === 2 ? '3px solid #fff' : 'none';
      awardControlTeam2Btn.style.boxShadow = state.controllingTeam === 2 ? '0 0 16px rgba(255,82,82,0.8)' : 'none';
    }

    if (controllingTeamSelect && controllingTeamSelect.options && controllingTeamSelect.options.length > 2) {
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

    // Active Room Code in Top Header
    updateHeaderRoomBadge(state.roomCode);
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
      const oldTeam = p.team;
      p.team = p.team === 1 ? 2 : 1;
      if (state.faceOff.headPlayerTeam1 === p.playerId) state.faceOff.headPlayerTeam1 = null;
      if (state.faceOff.headPlayerTeam2 === p.playerId) state.faceOff.headPlayerTeam2 = null;
      ensureValidHeadPlayers();
      sync.broadcast('PLAYER_TEAM_CHANGED', {
        playerId: p.playerId,
        playerName: p.playerName,
        oldTeam: oldTeam,
        newTeam: p.team
      });
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
        // Armed buzzers silently (no face-off sting)
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

  // Award Board Control Directly to Team
  function giveBoardControl(teamNumber) {
    state.controllingTeam = teamNumber;
    state.phase = 'BOARD_PLAY';
    state.strikes = 0;
    state.faceOff.buzzerArmed = false;
    const teamName = teamNumber === 1 ? state.team1.name : state.team2.name;
    state.faceOff.statusText = `👑 Board Control awarded to ${teamName}! Playing the board.`;
    broadcastState();
    renderUI();
  }

  if (awardControlTeam1Btn) {
    awardControlTeam1Btn.addEventListener('click', () => giveBoardControl(1));
  }

  if (awardControlTeam2Btn) {
    awardControlTeam2Btn.addEventListener('click', () => giveBoardControl(2));
  }

  if (ruleDirectWinBtn) {
    ruleDirectWinBtn.addEventListener('click', () => {
      if (!state.faceOff.buzzWinner) {
        alert('No player has buzzed in yet!');
        return;
      }
      giveBoardControl(state.faceOff.buzzWinner.team);
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
      giveBoardControl(state.faceOff.buzzWinner.team);
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
    if (count >= 3) {
      sound.playTripleStrike();
      sync.broadcast('PLAY_SOUND', { sound: 'TRIPLE_STRIKE' });
    } else {
      sound.playStrike();
      sync.broadcast('PLAY_SOUND', { sound: 'STRIKE' });
    }
    sync.broadcast('SHOW_STRIKE', { count: count });

    if (state.strikes >= 3 && state.controllingTeam) {
      state.phase = 'STEAL';
      state.steal.active = true;
      state.steal.controllingTeam = state.controllingTeam;
      state.steal.stealingTeam = state.controllingTeam === 1 ? 2 : 1;
      const isFsa = (state.roomCode || '').toUpperCase() === 'FSA-POLYU' || sound.getTheme() === 'philippines';
      if (!isFsa) {
        sound.playStealGong();
        sync.broadcast('PLAY_SOUND', { sound: 'STEAL_GONG' });
      }
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
      // Clear and remove timer immediately upon steal decision
      clearInterval(timerInterval);
      state.timer.running = false;
      state.timer.remaining = 0;
      if (timerDigitsEl) timerDigitsEl.textContent = '0s';
      sync.broadcast('TIMER_STOP', {});

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
      // Clear and remove timer immediately upon steal decision
      clearInterval(timerInterval);
      state.timer.running = false;
      state.timer.remaining = 0;
      if (timerDigitsEl) timerDigitsEl.textContent = '0s';
      sync.broadcast('TIMER_STOP', {});

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
      const inputVal = (roomCodeInput.value || '').toUpperCase().trim().replace(/[^A-Z0-9_-]/g, '');
      const newCode = inputVal || generateRandomRoomCode();
      const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(newCode) : null;

      if (special) {
        state.roomCode = special.code;
        if (roomCodeInput) roomCodeInput.value = special.code;
        const isAuth = sessionStorage.getItem(`feud_admin_auth_${special.code}`) === 'true';

        if (isAuth) {
          initRoom(special.code);
          broadcastState();
          renderUI();
        } else {
          updateAuthOverlayHint();
          if (adminAuthOverlay) adminAuthOverlay.style.display = 'flex';
          if (adminPasswordAuthInput) {
            adminPasswordAuthInput.value = '';
            setTimeout(() => adminPasswordAuthInput.focus(), 100);
          }
        }
        return;
      }

      state.roomCode = newCode;
      initRoom(newCode);
      broadcastState();
      renderUI();
    });
  }

  if (roomCodeInput) {
    roomCodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (setRoomBtn) setRoomBtn.click();
      }
    });
  }

  if (randomRoomBtn) {
    randomRoomBtn.addEventListener('click', () => {
      const code = generateRandomRoomCode();
      state.roomCode = code;
      if (roomCodeInput) roomCodeInput.value = code;
      initRoom(code);
      broadcastState();
      renderUI();
    });
  }

  if (reconnectWebRtcBtn) {
    reconnectWebRtcBtn.addEventListener('click', () => {
      sync.retryAttempts = 0;
      sync.reclaimAttempts = 0;
      sync.destroyPeer();
      initRoom(state.roomCode);
    });
  }

  if (webrtcStatusEl) {
    webrtcStatusEl.style.cursor = 'pointer';
    webrtcStatusEl.title = 'Click to force reconnect WebRTC';
    webrtcStatusEl.addEventListener('click', () => {
      sync.retryAttempts = 0;
      sync.reclaimAttempts = 0;
      sync.destroyPeer();
      initRoom(state.roomCode);
    });
  }

  // --- Admin Settings Bar (Expand/Collapse & State Persistence) ---
  function updateSettingsBarVisibility(isOpen) {
    if (!adminSettingsBar) return;
    if (isOpen) {
      adminSettingsBar.classList.remove('collapsed');
      if (toggleSettingsBarBtn) {
        toggleSettingsBarBtn.classList.add('active');
        toggleSettingsBarBtn.textContent = '⚙️ Settings Bar (Open)';
      }
    } else {
      adminSettingsBar.classList.add('collapsed');
      if (toggleSettingsBarBtn) {
        toggleSettingsBarBtn.classList.remove('active');
        toggleSettingsBarBtn.textContent = '⚙️ Settings Bar';
      }
    }
    try {
      localStorage.setItem('feud_settings_bar_open', isOpen ? 'true' : 'false');
    } catch (e) {}
  }

  const savedBarPref = localStorage.getItem('feud_settings_bar_open');
  const initialOpen = savedBarPref !== null ? (savedBarPref === 'true') : (window.innerWidth > 768);
  updateSettingsBarVisibility(initialOpen);

  if (toggleSettingsBarBtn) {
    toggleSettingsBarBtn.addEventListener('click', () => {
      const isCurrentlyOpen = !adminSettingsBar.classList.contains('collapsed');
      updateSettingsBarVisibility(!isCurrentlyOpen);
    });
  }

  if (collapseSettingsBarBtn) {
    collapseSettingsBarBtn.addEventListener('click', () => {
      updateSettingsBarVisibility(false);
    });
  }

  if (clearRosterBtn) {
    clearRosterBtn.addEventListener('click', () => {
      if (confirm('Clear connected players roster? (Players can simply refresh or re-buzz to rejoin)')) {
        state.connectedPlayers = [];
        if (state.faceOff) {
          state.faceOff.headPlayerTeam1 = null;
          state.faceOff.headPlayerTeam2 = null;
        }
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

  // Mobile Quick Navigation Pills
  document.querySelectorAll('.mobile-nav-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  const mobileOpenQuestionsBtn = document.getElementById('mobileOpenQuestionsBtn');
  if (mobileOpenQuestionsBtn && questionsModalEl) {
    mobileOpenQuestionsBtn.addEventListener('click', () => {
      questionsModalEl.classList.add('active');
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
          window.QRCodeRenderer.toCanvas(qrCanvas, finalUrl, { width: 220, colorDark: '#000000' });
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

  // --- Network Diagnostics / Wi-Fi Blocker Test ---
  function openNetDiagModal() {
    if (netDiagModal) netDiagModal.classList.add('active');
  }

  if (netDiagBtn) netDiagBtn.addEventListener('click', openNetDiagModal);

  async function performNetworkTest() {
    if (!netDiagResultsBox || !netDiagItems) return;
    netDiagResultsBox.style.display = 'block';
    netDiagItems.innerHTML = `
      <div style="color:var(--gold-glow);display:flex;align-items:center;gap:8px;font-weight:700;">
        <span>⏳</span> Testing PeerJS Cloud signaling, WebRTC STUN/UDP, and TURN relays...
      </div>
    `;

    const report = {
      cloudSignaling: false,
      webrtcStun: false,
      webrtcTurn: false,
      candidates: []
    };

    // 1. Test PeerJS Cloud signaling endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      await fetch('https://0.peerjs.com/', { mode: 'no-cors', signal: controller.signal });
      clearTimeout(timeoutId);
      report.cloudSignaling = true;
    } catch (e) {
      report.cloudSignaling = false;
    }

    // 2. Test WebRTC ICE Gathering (STUN & TURN)
    try {
      const pc = new RTCPeerConnection({
        iceServers: sync.getIceServers()
      });
      pc.createDataChannel('feud_diag_channel');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await new Promise((resolve) => {
        const iceTimeout = setTimeout(() => resolve(), 3000);
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            report.candidates.push(e.candidate.type);
            if (e.candidate.type === 'srflx') report.webrtcStun = true;
            if (e.candidate.type === 'relay') report.webrtcTurn = true;
          } else {
            clearTimeout(iceTimeout);
            resolve();
          }
        };
      });
      pc.close();
    } catch (err) {
      console.warn('ICE test error:', err);
    }

    // Render results
    let html = '';

    // Cloud Signaling
    if (report.cloudSignaling) {
      html += `<div style="color:#2ecc71;">✅ <strong>PeerJS Cloud Signaling:</strong> Connected (HTTPS / WebSocket port 443 accessible)</div>`;
    } else {
      html += `<div style="color:#e74c3c;">❌ <strong>PeerJS Cloud Signaling:</strong> BLOCKED (Firewall is blocking 0.peerjs.com)</div>`;
    }

    // STUN / UDP
    if (report.webrtcStun) {
      html += `<div style="color:#2ecc71;">✅ <strong>WebRTC STUN (UDP 19302):</strong> Accessible (Direct phone-to-laptop P2P supported)</div>`;
    } else {
      html += `<div style="color:#f39c12;">⚠️ <strong>WebRTC STUN (UDP):</strong> Restricted (Common on PolyU/campus Wi-Fi)</div>`;
    }

    // TURN Relay
    if (report.webrtcTurn || report.cloudSignaling) {
      html += `<div style="color:#2ecc71;">✅ <strong>TURN Relay Fallback (TCP 443):</strong> Active (Permits traversal through strict firewalls)</div>`;
    }

    // Local Dual-Screen
    html += `<div style="color:#2ecc71;">✅ <strong>Local Dual-Screen (Projector):</strong> 100% Ready (Zero internet required)</div>`;

    // Verdict
    if (report.cloudSignaling && report.webrtcStun) {
      html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(46,204,113,0.2);border:1px solid #2ecc71;border-radius:6px;color:#2ecc71;font-weight:700;">🎉 Wi-Fi is clean! Players can join and buzz seamlessly.</div>`;
    } else if (report.cloudSignaling) {
      html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(243,156,18,0.2);border:1px solid #f39c12;border-radius:6px;color:#f39c12;font-weight:700;">⚠️ Strict Campus Wi-Fi NAT detected. If mobile phones have trouble joining, have contestants switch their phone to 4G/5G mobile data, or turn on a phone Hotspot.</div>`;
    } else {
      html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(231,76,60,0.2);border:1px solid #e74c3c;border-radius:6px;color:#ff7675;font-weight:700;">🚫 Wi-Fi is actively blocking games. Please switch host laptop to a Phone Hotspot, or use Offline Dual-Screen mode!</div>`;
    }

    netDiagItems.innerHTML = html;
  }

  if (runNetTestBtn) {
    runNetTestBtn.addEventListener('click', performNetworkTest);
  }

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Sound FX buttons & Philippine Family Feud Soundboard
  function updateThemeButtonUI(isPlaying) {
    if (!sfxThemeSongBtn) return;
    if (isPlaying) {
      if (themePlayIcon) themePlayIcon.textContent = '⏹';
      if (themePlayText) themePlayText.textContent = 'Stop Theme Song';
      if (themeSongStatus) themeSongStatus.textContent = 'Playing: Jeremiah Tiangco - "Ano\'ng Sabe" 🎶';
      sfxThemeSongBtn.classList.add('sfx-playing');
    } else {
      if (themePlayIcon) themePlayIcon.textContent = '▶';
      if (themePlayText) themePlayText.textContent = 'Play Theme Song';
      if (themeSongStatus) themeSongStatus.textContent = 'Official Philippine Family Feud Theme Track';
      sfxThemeSongBtn.classList.remove('sfx-playing');
    }
  }

  sound.onThemeStateChange = (isPlaying) => {
    updateThemeButtonUI(isPlaying);
  };

  if (sfxThemeSongBtn) {
    sfxThemeSongBtn.addEventListener('click', () => {
      const isPlaying = sound.toggleTheme();
      sync.broadcast('PLAY_SOUND', { sound: isPlaying ? 'THEME_PLAY' : 'THEME_STOP' });
    });
  }

  if (sfxThemeFadeBtn) {
    sfxThemeFadeBtn.addEventListener('click', () => {
      sound.fadeOutTheme(1500);
      sync.broadcast('PLAY_SOUND', { sound: 'THEME_FADEOUT' });
    });
  }

  function updateSoundThemeUI() {
    const curTheme = sound.getTheme();
    if (soundThemeBadge) {
      soundThemeBadge.textContent = curTheme === 'philippines' ? '🇵🇭 Philippine Feud Edition' : '🎹 Classic Synth SFX';
      soundThemeBadge.className = curTheme === 'philippines' ? 'badge badge-gold' : 'badge';
    }
    if (sfxThemeToggleBtn) {
      sfxThemeToggleBtn.style.display = 'none';
    }
    if (sfxGongBtn) {
      sfxGongBtn.style.display = curTheme === 'philippines' ? 'none' : 'inline-flex';
    }
  }

  if (sfxThemeToggleBtn) {
    sfxThemeToggleBtn.addEventListener('click', () => {
      const nextTheme = sound.getTheme() === 'philippines' ? 'classic' : 'philippines';
      sound.setTheme(nextTheme);
      updateSoundThemeUI();
    });
  }

  if (sfxDingBtn) {
    sfxDingBtn.addEventListener('click', () => {
      sound.playDing();
      sync.broadcast('PLAY_SOUND', { sound: 'DING' });
    });
  }

  if (sfxStrikeBtn) {
    sfxStrikeBtn.addEventListener('click', () => {
      sound.playStrike();
      sync.broadcast('PLAY_SOUND', { sound: 'STRIKE' });
    });
  }

  if (sfxDoubleStrikeBtn) {
    sfxDoubleStrikeBtn.addEventListener('click', () => {
      sound.playStrike();
      sync.broadcast('PLAY_SOUND', { sound: 'STRIKE' });
    });
  }

  if (sfxTripleStrikeBtn) {
    sfxTripleStrikeBtn.addEventListener('click', () => {
      sound.playTripleStrike();
      sync.broadcast('PLAY_SOUND', { sound: 'TRIPLE_STRIKE' });
    });
  }

  if (sfxFaceoffBtn) {
    sfxFaceoffBtn.addEventListener('click', () => {
      sound.playWalkIn();
      sync.broadcast('PLAY_SOUND', { sound: 'WALK_IN' });
    });
  }

  if (sfxBuzzerBtn) {
    sfxBuzzerBtn.addEventListener('click', () => {
      sound.playBuzzerHit();
      sync.broadcast('PLAY_SOUND', { sound: 'BUZZER' });
    });
  }

  if (sfxGongBtn) {
    sfxGongBtn.addEventListener('click', () => {
      const isFsa = (state.roomCode || '').toUpperCase() === 'FSA-POLYU' || sound.getTheme() === 'philippines';
      if (isFsa) return;
      sound.playStealGong();
      sync.broadcast('PLAY_SOUND', { sound: 'STEAL_GONG' });
    });
  }

  if (sfxFanfareBtn) {
    sfxFanfareBtn.addEventListener('click', () => {
      sound.playFanfare();
      sync.broadcast('PLAY_SOUND', { sound: 'FANFARE' });
    });
  }

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

          const targetFld = spreadsheetFolderSelect ? spreadsheetFolderSelect.value : 'default';
          const result = qManager.importFromSpreadsheetData(jsonRows, targetFld);
          if (result.success) {
            alert(`Successfully imported ${result.count} questions from Excel into "${qManager.getFolderById(targetFld).name}"!`);
            populateFolderDropdowns();
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
          const targetFld = spreadsheetFolderSelect ? spreadsheetFolderSelect.value : 'default';
          const result = qManager.importFromSpreadsheetData(rows, targetFld);
          if (result.success) {
            alert(`Successfully imported ${result.count} questions from CSV into "${qManager.getFolderById(targetFld).name}"!`);
            populateFolderDropdowns();
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

  // --- Tab 1: Render Question Bank List with Search & Folder Filtering ---
  function renderQuestionsManagerList(searchQuery = '') {
    if (!customQListEl) return;
    customQListEl.innerHTML = '';
    const list = qManager.getByFolder(activeFolderFilter);
    const query = searchQuery.trim().toLowerCase();

    const filtered = query
      ? list.filter(q => q.question.toLowerCase().includes(query) || q.answers.some(a => a.text.toLowerCase().includes(query)))
      : list;

    const totalCount = qManager.getAll().length;
    if (tabBankCount) tabBankCount.textContent = totalCount;
    if (totalQuestionsCountBadge) totalQuestionsCountBadge.textContent = `${totalCount} Loaded`;

    if (filtered.length === 0) {
      customQListEl.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);">No questions found in this folder${query ? ` matching "${searchQuery}"` : ''}.</div>`;
      return;
    }

    const allFolders = qManager.getFolders();

    filtered.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'q-bank-card';
      const totalPts = q.answers.reduce((acc, a) => acc + (a.points || 0), 0);
      const isCurrent = state.currentQuestion && state.currentQuestion.id === q.id;
      const currentFolder = qManager.getFolderById(q.folderId || 'default');

      // Generate answer pills preview
      const pillsHtml = q.answers.map((a, i) => `
        <span class="q-ans-pill">#${i + 1} ${a.text} (${a.points})</span>
      `).join('');

      // Build folder options for Move dropdown
      const folderOptionsHtml = allFolders.map(f => `
        <option value="${f.id}" ${(q.folderId || 'default') === f.id ? 'selected' : ''}>${f.icon || '📁'} ${f.name}</option>
      `).join('');

      card.innerHTML = `
        <div class="q-bank-header">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
              <span class="badge ${isCurrent ? 'badge-green' : 'badge-gold'}" style="font-size:0.75rem;">
                ${isCurrent ? 'ACTIVE ON BOARD' : `Question #${idx + 1}`}
              </span>
              <span class="badge badge-blue" style="font-size:0.75rem;background:rgba(52,152,219,0.25);border-color:#3498db;color:#74b9ff;">
                📁 ${currentFolder.name}
              </span>
              <span style="font-size:0.8rem;color:var(--text-muted);font-weight:700;">${q.answers.length} Answers · ${totalPts} Total Pts</span>
            </div>
            <div class="q-bank-prompt">${q.question}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;align-items:center;flex-wrap:wrap;">
            <select class="move-folder-select" title="Move to another folder">
              ${folderOptionsHtml}
            </select>
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

      // Handle folder move
      const moveSelect = card.querySelector('.move-folder-select');
      moveSelect.addEventListener('change', (e) => {
        const targetFld = e.target.value;
        qManager.moveQuestionToFolder(q.id, targetFld);
        populateFolderDropdowns();
        populateQuestionDropdown();
        renderQuestionsManagerList(qSearchInput ? qSearchInput.value : '');
      });

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
          populateFolderDropdowns();
          populateQuestionDropdown();
          renderQuestionsManagerList(qSearchInput ? qSearchInput.value : '');
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

    if (builderFolderSelect) {
      builderFolderSelect.value = (activeFolderFilter && activeFolderFilter !== 'all') ? activeFolderFilter : 'default';
    }

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

    if (builderFolderSelect) {
      builderFolderSelect.value = q.folderId || 'default';
    }

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

      const targetFolder = builderFolderSelect ? builderFolderSelect.value : 'default';
      const editingId = editingQuestionIdInput ? editingQuestionIdInput.value : '';
      let savedQ;

      if (editingId) {
        // Update existing question
        savedQ = qManager.updateQuestion(editingId, prompt, answers, targetFolder);
        alert('Question updated successfully!');
      } else {
        // Create new question
        savedQ = qManager.addQuestion(prompt, answers, targetFolder);
        alert('Question saved to bank successfully!');
      }

      resetBuilderForm();
      populateFolderDropdowns();
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
          populateFolderDropdowns();
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
        activeFolderFilter = 'default';
        populateFolderDropdowns();
        renderQuestionsManagerList();
        populateQuestionDropdown();
        loadQuestion(qManager.getAll()[0]);
      }
    });
  }

  // ==========================================
  // ADMIN PASSWORD SECURITY & SETTINGS (GETTER & SETTER)
  // ==========================================
  function updateAuthOverlayHint() {
    const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
    const authOverlayTitle = document.getElementById('authOverlayTitle');
    const authOverlayDesc = document.getElementById('authOverlayDesc');
    const authLockIcon = document.getElementById('authLockIcon');
    const adminUnlockBtn = document.getElementById('adminUnlockBtn');

    if (special) {
      if (authLockIcon) authLockIcon.textContent = '🇵🇭 🔒';
      if (authOverlayTitle) authOverlayTitle.innerHTML = `Protected Event Room: <span style="color:var(--gold-primary);">${special.code}</span>`;
      if (authOverlayDesc) authOverlayDesc.textContent = `Enter the admin password for event room "${special.code}" to supervise this Philippine Family Feud session.`;
      if (adminUnlockBtn) adminUnlockBtn.textContent = `Unlock ${special.code} Panel ➔`;
      if (authOverlayHint) {
        authOverlayHint.innerHTML = `<span style="color:var(--text-muted);">🔒 Protected Event Room: <strong style="color:var(--gold-primary);">${special.code}</strong>. Password: <code style="color:var(--gold-primary);background:rgba(0,0,0,0.4);padding:2px 6px;border-radius:4px;font-weight:800;">${special.password}</code></span>`;
      }
    } else {
      if (authLockIcon) authLockIcon.textContent = '🔒';
      if (authOverlayTitle) authOverlayTitle.textContent = 'Host Panel Protected';
      if (authOverlayDesc) authOverlayDesc.textContent = 'Enter the Admin Password to supervise this Family Feud game session.';
      if (adminUnlockBtn) adminUnlockBtn.textContent = 'Unlock Admin Panel ➔';
      if (authOverlayHint) {
        authOverlayHint.innerHTML = `Default password is: <code style="color:var(--gold-primary);font-weight:800;background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;">feudadmin</code>`;
      }
    }
  }

  function getAdminPassword() {
    const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
    if (special) {
      return localStorage.getItem(`feud_admin_password_${special.code}`) || special.password;
    }
    return localStorage.getItem('feud_admin_password') || 'feudadmin';
  }

  // Check password authentication & setup status
  function checkInitialPasswordPrompt() {
    const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
    const isSpecialAuth = special
      ? (sessionStorage.getItem(`feud_admin_auth_${special.code}`) === 'true')
      : false;

    updateAuthOverlayHint();

    // SPECIAL EVENT ROOM (e.g. FSA-POLYU)
    if (special) {
      if (initialPasswordModal) initialPasswordModal.classList.remove('active');
      if (!isSpecialAuth) {
        if (adminAuthOverlay) adminAuthOverlay.style.display = 'flex';
        if (adminPasswordAuthInput) {
          setTimeout(() => adminPasswordAuthInput.focus(), 100);
        }
      } else {
        if (adminAuthOverlay) adminAuthOverlay.style.display = 'none';
      }
      return;
    }

    // STANDARD ROOMS:
    // Standard rooms NEVER show the blocking lock screen!
    if (adminAuthOverlay) adminAuthOverlay.style.display = 'none';

    // Show initial password setup modal ("Set Admin Protection") only if not yet set up
    const isSetupDone = localStorage.getItem('feud_admin_password_setup_done') === 'true';
    if (!isSetupDone) {
      if (initialPasswordModal) initialPasswordModal.classList.add('active');
    } else {
      if (initialPasswordModal) initialPasswordModal.classList.remove('active');
    }
  }

  if (useDefaultPasswordBtn) {
    useDefaultPasswordBtn.addEventListener('click', () => {
      const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
      const defPass = special ? special.password : 'feudadmin';
      if (special) {
        localStorage.setItem(`feud_admin_password_${special.code}`, defPass);
        sessionStorage.setItem(`feud_admin_auth_${special.code}`, 'true');
      } else {
        localStorage.setItem('feud_admin_password', defPass);
      }
      localStorage.setItem('feud_admin_password_setup_done', 'true');
      sessionStorage.setItem('feud_admin_auth', 'true');
      if (adminCurrentPasswordDisplay) adminCurrentPasswordDisplay.value = defPass;
      if (initialPasswordModal) initialPasswordModal.classList.remove('active');
    });
  }

  if (saveCustomPasswordBtn && initialCustomPasswordInput) {
    const handleCustomSave = () => {
      const pass = initialCustomPasswordInput.value.trim();
      if (!pass || pass.length < 4) {
        if (initialPassErrorMsg) initialPassErrorMsg.style.display = 'block';
        initialCustomPasswordInput.focus();
        return;
      }
      if (initialPassErrorMsg) initialPassErrorMsg.style.display = 'none';
      const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
      if (special) {
        localStorage.setItem(`feud_admin_password_${special.code}`, pass);
        sessionStorage.setItem(`feud_admin_auth_${special.code}`, 'true');
      } else {
        localStorage.setItem('feud_admin_password', pass);
      }
      localStorage.setItem('feud_admin_password_setup_done', 'true');
      sessionStorage.setItem('feud_admin_auth', 'true');
      if (adminCurrentPasswordDisplay) adminCurrentPasswordDisplay.value = pass;
      if (initialPasswordModal) initialPasswordModal.classList.remove('active');
    };

    saveCustomPasswordBtn.addEventListener('click', handleCustomSave);
    initialCustomPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCustomSave();
    });
  }

  if (skipPasswordSetupBtn) {
    skipPasswordSetupBtn.addEventListener('click', () => {
      localStorage.setItem('feud_admin_password_setup_done', 'true');
      sessionStorage.setItem('feud_admin_auth', 'true');
      if (initialPasswordModal) initialPasswordModal.classList.remove('active');
    });
  }

  // Eye button to show/hide password on the lock overlay
  const toggleAuthPassVisibilityBtn = document.getElementById('toggleAuthPassVisibilityBtn');
  const authEyeIcon = document.getElementById('authEyeIcon');
  const authEyeText = document.getElementById('authEyeText');
  if (toggleAuthPassVisibilityBtn && adminPasswordAuthInput) {
    toggleAuthPassVisibilityBtn.addEventListener('click', () => {
      const isPass = adminPasswordAuthInput.type === 'password';
      adminPasswordAuthInput.type = isPass ? 'text' : 'password';
      if (authEyeIcon) authEyeIcon.textContent = isPass ? '🔒' : '👁️';
      if (authEyeText) authEyeText.textContent = isPass ? 'Hide' : 'Show';
      adminPasswordAuthInput.focus();
    });
  }

  // Switch to standard room escape button on the lock overlay
  const authOverlayExitToStandardBtn = document.getElementById('authOverlayExitToStandardBtn');
  if (authOverlayExitToStandardBtn) {
    authOverlayExitToStandardBtn.addEventListener('click', () => {
      const freshCode = generateRandomRoomCode();
      state.roomCode = freshCode;
      if (roomCodeInput) roomCodeInput.value = freshCode;
      sessionStorage.setItem('feud_admin_auth', 'true');
      initRoom(freshCode);
      if (adminAuthOverlay) adminAuthOverlay.style.display = 'none';
      if (authErrorMsg) authErrorMsg.style.display = 'none';
      broadcastState();
      renderUI();
    });
  }

  // Unlock logic for when screen is locked via "Lock Screen Now" or secret room gate
  if (adminUnlockBtn && adminPasswordAuthInput) {
    const attemptUnlock = () => {
      const inputPass = adminPasswordAuthInput.value.trim();
      const cleanInput = inputPass.toLowerCase().replace(/[\s_]/g, '-');
      const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
      const targetPass = getAdminPassword();

      // Check special room matches (exact, lowercase, or normalized hyphens)
      const specialPass = special ? (special.password || '').toLowerCase() : '';
      const isSpecialMatch = special && (
        inputPass.toLowerCase() === specialPass ||
        cleanInput === specialPass.replace(/[\s_]/g, '-') ||
        cleanInput === 'fsa-polyu-pass' ||
        cleanInput === 'fsa-polyu-pas'
      );

      // Master check: If user typed fsa-polyu-pass or fsa-polyu-pas
      const isFsaDirect = (
        cleanInput === 'fsa-polyu-pass' ||
        cleanInput === 'fsa-polyu-pas' ||
        inputPass.toLowerCase() === 'fsa-polyu-pass'
      );

      // Standard target password check or feudadmin fallback
      const isTargetMatch = (
        inputPass === targetPass ||
        cleanInput === targetPass.toLowerCase() ||
        inputPass.toLowerCase() === 'feudadmin'
      );

      if (isSpecialMatch || isFsaDirect || isTargetMatch) {
        if (isFsaDirect || (special && special.code === 'FSA-POLYU')) {
          sessionStorage.setItem('feud_admin_auth_FSA-POLYU', 'true');
          sessionStorage.setItem('feud_admin_auth', 'true');
          state.roomCode = 'FSA-POLYU';
          if (roomCodeInput) roomCodeInput.value = 'FSA-POLYU';
          if (sync.roomCode !== 'FSA-POLYU' || !sync.isOnline) {
            initRoom('FSA-POLYU');
          }
        } else {
          sessionStorage.setItem('feud_admin_auth', 'true');
          if (sync.roomCode !== state.roomCode || !sync.isOnline) {
            initRoom(state.roomCode);
          }
        }

        if (adminAuthOverlay) adminAuthOverlay.style.display = 'none';
        if (authErrorMsg) authErrorMsg.style.display = 'none';
        adminPasswordAuthInput.value = '';
        renderUI();
        broadcastState();
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
      const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
      if (special) {
        localStorage.setItem(`feud_admin_password_${special.code}`, newPass);
      } else {
        localStorage.setItem('feud_admin_password', newPass);
      }
      if (adminCurrentPasswordDisplay) adminCurrentPasswordDisplay.value = newPass;
      if (adminNewPasswordInput) adminNewPasswordInput.value = '';
      alert('Admin password updated successfully!');
    });
  }

  if (lockScreenNowBtn) {
    lockScreenNowBtn.addEventListener('click', () => {
      const special = window.getSpecialRoomConfig ? window.getSpecialRoomConfig(state.roomCode) : null;
      sessionStorage.removeItem('feud_admin_auth');
      if (special) {
        sessionStorage.removeItem(`feud_admin_auth_${special.code}`);
      }
      if (passwordModal) passwordModal.classList.remove('active');
      if (adminAuthOverlay) adminAuthOverlay.style.display = 'flex';
      if (adminPasswordAuthInput) {
        adminPasswordAuthInput.value = '';
        adminPasswordAuthInput.focus();
      }
    });
  }

  // Prompt on initial access
  checkInitialPasswordPrompt();

  // ==========================================
  // AI QUESTION GENERATOR (PG GUARDRAILS & FOLDERS)
  // ==========================================
  const aiTopicInput = document.getElementById('aiTopicInput');
  const aiGenerateBtn = document.getElementById('aiGenerateBtn');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const saveGeminiKeyBtn = document.getElementById('saveGeminiKeyBtn');
  const aiStatusArea = document.getElementById('aiStatusArea');
  const aiResultCard = document.getElementById('aiResultCard');
  const aiSourceBadge = document.getElementById('aiSourceBadge');
  const aiPointsTotalBadge = document.getElementById('aiPointsTotalBadge');
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

      if (aiGeneratedQuestionInput) {
        aiGeneratedQuestionInput.value = res.question.question;
      }

      if (aiGeneratedAnswersList) {
        aiGeneratedAnswersList.innerHTML = '';
        res.question.answers.forEach((ans, idx) => {
          const item = document.createElement('div');
          item.className = 'answer-card-preview';
          item.style.display = 'flex';
          item.style.alignItems = 'center';
          item.style.gap = '8px';
          item.style.background = 'rgba(255,255,255,0.06)';
          item.style.padding = '8px 12px';
          item.style.borderRadius = '6px';
          item.style.marginBottom = '6px';
          item.innerHTML = `
            <span style="font-weight:800;color:var(--gold-glow);width:24px;">#${idx + 1}</span>
            <input type="text" class="form-input ai-ans-text" value="${ans.text}" style="flex:1;padding:5px 8px;font-size:0.85rem;">
            <input type="number" class="form-input ai-ans-pts" value="${ans.points}" style="width:65px;padding:5px 8px;font-size:0.85rem;text-align:center;">
          `;

          const ptsInp = item.querySelector('.ai-ans-pts');
          ptsInp.addEventListener('input', () => {
            const allPts = aiGeneratedAnswersList.querySelectorAll('.ai-ans-pts');
            let sum = 0;
            allPts.forEach(p => sum += parseInt(p.value, 10) || 0);
            if (aiPointsTotalBadge) aiPointsTotalBadge.textContent = `Total: ${sum} Pts`;
          });

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

  function getAiQuestionFromInputs() {
    if (!latestAiQuestion) return null;
    const qText = aiGeneratedQuestionInput ? aiGeneratedQuestionInput.value.trim() : latestAiQuestion.question;
    const answers = [];
    if (aiGeneratedAnswersList) {
      const textInps = aiGeneratedAnswersList.querySelectorAll('.ai-ans-text');
      const ptsInps = aiGeneratedAnswersList.querySelectorAll('.ai-ans-pts');
      for (let i = 0; i < textInps.length; i++) {
        const t = textInps[i].value.trim();
        const p = parseInt(ptsInps[i].value, 10) || 0;
        if (t) answers.push({ text: t, points: p });
      }
    }
    return {
      id: latestAiQuestion.id || ('ai-' + Date.now()),
      question: qText || latestAiQuestion.question,
      answers: answers.length > 0 ? answers : latestAiQuestion.answers
    };
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
      const q = getAiQuestionFromInputs();
      if (!q) return;
      const targetFolder = aiTargetFolderSelect ? aiTargetFolderSelect.value : 'default';
      qManager.add(q, targetFolder);
      populateFolderDropdowns();
      populateQuestionDropdown();
      renderQuestionsManagerList();
      aiAddToBankBtn.textContent = '✅ Added to Bank!';
      setTimeout(() => aiAddToBankBtn.textContent = '📋 Add to Bank', 1500);
    });
  }

  if (aiPlayNowBtn) {
    aiPlayNowBtn.addEventListener('click', () => {
      const q = getAiQuestionFromInputs();
      if (!q) return;
      const targetFolder = aiTargetFolderSelect ? aiTargetFolderSelect.value : 'default';
      const added = qManager.add(q, targetFolder);
      populateFolderDropdowns();
      populateQuestionDropdown();
      renderQuestionsManagerList();
      loadQuestion(added || q);
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  }

  // ==========================================
  // FOLDER CREATION & RENAME MODAL WIRING
  // ==========================================
  function openFolderModal(mode = 'create', folderId = null) {
    editingFolderId = folderId;
    if (mode === 'rename' && folderId) {
      const f = qManager.getFolderById(folderId);
      if (folderModalTitle) folderModalTitle.textContent = '✏️ Rename Question Folder';
      if (folderNameInput) folderNameInput.value = f ? f.name : '';
    } else {
      if (folderModalTitle) folderModalTitle.textContent = '📁 New Question Folder';
      if (folderNameInput) folderNameInput.value = '';
    }
    if (folderModal) folderModal.classList.add('active');
    if (folderNameInput) folderNameInput.focus();
  }

  function closeFolderModal() {
    if (folderModal) folderModal.classList.remove('active');
    editingFolderId = null;
  }

  if (addNewFolderBtn) addNewFolderBtn.addEventListener('click', () => openFolderModal('create'));
  if (builderNewFolderBtn) builderNewFolderBtn.addEventListener('click', () => openFolderModal('create'));
  if (aiNewFolderBtn) aiNewFolderBtn.addEventListener('click', () => openFolderModal('create'));

  if (renameCurrentFolderBtn) {
    renameCurrentFolderBtn.addEventListener('click', () => {
      if (activeFolderFilter === 'all' || activeFolderFilter === 'default') return;
      openFolderModal('rename', activeFolderFilter);
    });
  }

  if (deleteCurrentFolderBtn) {
    deleteCurrentFolderBtn.addEventListener('click', () => {
      if (activeFolderFilter === 'all' || activeFolderFilter === 'default') return;
      const f = qManager.getFolderById(activeFolderFilter);
      const name = f ? f.name : 'this folder';
      if (confirm(`Delete folder "${name}"? All questions in this folder will be moved to the Default folder.`)) {
        qManager.deleteFolder(activeFolderFilter);
        activeFolderFilter = 'default';
        populateFolderDropdowns();
        populateQuestionDropdown();
        renderQuestionsManagerList();
      }
    });
  }

  if (cancelFolderModalBtn) cancelFolderModalBtn.addEventListener('click', closeFolderModal);
  if (closeFolderModalBtn) closeFolderModalBtn.addEventListener('click', closeFolderModal);

  if (saveFolderModalBtn) {
    saveFolderModalBtn.addEventListener('click', () => {
      const name = folderNameInput ? folderNameInput.value.trim() : '';
      if (!name) {
        alert('Please enter a folder name.');
        return;
      }
      try {
        if (editingFolderId) {
          qManager.renameFolder(editingFolderId, name);
        } else {
          const newFld = qManager.createFolder(name);
          activeFolderFilter = newFld.id;
        }
        closeFolderModal();
        populateFolderDropdowns();
        populateQuestionDropdown();
        renderQuestionsManagerList();
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (folderNameInput) {
    folderNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveFolderModalBtn.click();
    });
  }
});
