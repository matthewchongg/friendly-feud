/**
 * Family Feud Game State Management
 */

class GameState {
  constructor() {
    this.storageKey = 'feud_live_state';
    this.defaultState = {
      roomCode: 'FEUD',
      totalRounds: 3, // Custom configurable total rounds (e.g. 1 to 10)
      currentRound: 1,
      multiplier: 1, // Current round multiplier
      roundMultipliers: { 1: 1, 2: 2, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3 },
      team1: {
        name: 'Team 1',
        score: 0,
        roundScores: [0, 0, 0],
        captain: ''
      },
      team2: {
        name: 'Team 2',
        score: 0,
        roundScores: [0, 0, 0],
        captain: ''
      },
      controllingTeam: null, // 1 or 2
      currentQuestion: null, // { id, question, answers: [{ text, points, revealed: false }] }
      bank: 0, // Accumulated points for the current round
      strikes: 0, // 0, 1, 2, 3
      strikeDisplay: 0,
      phase: 'FACE_OFF', // 'FACE_OFF' | 'BOARD_PLAY' | 'STEAL' | 'ROUND_SUMMARY' | 'GRAND_WINNER'
      faceOff: {
        buzzerArmed: false,
        buzzWinner: null, // { playerId, playerName, team, timestamp }
        secondBuzz: null, // { playerId, playerName, team, timestamp }
        statusText: 'Podiums Ready. Arm buzzers to start face-off.'
      },
      timer: {
        duration: 20,
        remaining: 20,
        running: false,
        type: 'TURN' // 'TURN' (20s) | 'STEAL' (15s) | 'CUSTOM'
      },
      steal: {
        active: false,
        controllingTeam: null,
        stealingTeam: null
      },
      turnIndex: {
        team1: 0,
        team2: 0
      },
      connectedPlayers: [], // [{ id, name, team, isCaptain, joinedAt }]
      winner: null
    };

    this.state = this.loadState();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        return Object.assign({}, this.defaultState, JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Could not read state from localStorage', e);
    }
    return JSON.parse(JSON.stringify(this.defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  get() {
    return this.state;
  }

  update(patch) {
    Object.assign(this.state, patch);
    this.saveState();
    return this.state;
  }

  resetAll() {
    this.state = JSON.parse(JSON.stringify(this.defaultState));
    this.saveState();
    return this.state;
  }

  resetRound() {
    this.state.bank = 0;
    this.state.strikes = 0;
    this.state.controllingTeam = null;
    this.state.phase = 'FACE_OFF';
    this.state.faceOff = {
      buzzerArmed: false,
      buzzWinner: null,
      secondBuzz: null,
      statusText: 'Podiums Ready. Arm buzzers to start face-off.'
    };
    this.state.steal = {
      active: false,
      controllingTeam: null,
      stealingTeam: null
    };
    this.state.timer = {
      duration: 20,
      remaining: 20,
      running: false,
      type: 'TURN'
    };
    if (this.state.currentQuestion && this.state.currentQuestion.answers) {
      this.state.currentQuestion.answers.forEach(a => a.revealed = false);
    }
    this.saveState();
    return this.state;
  }
}

window.gameState = new GameState();
