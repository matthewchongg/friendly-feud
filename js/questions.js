/**
 * Family Feud Questions Bank & Management
 * Supports custom question creation, CSV & Excel (.xlsx) spreadsheet uploads,
 * JSON import/export, and downloadable sample templates.
 */

const DEFAULT_QUESTIONS = [
  {
    id: "q-1",
    folderId: "default",
    question: "Name something people always forget to bring when leaving the house.",
    answers: [
      { text: "Smartphone / Mobile Phone", points: 36 },
      { text: "House Keys / Car Keys", points: 26 },
      { text: "Wallet / Purse / Money", points: 18 },
      { text: "Umbrella", points: 9 },
      { text: "Earphones / Headphones", points: 5 },
      { text: "Phone Charger / Power Bank", points: 3 },
      { text: "Sunglasses / Glasses", points: 2 },
      { text: "Water Bottle", points: 1 }
    ]
  },
  {
    id: "q-2",
    folderId: "default",
    question: "Name a food people love to eat while watching a movie.",
    answers: [
      { text: "Popcorn", points: 42 },
      { text: "Potato Chips / Nachos", points: 22 },
      { text: "Pizza", points: 15 },
      { text: "Candy / Chocolate", points: 10 },
      { text: "Ice Cream", points: 5 },
      { text: "Hot Dog", points: 4 },
      { text: "Fried Chicken", points: 2 }
    ]
  },
  {
    id: "q-3",
    folderId: "default",
    question: "Name an excuse people use to cancel plans at the last minute.",
    answers: [
      { text: "Not feeling well / Sick", points: 45 },
      { text: "Stuck at work / Overtime", points: 21 },
      { text: "Family emergency", points: 14 },
      { text: "Car trouble / Bad traffic", points: 8 },
      { text: "Forgot about prior commitment", points: 5 },
      { text: "Tired / Need sleep", points: 4 },
      { text: "Pet is sick", points: 3 }
    ]
  },
  {
    id: "q-4",
    folderId: "default",
    question: "Name something people do first thing after waking up.",
    answers: [
      { text: "Check phone / Social media", points: 46 },
      { text: "Turn off alarm / Snooze", points: 24 },
      { text: "Go to the bathroom", points: 14 },
      { text: "Stretch and yawn", points: 7 },
      { text: "Drink water", points: 5 },
      { text: "Make coffee or tea", points: 4 }
    ]
  },
  {
    id: "q-5",
    folderId: "default",
    question: "Name something you should NEVER do during a job interview.",
    answers: [
      { text: "Check or answer phone", points: 38 },
      { text: "Arrive late", points: 27 },
      { text: "Badmouth previous boss / company", points: 16 },
      { text: "Lie on your resume", points: 9 },
      { text: "Chew gum", points: 5 },
      { text: "Fall asleep / Yawn loudly", points: 3 },
      { text: "Ask about vacation first", points: 2 }
    ]
  },
  {
    id: "q-6",
    folderId: "default",
    question: "Name something people pretend to understand just to look smart.",
    answers: [
      { text: "Cryptocurrency / Bitcoin", points: 34 },
      { text: "Wine Tasting & Vintage", points: 23 },
      { text: "Modern Art", points: 18 },
      { text: "Quantum Physics", points: 11 },
      { text: "Classical Music / Opera", points: 7 },
      { text: "Stock Market / Forex", points: 5 },
      { text: "Political Jargon", points: 2 }
    ]
  },
  {
    id: "q-7",
    folderId: "default",
    question: "Name a place where you are expected to be completely silent.",
    answers: [
      { text: "Library", points: 48 },
      { text: "Movie Theater / Cinema", points: 24 },
      { text: "Church / Place of Worship", points: 12 },
      { text: "Hospital / Doctor clinic", points: 7 },
      { text: "Courtroom", points: 5 },
      { text: "Exam Room", points: 4 }
    ]
  },
  {
    id: "q-8",
    folderId: "default",
    question: "Name something you dread doing at the gym.",
    answers: [
      { text: "Leg day / Heavy squats", points: 40 },
      { text: "Burpees", points: 22 },
      { text: "Running on treadmill", points: 16 },
      { text: "Planks", points: 10 },
      { text: "Waiting for machines", points: 6 },
      { text: "Stretching at the end", points: 4 },
      { text: "Cleaning equipment", points: 2 }
    ]
  },
  {
    id: "q-9",
    folderId: "default",
    question: "Name something you find in almost every hotel room.",
    answers: [
      { text: "Television", points: 35 },
      { text: "Mini fridge / Minibar", points: 22 },
      { text: "Bible / Room directory", points: 15 },
      { text: "Hairdryer", points: 11 },
      { text: "Safe box", points: 8 },
      { text: "Kettle / Coffee maker", points: 6 },
      { text: "Room slippers", points: 3 }
    ]
  },
  {
    id: "q-10",
    folderId: "default",
    question: "Name something people complain about at airports.",
    answers: [
      { text: "Flight delays / Cancellations", points: 44 },
      { text: "Long security lines", points: 26 },
      { text: "Overpriced food and drinks", points: 14 },
      { text: "Lost or damaged luggage", points: 8 },
      { text: "Crowded gates / No seating", points: 5 },
      { text: "Slow baggage claim", points: 3 }
    ]
  },
  {
    id: "q-11",
    folderId: "default",
    question: "Name a classic excuse for arriving late to work or school.",
    answers: [
      { text: "Heavy traffic / Gridlock", points: 42 },
      { text: "Alarm clock did not go off", points: 26 },
      { text: "Public transit delayed / Bus broke down", points: 14 },
      { text: "Could not find car keys", points: 8 },
      { text: "Spilled coffee or breakfast on clothes", points: 5 },
      { text: "Bad weather / Heavy rain", points: 3 },
      { text: "Had to walk the dog", points: 2 }
    ]
  },
  {
    id: "q-12",
    folderId: "default",
    question: "Name something people always pack for a beach vacation.",
    answers: [
      { text: "Sunscreen / Sunblock", points: 38 },
      { text: "Beach Towels", points: 24 },
      { text: "Swimsuits / Trunks", points: 17 },
      { text: "Sunglasses", points: 10 },
      { text: "Beach Umbrella / Tent", points: 5 },
      { text: "Cooler with drinks / snacks", points: 4 },
      { text: "Flip-flops / Sandals", points: 2 }
    ]
  },
  {
    id: "q-13",
    folderId: "default",
    question: "Name something funny a pet dog does when nobody is looking.",
    answers: [
      { text: "Jumps on the furniture / bed", points: 40 },
      { text: "Steals food off the counter", points: 27 },
      { text: "Chews on shoes or socks", points: 15 },
      { text: "Digs through the trash bin", points: 9 },
      { text: "Barks at imaginary noises", points: 5 },
      { text: "Chases its own tail", points: 4 }
    ]
  },
  {
    id: "q-14",
    folderId: "default",
    question: "Name a superpower people wish they could use in daily life.",
    answers: [
      { text: "Teleportation / Instant travel", points: 41 },
      { text: "Invisibility", points: 23 },
      { text: "Flying", points: 16 },
      { text: "Mind reading", points: 10 },
      { text: "Time travel / Rewind time", points: 6 },
      { text: "Super strength", points: 4 }
    ]
  },
  {
    id: "q-15",
    folderId: "default",
    question: "Name an annoying habit of a coworker in an office.",
    answers: [
      { text: "Talking too loudly on the phone", points: 37 },
      { text: "Microwaving smelly food", points: 24 },
      { text: "Arriving late to meetings", points: 16 },
      { text: "Stealing pens or desk items", points: 11 },
      { text: "Chewing gum noisily", points: 7 },
      { text: "Leaving dirty mugs in the sink", points: 5 }
    ]
  },
  {
    id: "q-16",
    folderId: "default",
    question: "Name something people do when they cannot fall asleep at night.",
    answers: [
      { text: "Scroll on phone / Social media", points: 45 },
      { text: "Read a book", points: 20 },
      { text: "Watch TV / Streaming", points: 15 },
      { text: "Count sheep in head", points: 9 },
      { text: "Drink warm milk or water", points: 6 },
      { text: "Toss and turn in bed", points: 5 }
    ]
  },
  {
    id: "q-17",
    folderId: "default",
    question: "Name something that always seems to disappear in the laundry.",
    answers: [
      { text: "Socks (single sock)", points: 52 },
      { text: "Coins / Loose cash", points: 18 },
      { text: "Hair ties / Bobby pins", points: 12 },
      { text: "Receipts / Notes", points: 8 },
      { text: "Shirt buttons", points: 6 },
      { text: "Lip balm / Chapstick", points: 4 }
    ]
  },
  {
    id: "q-18",
    folderId: "default",
    question: "Name a disaster that can happen while cooking dinner.",
    answers: [
      { text: "Burning / Charring the food", points: 43 },
      { text: "Setting off the smoke alarm", points: 23 },
      { text: "Adding way too much salt or spice", points: 15 },
      { text: "Pot boiling over on stove", points: 9 },
      { text: "Cutting a finger while chopping", points: 6 },
      { text: "Dropping food on the floor", points: 4 }
    ]
  },
  {
    id: "q-19",
    folderId: "default",
    question: "Name something people buy at the grocery store that was not on the list.",
    answers: [
      { text: "Potato chips / Savory snacks", points: 38 },
      { text: "Candy / Chocolate bars", points: 25 },
      { text: "Fresh bakery bread / Pastries", points: 16 },
      { text: "Soda or iced tea", points: 10 },
      { text: "Clearance / Discount items", points: 6 },
      { text: "Ice cream", points: 5 }
    ]
  },
  {
    id: "q-20",
    folderId: "default",
    question: "Name something cozy people love to do on a cold, rainy day.",
    answers: [
      { text: "Watch movies under a warm blanket", points: 44 },
      { text: "Drink hot chocolate, tea, or coffee", points: 24 },
      { text: "Take a long afternoon nap", points: 15 },
      { text: "Read a favorite book", points: 8 },
      { text: "Bake warm cookies or soup", points: 6 },
      { text: "Listen to the rain fall", points: 3 }
    ]
  },
  {
    id: "q-21",
    folderId: "default",
    question: "Name something people do while stuck in bumper-to-bumper traffic.",
    answers: [
      { text: "Sing loudly along to the radio", points: 40 },
      { text: "Listen to a podcast or audiobook", points: 24 },
      { text: "Call a family member or friend", points: 16 },
      { text: "People-watch other drivers", points: 10 },
      { text: "Eat snacks from the glovebox", points: 6 },
      { text: "Check GPS for a faster detour", points: 4 }
    ]
  },
  {
    id: "q-22",
    folderId: "default",
    question: "Name something you keep in your car glove compartment.",
    answers: [
      { text: "Car registration and insurance papers", points: 48 },
      { text: "Napkins or wet wipes", points: 22 },
      { text: "Flashlight", points: 12 },
      { text: "Tire pressure gauge", points: 8 },
      { text: "Sunglasses", points: 6 },
      { text: "Pen and notepad", points: 4 }
    ]
  },
  {
    id: "q-23",
    folderId: "default",
    question: "Name something parents tell their children to do before leaving the house.",
    answers: [
      { text: "Use the bathroom", points: 46 },
      { text: "Put on your shoes", points: 23 },
      { text: "Grab your jacket or coat", points: 14 },
      { text: "Brush your teeth", points: 8 },
      { text: "Double check your backpack", points: 5 },
      { text: "Turn off the bedroom lights", points: 4 }
    ]
  },
  {
    id: "q-24",
    folderId: "default",
    question: "Name something people do when home alone with nobody watching.",
    answers: [
      { text: "Sing at the top of their lungs", points: 39 },
      { text: "Dance silly or crazy", points: 26 },
      { text: "Eat food straight from the container", points: 16 },
      { text: "Walk around in pajamas all day", points: 10 },
      { text: "Talk out loud to themselves", points: 6 },
      { text: "Binge-watch reality TV", points: 3 }
    ]
  },
  {
    id: "q-25",
    folderId: "default",
    question: "Name a reason people check their smartphone every five minutes.",
    answers: [
      { text: "Waiting for an important text message", points: 42 },
      { text: "Checking the time", points: 24 },
      { text: "Boredom / Habit", points: 16 },
      { text: "Checking social media feeds", points: 10 },
      { text: "Work emails", points: 5 },
      { text: "Checking the weather forecast", points: 3 }
    ]
  },
  {
    id: "q-26",
    folderId: "default",
    question: "Name something that can ruin a sunny family picnic.",
    answers: [
      { text: "Sudden rainstorm / Thunder", points: 46 },
      { text: "Swarm of ants, bees, or wasps", points: 24 },
      { text: "Forgot the food, drinks, or utensils", points: 12 },
      { text: "Mosquito bites", points: 8 },
      { text: "Spilling a drink on the blanket", points: 6 },
      { text: "Painful sunburn", points: 4 }
    ]
  },
  {
    id: "q-27",
    folderId: "default",
    question: "Name something you would not want to find under your bed.",
    answers: [
      { text: "Big spider or creepy bug", points: 44 },
      { text: "Imaginary monster", points: 22 },
      { text: "Giant dust bunny", points: 14 },
      { text: "Moldy / rotten food or plate", points: 10 },
      { text: "Stinky dirty laundry", points: 6 },
      { text: "Lost pet hiding", points: 4 }
    ]
  },
  {
    id: "q-28",
    folderId: "default",
    question: "Name something people borrow from friends and always forget to return.",
    answers: [
      { text: "Pens or pencils", points: 41 },
      { text: "Phone charger / Cable", points: 25 },
      { text: "Small amount of cash", points: 15 },
      { text: "Books or novels", points: 9 },
      { text: "Jacket, hoodie, or sweater", points: 6 },
      { text: "Tupperware / Food containers", points: 4 }
    ]
  },
  {
    id: "q-29",
    folderId: "default",
    question: "Name a place where people frequently lose their phone or keys.",
    answers: [
      { text: "Between the couch cushions", points: 45 },
      { text: "In the car / under the car seat", points: 23 },
      { text: "Under the bed or pillows", points: 14 },
      { text: "Inside a coat or jacket pocket", points: 9 },
      { text: "On the kitchen counter", points: 5 },
      { text: "In the bathroom", points: 4 }
    ]
  },
  {
    id: "q-30",
    folderId: "default",
    question: "Name something people do to prepare for a big holiday party.",
    answers: [
      { text: "Clean and vacuum the whole house", points: 42 },
      { text: "Cook and bake dishes / treats", points: 26 },
      { text: "Put up festive decorations", points: 15 },
      { text: "Buy groceries and beverages", points: 9 },
      { text: "Wrap presents and gifts", points: 5 },
      { text: "Pick out a fancy outfit", points: 3 }
    ]
  },
  {
    id: "q-31",
    folderId: "default",
    question: "Name something people pretend to love just to be polite.",
    answers: [
      { text: "In-laws or host's cooking", points: 45 },
      { text: "An ugly or unwanted gift", points: 24 },
      { text: "A long, boring story", points: 14 },
      { text: "Baby or toddler photos", points: 8 },
      { text: "A friend's haircut or outfit", points: 5 },
      { text: "Small talk about the weather", points: 4 }
    ]
  },
  {
    id: "q-32",
    folderId: "default",
    question: "Name something people check multiple times before going to sleep.",
    answers: [
      { text: "Morning alarm is set correctly", points: 46 },
      { text: "Front and back doors are locked", points: 25 },
      { text: "Phone is plugged in and charging", points: 14 },
      { text: "Stove and oven are turned off", points: 7 },
      { text: "Windows are shut tight", points: 5 },
      { text: "Pets or kids are tucked in", points: 3 }
    ]
  }
];

class QuestionManager {
  constructor() {
    this.currentScope = null;
    this.storageKey = 'feud_custom_questions';
    this.foldersStorageKey = 'feud_question_folders';
    this.regenerationSeed = 0;
    this.folders = this.loadFolders();
    this.questions = this.loadQuestions();
  }

  /**
   * Set active storage scope (e.g. 'FSA-POLYU' for exclusive room questions)
   * If scopeId is provided, all reads and writes are isolated to that room's database.
   */
  setScope(scopeId, presetQuestions = null, presetFolders = null) {
    this.currentScope = scopeId ? scopeId.toUpperCase().trim() : null;
    if (this.currentScope) {
      this.storageKey = `feud_custom_questions_${this.currentScope}`;
      this.foldersStorageKey = `feud_question_folders_${this.currentScope}`;
    } else {
      this.storageKey = 'feud_custom_questions';
      this.foldersStorageKey = 'feud_question_folders';
    }
    this.folders = this.loadFolders(presetFolders);
    this.questions = this.loadQuestions(presetQuestions);
  }

  // --- Folder Management ---

  loadFolders(presetFolders = null) {
    try {
      const saved = localStorage.getItem(this.foldersStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.some(f => f.id === 'default')) {
            parsed.unshift({ id: 'default', name: 'Default', icon: '📁', description: 'Standard Game Show Questions' });
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load folders from storage:', e);
    }

    if (presetFolders && Array.isArray(presetFolders) && presetFolders.length > 0) {
      const cloned = JSON.parse(JSON.stringify(presetFolders));
      this.folders = cloned;
      this.saveFolders();
      return cloned;
    }

    return [
      { id: 'default', name: 'Default', icon: '📁', description: 'Standard Game Show Questions' }
    ];
  }

  saveFolders() {
    try {
      localStorage.setItem(this.foldersStorageKey, JSON.stringify(this.folders));
    } catch (e) {
      console.error('Failed to save folders to storage:', e);
    }
  }

  getFolders() {
    return this.folders;
  }

  getFolderById(id) {
    return this.folders.find(f => f.id === id) || this.folders[0];
  }

  createFolder(name, icon = '📁') {
    const trimmed = String(name || '').trim();
    if (!trimmed) throw new Error('Folder name cannot be empty');

    const existing = this.folders.find(f => f.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const newFolder = {
      id: 'fld-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: trimmed,
      icon: icon || '📁'
    };
    this.folders.push(newFolder);
    this.saveFolders();
    return newFolder;
  }

  renameFolder(id, newName) {
    if (id === 'default') throw new Error('Cannot rename the Default folder.');
    const trimmed = String(newName || '').trim();
    if (!trimmed) throw new Error('Folder name cannot be empty');

    const folder = this.folders.find(f => f.id === id);
    if (!folder) throw new Error('Folder not found');

    folder.name = trimmed;
    this.saveFolders();
    return folder;
  }

  deleteFolder(id) {
    if (id === 'default') throw new Error('Cannot delete the Default folder.');
    this.folders = this.folders.filter(f => f.id !== id);
    this.saveFolders();

    // Reassign all questions in that folder to 'default'
    this.questions.forEach(q => {
      if (q.folderId === id) {
        q.folderId = 'default';
      }
    });
    this.saveQuestions();
  }

  // --- Questions Storage & Retrieval ---

  loadQuestions(presetQuestions = null) {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize folderId on all existing questions
          parsed.forEach(q => {
            if (!q.folderId) q.folderId = 'default';
          });

          // Only merge DEFAULT_QUESTIONS if we are in standard scope
          if (!this.currentScope) {
            const existingIds = new Set(parsed.map(q => q.id));
            DEFAULT_QUESTIONS.forEach(defQ => {
              if (!existingIds.has(defQ.id)) {
                parsed.push({ ...defQ, folderId: 'default' });
              }
            });
          }

          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load custom questions from storage:', e);
    }

    // If preset questions are provided for this scope (e.g. FSA-POLYU)
    if (presetQuestions && Array.isArray(presetQuestions) && presetQuestions.length > 0) {
      const cloned = JSON.parse(JSON.stringify(presetQuestions));
      this.questions = cloned;
      this.saveQuestions();
      return cloned;
    }

    return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)).map(q => ({ ...q, folderId: 'default' }));
  }

  saveQuestions() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.questions));
    } catch (e) {
      console.error('Failed to save questions to storage:', e);
    }
  }

  getAll() {
    return this.questions;
  }

  getByFolder(folderId = 'all') {
    if (!folderId || folderId === 'all') return this.questions;
    return this.questions.filter(q => (q.folderId || 'default') === folderId);
  }

  getById(id) {
    return this.questions.find(q => q.id === id);
  }

  moveQuestionToFolder(questionId, targetFolderId) {
    const q = this.getById(questionId);
    if (!q) return false;
    q.folderId = targetFolderId || 'default';
    this.saveQuestions();
    return true;
  }

  /**
   * Add a question object or prompt+answers
   * Supports both qManager.add(questionObj, targetFolder) and qManager.addQuestion(prompt, answers, targetFolder)
   */
  add(questionObj, targetFolderId = 'default') {
    if (!questionObj) return null;
    const sortedAnswers = [...(questionObj.answers || [])]
      .filter(a => a.text && String(a.text).trim().length > 0)
      .sort((a, b) => (parseInt(b.points, 10) || 0) - (parseInt(a.points, 10) || 0));

    const newQ = {
      id: questionObj.id || ('q-' + Date.now() + '-' + Math.floor(Math.random() * 1000)),
      question: String(questionObj.question || '').trim(),
      answers: sortedAnswers,
      folderId: targetFolderId || questionObj.folderId || 'default'
    };

    this.questions.push(newQ);
    this.saveQuestions();
    return newQ;
  }

  addQuestion(questionText, answers, folderId = 'default') {
    return this.add({
      question: questionText,
      answers: answers
    }, folderId);
  }

  updateQuestion(id, questionText, answers, folderId = null) {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) return null;

    const sortedAnswers = [...answers]
      .filter(a => a.text && a.text.trim().length > 0)
      .sort((a, b) => (parseInt(b.points, 10) || 0) - (parseInt(a.points, 10) || 0));

    const currentFolder = this.questions[idx].folderId || 'default';

    this.questions[idx] = {
      id: id,
      question: questionText.trim(),
      answers: sortedAnswers,
      folderId: folderId !== null ? folderId : currentFolder
    };

    this.saveQuestions();
    return this.questions[idx];
  }

  deleteQuestion(id) {
    this.questions = this.questions.filter(q => q.id !== id);
    this.saveQuestions();
  }

  resetToDefaults() {
    if (this.currentScope && typeof window.getSpecialRoomConfig === 'function') {
      const special = window.getSpecialRoomConfig(this.currentScope);
      if (special) {
        this.folders = JSON.parse(JSON.stringify(special.folders || [
          { id: 'default', name: 'Default', icon: '📁', description: 'Standard Game Show Questions' }
        ]));
        this.saveFolders();
        this.questions = JSON.parse(JSON.stringify(special.questions || DEFAULT_QUESTIONS));
        this.saveQuestions();
        return this.questions;
      }
    }
    this.folders = [
      { id: 'default', name: 'Default', icon: '📁', description: 'Standard Game Show Questions' }
    ];
    this.saveFolders();
    this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)).map(q => ({ ...q, folderId: 'default' }));
    this.saveQuestions();
    return this.questions;
  }

  exportToJSON() {
    return JSON.stringify({
      version: 2,
      folders: this.folders,
      questions: this.questions
    }, null, 2);
  }

  importFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      let incomingQuestions = [];
      let incomingFolders = null;

      if (Array.isArray(parsed)) {
        incomingQuestions = parsed;
      } else if (parsed && Array.isArray(parsed.questions)) {
        incomingQuestions = parsed.questions;
        if (Array.isArray(parsed.folders)) {
          incomingFolders = parsed.folders;
        }
      } else {
        throw new Error('Root element must be an array of questions or an object with questions');
      }

      if (incomingFolders) {
        incomingFolders.forEach(f => {
          if (f.id && f.name && !this.folders.some(e => e.id === f.id)) {
            this.folders.push({ id: f.id, name: f.name, icon: f.icon || '📁' });
          }
        });
        this.saveFolders();
      }

      const validated = [];
      incomingQuestions.forEach((item, index) => {
        if (!item.question || !Array.isArray(item.answers)) {
          throw new Error(`Item ${index + 1} is missing question or answers array`);
        }
        const answers = item.answers
          .filter(a => a.text)
          .map(a => ({
            text: String(a.text).trim(),
            points: parseInt(a.points, 10) || 0
          }))
          .sort((a, b) => b.points - a.points);

        validated.push({
          id: item.id || ('q-' + Date.now() + '-' + index),
          question: String(item.question).trim(),
          answers: answers,
          folderId: item.folderId || 'default'
        });
      });

      this.questions = validated;
      this.saveQuestions();
      return { success: true, count: validated.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // --- Spreadsheet Import & Sample Generation (CSV / Excel) ---

  generateSampleCSV() {
    const header = 'Question,Answer 1,Points 1,Answer 2,Points 2,Answer 3,Points 3,Answer 4,Points 4,Answer 5,Points 5,Answer 6,Points 6,Answer 7,Points 7,Answer 8,Points 8\n';
    const sampleRows = [
      '"Name something people always forget to bring when leaving the house","Smartphone",36,"House Keys",26,"Wallet",18,"Umbrella",9,"Earphones",5,"Charger",3,"Glasses",2,"Water bottle",1',
      '"Name a food people love to eat while watching a movie","Popcorn",42,"Potato Chips",22,"Pizza",15,"Candy",10,"Ice Cream",5,"Hot Dog",4,"Fried Chicken",2,""',
      '"Name something you should NEVER do during a job interview","Check phone",38,"Arrive late",27,"Badmouth former boss",16,"Lie on resume",9,"Chew gum",5,"Fall asleep",3,"",""'
    ].join('\n');
    return header + sampleRows;
  }

  downloadSampleTemplate() {
    const csv = this.generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'family_feud_questions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importFromSpreadsheetData(rows, targetFolderId = 'default') {
    try {
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error('Spreadsheet appears to be empty.');
      }

      const importedQuestions = [];
      const firstRow = rows[0].map(c => String(c || '').trim().toLowerCase());
      const isHeader = firstRow.some(c => c.includes('question') || c.includes('answer'));
      const dataRows = isHeader ? rows.slice(1) : rows;

      const isStacked = dataRows.length > 0 && dataRows[0].length <= 3 && 
                        (dataRows[1] && String(dataRows[1][0]).trim() === String(dataRows[0][0]).trim());

      if (isStacked) {
        const questionMap = new Map();
        dataRows.forEach(row => {
          if (!row || row.length < 2) return;
          const qText = String(row[0] || '').trim();
          const aText = String(row[1] || '').trim();
          const pts = parseInt(row[2], 10) || 0;
          if (!qText || !aText) return;

          if (!questionMap.has(qText)) {
            questionMap.set(qText, []);
          }
          questionMap.get(qText).push({ text: aText, points: pts });
        });

        questionMap.forEach((answers, qText) => {
          answers.sort((a, b) => b.points - a.points);
          importedQuestions.push({
            id: 'q-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
            question: qText,
            answers: answers.slice(0, 8),
            folderId: targetFolderId || 'default'
          });
        });
      } else {
        dataRows.forEach((row, rIdx) => {
          if (!row || row.length < 3) return;
          const qText = String(row[0] || '').trim();
          if (!qText) return;

          const answers = [];
          for (let i = 1; i < row.length; i += 2) {
            const aText = String(row[i] || '').trim();
            const pts = parseInt(row[i + 1], 10) || 0;
            if (aText) {
              answers.push({ text: aText, points: pts });
            }
          }

          if (answers.length > 0) {
            answers.sort((a, b) => b.points - a.points);
            importedQuestions.push({
              id: 'q-' + Date.now() + '-' + rIdx,
              question: qText,
              answers: answers.slice(0, 8),
              folderId: targetFolderId || 'default'
            });
          }
        });
      }

      if (importedQuestions.length === 0) {
        throw new Error('No valid questions found in file.');
      }

      this.questions = [...importedQuestions, ...this.questions.filter(q => !importedQuestions.some(iq => iq.question === q.question))];
      this.saveQuestions();
      return { success: true, count: importedQuestions.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  parseCSV(text) {
    const lines = [];
    let row = [''];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++;
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }
    return lines;
  }

  // ==========================================
  // AI QUESTION GENERATOR WITH PG GUARDRAILS
  // Supports Gemini API + Extensive Smart PG Procedural AI Engine
  // ==========================================

  async generateQuestionWithAI(topicPrompt, apiKey = '') {
    const rawPrompt = String(topicPrompt || '').trim();
    if (!rawPrompt) {
      throw new Error('Please enter a topic prompt (e.g. "Beach vacation essentials", "Excuses for being late").');
    }

    // 1. Strict PG Content & Safety Guardrails
    const nonPgPattern = /\b(sex|nude|naked|porn|drug|cocaine|weed|alcohol|beer|whiskey|drunk|kill|murder|gun|weapon|swear|damn|hell|ass|bitch|shit|fuck|terror|violence|hate)\b/i;
    if (nonPgPattern.test(rawPrompt)) {
      throw new Error('🛡️ PG Guardrail Alert: Prompt contains sensitive or inappropriate terms. All questions must be strictly family-friendly and suitable for all ages.');
    }

    // 2. If Gemini API Key is provided, call Google Gemini Interactions API
    if (apiKey && apiKey.trim().length > 15) {
      const cleanKey = apiKey.trim();
      const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

      for (const model of models) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
          const systemInstruction = `You are an official television game show question writer for Family Feud.
All questions and answers MUST be strictly PG-rated, family-friendly, wholesome, clean, and fun for all ages.
Never output sexual, violent, offensive, crude, derogatory, political, or mature themes.
Based on the user's topic prompt, generate 1 creative survey question and 5 to 8 ranked survey answers.
Assign realistic survey points (e.g. #1 answer has ~35-45 points, following answers taper down, total sum is approx 100 points).
Respond with valid raw JSON only (no markdown, no backticks, no extra text) formatted exactly as:
{
  "question": "Name something...",
  "answers": [
    {"text": "Answer 1", "points": 38},
    {"text": "Answer 2", "points": 25},
    {"text": "Answer 3", "points": 18},
    {"text": "Answer 4", "points": 11},
    {"text": "Answer 5", "points": 8}
  ]
}`;

          const reqBody = {
            contents: [
              {
                role: 'user',
                parts: [{ text: `Topic prompt: "${rawPrompt}". Generate 1 family-friendly survey question with 5 to 8 ranked answers summing to approx 100 points.` }]
              }
            ],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.75, maxOutputTokens: 600 }
          };

          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
          });

          if (resp.ok) {
            const data = await resp.json();
            const candidate = data.candidates && data.candidates[0];
            if (candidate && candidate.content && candidate.content.parts) {
              let rawText = candidate.content.parts[0].text || '';
              rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(rawText);

              if (parsed.question && Array.isArray(parsed.answers) && parsed.answers.length >= 4) {
                if (nonPgPattern.test(parsed.question) || parsed.answers.some(a => nonPgPattern.test(a.text))) {
                  throw new Error('🛡️ Output safety violation: Generated content did not pass PG verification.');
                }

                return {
                  success: true,
                  source: `Gemini AI (${model})`,
                  question: {
                    id: 'ai-' + Date.now(),
                    folderId: 'default',
                    question: parsed.question,
                    answers: parsed.answers.map(a => ({
                      text: String(a.text).trim(),
                      points: parseInt(a.points, 10) || 5
                    })).slice(0, 8)
                  }
                };
              }
            }
          }
        } catch (e) {
          console.warn(`Gemini ${model} attempt failed:`, e);
        }
      }
    }

    // 3. Smart Built-In PG Procedural AI Engine (Instant, 100% Free, Rich Variations)
    return this.generateProceduralQuestion(rawPrompt);
  }

  generateProceduralQuestion(prompt) {
    this.regenerationSeed++;
    const p = prompt.toLowerCase();

    // Extensive PG Knowledge Base with Multiple Distinct Question Variants per Category
    const categories = [
      {
        match: ['beach', 'vacation', 'summer', 'ocean', 'sea', 'sand', 'resort', 'swim', 'tropical', 'island'],
        variants: [
          {
            question: "Name something people always pack for a beach vacation.",
            answers: [
              { text: "Sunscreen / Sunblock", points: 38 },
              { text: "Beach Towels", points: 24 },
              { text: "Swimsuits / Trunks", points: 17 },
              { text: "Sunglasses", points: 10 },
              { text: "Umbrella / Sun Shade", points: 6 },
              { text: "Cooler with cold drinks", points: 3 },
              { text: "Flip-flops / Sandals", points: 2 }
            ]
          },
          {
            question: "Name something that can ruin a fun day at the beach.",
            answers: [
              { text: "Sudden thunderstorm / Rain", points: 42 },
              { text: "Painful sunburn", points: 26 },
              { text: "Jellyfish sting or shark scare", points: 14 },
              { text: "Sand getting everywhere in food", points: 9 },
              { text: "Freezing cold water", points: 5 },
              { text: "Lost car keys or phone in the sand", points: 4 }
            ]
          },
          {
            question: "Name a favorite activity people do when visiting a tropical beach.",
            answers: [
              { text: "Swimming in the ocean", points: 41 },
              { text: "Sunbathing / Tanning", points: 25 },
              { text: "Building sandcastles", points: 16 },
              { text: "Collecting seashells", points: 9 },
              { text: "Playing beach volleyball", points: 5 },
              { text: "Reading a book under an umbrella", points: 4 }
            ]
          }
        ]
      },
      {
        match: ['food', 'restaurant', 'dinner', 'lunch', 'eat', 'chef', 'meal', 'fast food', 'buffet', 'diet'],
        variants: [
          {
            question: "Name a food people always go back for seconds at an all-you-can-eat buffet.",
            answers: [
              { text: "Roast Beef / Carving station", points: 39 },
              { text: "Shrimp / Seafood", points: 27 },
              { text: "Fried Chicken", points: 15 },
              { text: "Dessert / Soft serve ice cream", points: 10 },
              { text: "Pizza or Mac and Cheese", points: 5 },
              { text: "Mashed potatoes and gravy", points: 4 }
            ]
          },
          {
            question: "Name a classic complaint diners make at a restaurant.",
            answers: [
              { text: "Food took too long to arrive", points: 43 },
              { text: "Meal was cold / undercooked", points: 25 },
              { text: "Rude or inattentive server", points: 14 },
              { text: "Overpriced bill", points: 9 },
              { text: "Wrong order was brought out", points: 5 },
              { text: "Noisy or dirty table", points: 4 }
            ]
          },
          {
            question: "Name a fast food item people crave when they are starving.",
            answers: [
              { text: "Cheeseburger", points: 42 },
              { text: "French Fries", points: 26 },
              { text: "Pizza", points: 16 },
              { text: "Crispy Fried Chicken Nuggets", points: 9 },
              { text: "Milkshake", points: 4 },
              { text: "Tacos or Burritos", points: 3 }
            ]
          }
        ]
      },
      {
        match: ['sleep', 'bed', 'night', 'insomnia', 'awake', 'tired', 'dream', 'pillow', 'snooze', 'alarm'],
        variants: [
          {
            question: "Name something people do when they cannot fall asleep at night.",
            answers: [
              { text: "Scroll on phone / Social media", points: 45 },
              { text: "Read a book", points: 20 },
              { text: "Watch TV / Streaming", points: 15 },
              { text: "Count sheep in head", points: 9 },
              { text: "Drink warm milk or water", points: 6 },
              { text: "Toss and turn in bed", points: 5 }
            ]
          },
          {
            question: "Name something people check multiple times before turning off the lights to sleep.",
            answers: [
              { text: "Morning alarm is set", points: 48 },
              { text: "Front door is locked", points: 24 },
              { text: "Phone is plugged into charger", points: 13 },
              { text: "Stove and oven are off", points: 8 },
              { text: "Windows are latched shut", points: 4 },
              { text: "Pets are inside and accounted for", points: 3 }
            ]
          }
        ]
      },
      {
        match: ['work', 'boss', 'office', 'job', 'coworker', 'meeting', 'zoom', 'career', 'desk'],
        variants: [
          {
            question: "Name an annoying habit of a coworker in an office.",
            answers: [
              { text: "Talking too loudly on the phone", points: 37 },
              { text: "Microwaving smelly food", points: 24 },
              { text: "Arriving late to meetings", points: 16 },
              { text: "Stealing pens or desk supplies", points: 11 },
              { text: "Chewing gum noisily", points: 7 },
              { text: "Leaving dirty mugs in the sink", points: 5 }
            ]
          },
          {
            question: "Name an excuse an employee gives to sneak out of work early on a Friday.",
            answers: [
              { text: "Doctor or dentist appointment", points: 44 },
              { text: "Feeling sick with a sudden migraine", points: 24 },
              { text: "Kids' school performance or emergency", points: 15 },
              { text: "Plumber or contractor coming to house", points: 9 },
              { text: "Car making strange noises", points: 5 },
              { text: "Beating heavy highway traffic", points: 3 }
            ]
          }
        ]
      },
      {
        match: ['school', 'teacher', 'student', 'class', 'homework', 'exam', 'college', 'grade'],
        variants: [
          {
            question: "Name a classic excuse a student gives for not doing their homework.",
            answers: [
              { text: "The dog ate it", points: 40 },
              { text: "Forgot it at home", points: 26 },
              { text: "Computer or printer broke", points: 16 },
              { text: "Was sick / Had a headache", points: 10 },
              { text: "Thought it was due tomorrow", points: 5 },
              { text: "Lost the worksheet", points: 3 }
            ]
          },
          {
            question: "Name something a student dreads hearing their teacher say.",
            answers: [
              { text: "Pop quiz today!", points: 46 },
              { text: "Put everything away, clear your desks", points: 23 },
              { text: "I need to speak with your parents", points: 14 },
              { text: "You will have homework over the weekend", points: 9 },
              { text: "I'm picking your group partners", points: 5 },
              { text: "Stay after class", points: 3 }
            ]
          }
        ]
      },
      {
        match: ['pet', 'dog', 'cat', 'animal', 'puppy', 'kitten', 'vet'],
        variants: [
          {
            question: "Name something funny a pet dog does when nobody is looking.",
            answers: [
              { text: "Jumps on the furniture / bed", points: 40 },
              { text: "Steals food off the counter", points: 27 },
              { text: "Chews on shoes or socks", points: 15 },
              { text: "Digs through the trash bin", points: 9 },
              { text: "Barks at imaginary noises", points: 5 },
              { text: "Chases its own tail", points: 4 }
            ]
          },
          {
            question: "Name a trick owners proudly teach their pet dog.",
            answers: [
              { text: "Sit", points: 43 },
              { text: "Shake paws / High five", points: 24 },
              { text: "Roll over", points: 15 },
              { text: "Fetch a ball or stick", points: 9 },
              { text: "Play dead", points: 5 },
              { text: "Speak / Bark on command", points: 4 }
            ]
          }
        ]
      },
      {
        match: ['superhero', 'hero', 'power', 'comic', 'batman', 'marvel', 'avengers', 'villain'],
        variants: [
          {
            question: "Name a superpower people wish they could use in everyday life.",
            answers: [
              { text: "Teleportation / Instant travel", points: 41 },
              { text: "Invisibility", points: 23 },
              { text: "Flying", points: 16 },
              { text: "Mind reading", points: 10 },
              { text: "Time travel / Rewind time", points: 6 },
              { text: "Super strength", points: 4 }
            ]
          },
          {
            question: "Name an iconic superhero accessory or tool.",
            answers: [
              { text: "Cape", points: 42 },
              { text: "Mask", points: 25 },
              { text: "Utility Belt", points: 14 },
              { text: "Shield", points: 9 },
              { text: "Boots", points: 6 },
              { text: "Batmobile / Super vehicle", points: 4 }
            ]
          }
        ]
      },
      {
        match: ['rain', 'rainy', 'storm', 'cold', 'winter', 'snow', 'weather', 'hot', 'summer'],
        variants: [
          {
            question: "Name something cozy people love to do on a cold, rainy day.",
            answers: [
              { text: "Watch movies under a warm blanket", points: 44 },
              { text: "Drink hot chocolate, tea, or coffee", points: 24 },
              { text: "Take a long afternoon nap", points: 15 },
              { text: "Read a favorite book", points: 8 },
              { text: "Bake warm cookies or soup", points: 6 },
              { text: "Listen to the rain fall", points: 3 }
            ]
          },
          {
            question: "Name something people complain about during a blistering summer heatwave.",
            answers: [
              { text: "Air conditioner breaking down", points: 45 },
              { text: "Sweating through your clothes", points: 25 },
              { text: "Car seats burning hot to touch", points: 14 },
              { text: "Can't sleep at night", points: 8 },
              { text: "High electricity bills", points: 5 },
              { text: "Bug and mosquito bites", points: 3 }
            ]
          }
        ]
      },
      {
        match: ['car', 'drive', 'traffic', 'highway', 'road trip', 'commute', 'vehicle'],
        variants: [
          {
            question: "Name something people do while stuck in bumper-to-bumper traffic.",
            answers: [
              { text: "Sing loudly along to the radio", points: 40 },
              { text: "Listen to a podcast or audiobook", points: 24 },
              { text: "Call a family member or friend", points: 16 },
              { text: "People-watch other drivers", points: 10 },
              { text: "Eat snacks from the glovebox", points: 6 },
              { text: "Check GPS for a faster detour", points: 4 }
            ]
          },
          {
            question: "Name something you should always bring on a long road trip.",
            answers: [
              { text: "Snacks and bottled water", points: 41 },
              { text: "Phone charger / Car adapter", points: 26 },
              { text: "Good music playlist or audiobooks", points: 15 },
              { text: "GPS navigation device", points: 9 },
              { text: "First aid kit & flashlight", points: 5 },
              { text: "Pillow and warm blanket", points: 4 }
            ]
          }
        ]
      },
      {
        match: ['shopping', 'mall', 'store', 'supermarket', 'grocery', 'clothes', 'buy'],
        variants: [
          {
            question: "Name something people buy at the grocery store that wasn't on the list.",
            answers: [
              { text: "Potato chips / Savory snacks", points: 38 },
              { text: "Candy / Chocolate bars", points: 25 },
              { text: "Fresh bakery bread / Pastries", points: 16 },
              { text: "Soda or iced tea", points: 10 },
              { text: "Clearance / Discount items", points: 6 },
              { text: "Ice cream", points: 5 }
            ]
          },
          {
            question: "Name an item shoppers frequently return to a clothing store.",
            answers: [
              { text: "Wrong size pants / jeans", points: 45 },
              { text: "Shoes that pinch your feet", points: 24 },
              { text: "Gift someone else disliked", points: 14 },
              { text: "Item with a tear or broken zipper", points: 9 },
              { text: "Buyer's remorse on expensive dress", points: 5 },
              { text: "Color looked different at home", points: 3 }
            ]
          }
        ]
      },
      {
        match: ['gym', 'fitness', 'exercise', 'workout', 'running', 'sport', 'weights'],
        variants: [
          {
            question: "Name something you dread doing at the gym.",
            answers: [
              { text: "Leg day / Heavy squats", points: 40 },
              { text: "Burpees", points: 22 },
              { text: "Running on treadmill", points: 16 },
              { text: "Planks", points: 10 },
              { text: "Waiting for machines to free up", points: 6 },
              { text: "Stretching at the end", points: 4 },
              { text: "Cleaning sweaty equipment", points: 2 }
            ]
          },
          {
            question: "Name an excuse people make to skip their daily workout.",
            answers: [
              { text: "Too tired / Exhausted from work", points: 46 },
              { text: "Muscle soreness from yesterday", points: 23 },
              { text: "No time / Schedule is too busy", points: 14 },
              { text: "It's raining outside", points: 8 },
              { text: "Forgot workout clothes", points: 5 },
              { text: "I'll go twice tomorrow instead", points: 4 }
            ]
          }
        ]
      },
      {
        match: ['holiday', 'christmas', 'party', 'celebrate', 'halloween', 'birthday', 'thanksgiving'],
        variants: [
          {
            question: "Name something people do to prepare for a big holiday party.",
            answers: [
              { text: "Clean and vacuum the whole house", points: 42 },
              { text: "Cook and bake dishes / treats", points: 26 },
              { text: "Put up festive decorations", points: 15 },
              { text: "Buy groceries and beverages", points: 9 },
              { text: "Wrap presents and gifts", points: 5 },
              { text: "Pick out a fancy outfit", points: 3 }
            ]
          },
          {
            question: "Name an unwanted gift people pretend to love during the holidays.",
            answers: [
              { text: "Ugly knitted sweater", points: 44 },
              { text: "Pair of plain socks", points: 24 },
              { text: "Fruitcake", points: 14 },
              { text: "Cheap scented candle", points: 9 },
              { text: "Novelty coffee mug", points: 5 },
              { text: "Calendar for the wrong year", points: 4 }
            ]
          }
        ]
      },
      {
        match: ['camping', 'camp', 'woods', 'forest', 'tent', 'hike', 'hiking', 'outdoor', 'campfire'],
        variants: [
          {
            question: "Name something essential you should never forget when camping in the woods.",
            answers: [
              { text: "Tent and ground stakes", points: 38 },
              { text: "Warm sleeping bag", points: 25 },
              { text: "Bug spray / Insect repellent", points: 16 },
              { text: "Flashlight / Lantern", points: 10 },
              { text: "Matches / Lighter for campfire", points: 6 },
              { text: "Marshmallows and graham crackers", points: 5 }
            ]
          },
          {
            question: "Name a wild animal you would be terrified to see near your tent at night.",
            answers: [
              { text: "Bear", points: 50 },
              { text: "Wolf / Coyote", points: 22 },
              { text: "Skunk", points: 12 },
              { text: "Venomous Snake", points: 8 },
              { text: "Raccoon", points: 5 },
              { text: "Mountain lion / Cougar", points: 3 }
            ]
          }
        ]
      },
      {
        match: ['doctor', 'dentist', 'teeth', 'tooth', 'hospital', 'nurse', 'medicine', 'sick'],
        variants: [
          {
            question: "Name something people dread most about a visit to the dentist.",
            answers: [
              { text: "The sound of the drill", points: 42 },
              { text: "Needle numbing shots", points: 25 },
              { text: "Finding out you have cavities", points: 14 },
              { text: "Being lectured about not flossing", points: 9 },
              { text: "The expensive bill", points: 6 },
              { text: "Cardboard taste of bite-wing X-rays", points: 4 }
            ]
          },
          {
            question: "Name a white lie patients often tell their doctor.",
            answers: [
              { text: "I exercise three times a week", points: 43 },
              { text: "I eat a healthy, balanced diet", points: 24 },
              { text: "I took all the prescribed medicine", points: 15 },
              { text: "My pain level is only a 2 out of 10", points: 9 },
              { text: "I get eight full hours of sleep", points: 5 },
              { text: "I don't eat late at night", points: 4 }
            ]
          }
        ]
      },
      {
        match: ['music', 'concert', 'sing', 'band', 'song', 'guitar', 'instrument'],
        variants: [
          {
            question: "Name something people bring with them when attending an outdoor concert.",
            answers: [
              { text: "Concert tickets / Wristband", points: 39 },
              { text: "Smartphone to record videos", points: 26 },
              { text: "Lawn chairs or blanket", points: 15 },
              { text: "Bottled water or drink", points: 9 },
              { text: "Earplugs for loud speakers", points: 6 },
              { text: "Band merchandise / T-shirt", points: 5 }
            ]
          },
          {
            question: "Name an instrument parents secretly regret letting their kid learn to play.",
            answers: [
              { text: "Drums / Drum kit", points: 54 },
              { text: "Trumpet / Horn", points: 18 },
              { text: "Violin (beginner squeaks)", points: 12 },
              { text: "Recorder flute", points: 8 },
              { text: "Electric guitar with amp", points: 5 },
              { text: "Bagpipes", points: 3 }
            ]
          }
        ]
      }
    ];

    // Find best matching curated category
    for (const cat of categories) {
      if (cat.match.some(m => p.includes(m))) {
        // Rotate through variants based on seed so user gets DIFFERENT questions on regenerate
        const variantIndex = (this.regenerationSeed + Math.floor(Math.random() * cat.variants.length)) % cat.variants.length;
        const chosen = cat.variants[variantIndex];

        return {
          success: true,
          source: 'Smart AI Engine (Curated PG)',
          question: {
            id: 'ai-' + Date.now(),
            folderId: 'default',
            question: chosen.question,
            answers: chosen.answers
          }
        };
      }
    }

    // Dynamic Contextual PG Synthesizer for ANY Custom Topic
    const cleanTopic = prompt.replace(/[^\w\s-]/g, '').trim();
    const formattedTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
    const seed = this.regenerationSeed % 3;

    if (seed === 0) {
      return {
        success: true,
        source: 'Smart AI Engine (Contextual)',
        question: {
          id: 'ai-' + Date.now(),
          folderId: 'default',
          question: `Name something people always look forward to when experiencing "${formattedTopic}".`,
          answers: [
            { text: `Spending quality time with family / friends`, points: 41 },
            { text: `Taking memorable photos and videos`, points: 24 },
            { text: `Enjoying delicious food and treats`, points: 16 },
            { text: `Taking a break from daily work stress`, points: 10 },
            { text: `Trying something new and exciting`, points: 6 },
            { text: `Buying special souvenirs / gifts`, points: 3 }
          ]
        }
      };
    } else if (seed === 1) {
      return {
        success: true,
        source: 'Smart AI Engine (Contextual)',
        question: {
          id: 'ai-' + Date.now(),
          folderId: 'default',
          question: `Name something essential people need to prepare in advance for "${formattedTopic}".`,
          answers: [
            { text: `Packing the right clothes and gear`, points: 39 },
            { text: `Checking tickets, reservations, or passes`, points: 26 },
            { text: `Checking the weather forecast`, points: 16 },
            { text: `Setting a realistic budget or savings`, points: 10 },
            { text: `Coordinating meeting times with everyone`, points: 6 },
            { text: `Bringing extra snacks and water bottles`, points: 3 }
          ]
        }
      };
    } else {
      return {
        success: true,
        source: 'Smart AI Engine (Contextual)',
        question: {
          id: 'ai-' + Date.now(),
          folderId: 'default',
          question: `Name something unexpected that could go wrong during "${formattedTopic}".`,
          answers: [
            { text: `Running into bad weather or rain`, points: 42 },
            { text: `Forgetting an important item at home`, points: 25 },
            { text: `Getting stuck in heavy traffic delays`, points: 15 },
            { text: `Someone getting sick or feeling unwell`, points: 9 },
            { text: `Phone battery dying with no charger`, points: 5 },
            { text: `Losing car keys or wallet in the crowd`, points: 4 }
          ]
        }
      };
    }
  }
}

window.questionManager = new QuestionManager();
