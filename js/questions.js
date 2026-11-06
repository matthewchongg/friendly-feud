/**
 * Family Feud Questions Bank & Management
 * Supports custom question creation, CSV & Excel (.xlsx) spreadsheet uploads,
 * JSON import/export, and downloadable sample templates.
 */

const DEFAULT_QUESTIONS = [
  {
    id: "q-1",
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
    question: "Name something people complain about at airports.",
    answers: [
      { text: "Flight delays / Cancellations", points: 44 },
      { text: "Long security lines", points: 26 },
      { text: "Overpriced food and drinks", points: 14 },
      { text: "Lost or damaged luggage", points: 8 },
      { text: "Crowded gates / No seating", points: 5 },
      { text: "Slow baggage claim", points: 3 }
    ]
  }
];

class QuestionManager {
  constructor() {
    this.storageKey = 'feud_custom_questions';
    this.questions = this.loadQuestions();
  }

  loadQuestions() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load custom questions from storage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
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

  getById(id) {
    return this.questions.find(q => q.id === id);
  }

  addQuestion(questionText, answers) {
    const sortedAnswers = [...answers]
      .filter(a => a.text && a.text.trim().length > 0)
      .sort((a, b) => (parseInt(b.points, 10) || 0) - (parseInt(a.points, 10) || 0));

    const newQ = {
      id: 'q-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      question: questionText.trim(),
      answers: sortedAnswers
    };

    this.questions.push(newQ);
    this.saveQuestions();
    return newQ;
  }

  updateQuestion(id, questionText, answers) {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) return null;

    const sortedAnswers = [...answers]
      .filter(a => a.text && a.text.trim().length > 0)
      .sort((a, b) => (parseInt(b.points, 10) || 0) - (parseInt(a.points, 10) || 0));

    this.questions[idx] = {
      id: id,
      question: questionText.trim(),
      answers: sortedAnswers
    };

    this.saveQuestions();
    return this.questions[idx];
  }

  deleteQuestion(id) {
    this.questions = this.questions.filter(q => q.id !== id);
    this.saveQuestions();
  }

  resetToDefaults() {
    this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    this.saveQuestions();
    return this.questions;
  }

  exportToJSON() {
    return JSON.stringify(this.questions, null, 2);
  }

  importFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Root element must be an array of questions');
      
      const validated = [];
      parsed.forEach((item, index) => {
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
          answers: answers
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

  /**
   * Generates a downloadable CSV sample spreadsheet template
   */
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

  /**
   * Parses CSV text or 2D array from Excel
   */
  importFromSpreadsheetData(rows) {
    try {
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error('Spreadsheet appears to be empty.');
      }

      const importedQuestions = [];

      // Determine if format is:
      // Format 1 (Wide row): Question, Ans1, Pts1, Ans2, Pts2...
      // Format 2 (Stacked row): Question, Answer, Points
      const firstRow = rows[0].map(c => String(c || '').trim().toLowerCase());
      const isHeader = firstRow.some(c => c.includes('question') || c.includes('answer'));
      const dataRows = isHeader ? rows.slice(1) : rows;

      // Check if Stacked format (3 columns: Question, Answer, Points)
      const isStacked = dataRows.length > 0 && dataRows[0].length <= 3 && 
                        (dataRows[1] && String(dataRows[1][0]).trim() === String(dataRows[0][0]).trim());

      if (isStacked) {
        // Group by question
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
            answers: answers.slice(0, 8)
          });
        });
      } else {
        // Standard Wide Format: Question, Ans1, Pts1, Ans2, Pts2, ...
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
              answers: answers.slice(0, 8)
            });
          }
        });
      }

      if (importedQuestions.length === 0) {
        throw new Error('No valid questions found in file. Please ensure columns follow: Question, Answer 1, Points 1, Answer 2, Points 2, ...');
      }

      // Append or replace
      this.questions = [...importedQuestions, ...this.questions.filter(q => !importedQuestions.some(iq => iq.question === q.question))];
      this.saveQuestions();
      return { success: true, count: importedQuestions.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Robust CSV Parser handles quotes, commas and linebreaks
   */
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

  /**
   * AI Question Generator with Strict PG Guardrails
   * Supports Google Gemini API (if key provided) + Smart Built-in PG Procedural Engine
   */
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
      try {
        const cleanKey = apiKey.trim();
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`;
        
        const systemInstruction = `You are an official television game show question writer for Family Feud.
All questions and answers MUST be strictly PG-rated, family-friendly, wholesome, clean, and fun for all ages.
Never output sexual, violent, offensive, crude, derogatory, political, or mature themes.
Based on the user's topic prompt, generate 1 creative survey question and 4 to 8 ranked survey answers.
Assign realistic survey points (e.g. #1 answer has ~30-45 points, following answers taper down, total sum is approx 100 points).
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
              parts: [{ text: `Topic prompt: "${rawPrompt}". Generate 1 family-friendly survey question with 4 to 8 ranked answers summing to approx 100 points.` }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" }
          ]
        };

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody)
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          console.warn('Gemini API call failed, falling back to smart procedural generator:', errData);
          return this.generateProceduralQuestion(rawPrompt);
        }

        const data = await resp.json();
        const candidate = data.candidates && data.candidates[0];
        if (!candidate || !candidate.content || !candidate.content.parts) {
          return this.generateProceduralQuestion(rawPrompt);
        }

        let rawText = candidate.content.parts[0].text || '';
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(rawText);
        if (!parsed.question || !Array.isArray(parsed.answers) || parsed.answers.length === 0) {
          return this.generateProceduralQuestion(rawPrompt);
        }

        // Validate PG content on output as well
        if (nonPgPattern.test(parsed.question) || parsed.answers.some(a => nonPgPattern.test(a.text))) {
          throw new Error('🛡️ Output safety violation: Generated content did not pass PG verification.');
        }

        return {
          success: true,
          source: 'Gemini AI Live',
          question: {
            id: 'ai-' + Date.now(),
            question: parsed.question,
            answers: parsed.answers.map(a => ({
              text: String(a.text).trim(),
              points: parseInt(a.points, 10) || 5
            })).slice(0, 8)
          }
        };
      } catch (e) {
        console.warn('Gemini error, using Smart Procedural Engine:', e);
        return this.generateProceduralQuestion(rawPrompt);
      }
    }

    // 3. Smart Built-In PG Procedural Engine (Instant & 100% Free)
    return this.generateProceduralQuestion(rawPrompt);
  }

  generateProceduralQuestion(prompt) {
    const p = prompt.toLowerCase();
    
    // Curated PG Knowledge Banks
    const banks = [
      {
        match: ['beach', 'vacation', 'summer', 'holiday', 'trip', 'island', 'travel'],
        question: `Name something people always pack when going to the beach.`,
        answers: [
          { text: "Sunscreen / Sunblock", points: 36 },
          { text: "Beach Towel", points: 26 },
          { text: "Swimsuit / Trunks", points: 16 },
          { text: "Sunglasses", points: 11 },
          { text: "Umbrella / Sun Shade", points: 5 },
          { text: "Snacks / Water Cooler", points: 4 },
          { text: "Flip-flops / Sandals", points: 2 }
        ]
      },
      {
        match: ['sleep', 'bed', 'night', 'insomnia', 'awake', 'tired', 'dream'],
        question: `Name something people do when they can't fall asleep at night.`,
        answers: [
          { text: "Scroll on phone / Social media", points: 44 },
          { text: "Read a book", points: 21 },
          { text: "Watch TV / Streaming", points: 15 },
          { text: "Count sheep in head", points: 9 },
          { text: "Drink warm milk or water", points: 6 },
          { text: "Toss and turn in bed", points: 5 }
        ]
      },
      {
        match: ['kitchen', 'cooking', 'food', 'chef', 'baking', 'cook', 'recipe', 'meal'],
        question: `Name a common disaster that can happen while cooking dinner.`,
        answers: [
          { text: "Burning / Charring the food", points: 41 },
          { text: "Setting off the smoke alarm", points: 24 },
          { text: "Adding way too much salt or spice", points: 15 },
          { text: "Pot boiling over on stove", points: 10 },
          { text: "Cutting a finger while chopping", points: 6 },
          { text: "Dropping food on the floor", points: 4 }
        ]
      },
      {
        match: ['work', 'boss', 'office', 'job', 'coworker', 'meeting', 'zoom'],
        question: `Name an annoying habit of a coworker in an office.`,
        answers: [
          { text: "Talking too loudly on the phone", points: 38 },
          { text: "Microwaving smelly food", points: 25 },
          { text: "Arriving late to meetings", points: 17 },
          { text: "Stealing pens or desk items", points: 9 },
          { text: "Chewing gum noisily", points: 7 },
          { text: "Leaving dirty mugs in the sink", points: 4 }
        ]
      },
      {
        match: ['pet', 'dog', 'cat', 'animal', 'puppy', 'kitten'],
        question: `Name something funny or naughty a pet dog does when nobody is watching.`,
        answers: [
          { text: "Jumps on furniture / Bed", points: 39 },
          { text: "Steals food off the counter", points: 28 },
          { text: "Chews on shoes or socks", points: 16 },
          { text: "Digs through the trash bin", points: 9 },
          { text: "Barks at imaginary ghosts", points: 5 },
          { text: "Chases its own tail", points: 3 }
        ]
      },
      {
        match: ['school', 'teacher', 'student', 'class', 'homework', 'exam'],
        question: `Name a classic excuse a student gives for not doing their homework.`,
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
        match: ['superhero', 'hero', 'power', 'comic', 'batman', 'marvel'],
        question: `Name a superpower people wish they could use in daily everyday life.`,
        answers: [
          { text: "Teleportation / Instant travel", points: 42 },
          { text: "Invisibility", points: 24 },
          { text: "Flying", points: 16 },
          { text: "Mind reading", points: 10 },
          { text: "Time travel / Rewind time", points: 5 },
          { text: "Super strength", points: 3 }
        ]
      },
      {
        match: ['rain', 'rainy', 'storm', 'weather', 'cold', 'winter'],
        question: `Name something cozy people love to do on a cold, rainy day.`,
        answers: [
          { text: "Watch movies under a blanket", points: 43 },
          { text: "Drink hot chocolate / Coffee / Tea", points: 26 },
          { text: "Take a long afternoon nap", points: 16 },
          { text: "Read a favorite novel", points: 8 },
          { text: "Bake fresh cookies or soup", points: 5 },
          { text: "Listen to the rain fall", points: 2 }
        ]
      },
      {
        match: ['road', 'car', 'drive', 'traffic', 'highway'],
        question: `Name something people do to pass the time while stuck in bumper-to-bumper traffic.`,
        answers: [
          { text: "Sing loudly to the radio", points: 41 },
          { text: "Listen to a podcast or audiobook", points: 25 },
          { text: "Call a family member or friend", points: 16 },
          { text: "People-watch other drivers", points: 9 },
          { text: "Snack on car treats", points: 6 },
          { text: "Check GPS for faster detour", points: 3 }
        ]
      },
      {
        match: ['shopping', 'mall', 'store', 'supermarket', 'grocery'],
        question: `Name something people always end up buying at the store even though it wasn't on the list.`,
        answers: [
          { text: "Candy / Chocolate bar", points: 37 },
          { text: "Chips / Snacks", points: 27 },
          { text: "Bakery pastries / Fresh bread", points: 16 },
          { text: "Soda or iced drink", points: 10 },
          { text: "Items on clearance / sale", points: 6 },
          { text: "Magazines at checkout", points: 4 }
        ]
      }
    ];

    // Find best matching curated bank
    for (const b of banks) {
      if (b.match.some(m => p.includes(m))) {
        return {
          success: true,
          source: 'Smart AI Engine (Curated PG)',
          question: {
            id: 'ai-' + Date.now(),
            question: b.question,
            answers: b.answers
          }
        };
      }
    }

    // Dynamic contextual PG generator for any custom topic
    const cleanTopic = prompt.replace(/[^\w\s-]/g, '').trim();
    const formattedTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
    
    return {
      success: true,
      source: 'Smart AI Engine (Contextual)',
      question: {
        id: 'ai-' + Date.now(),
        question: `Name something people associate most with "${formattedTopic}".`,
        answers: [
          { text: `Popular ${formattedTopic} trends / traditions`, points: 38 },
          { text: `Memories from childhood / family`, points: 24 },
          { text: `Having fun with close friends`, points: 18 },
          { text: `Planning and preparing in advance`, points: 11 },
          { text: `Sharing photos on social media`, points: 6 },
          { text: `Relaxing and having a good time`, points: 3 }
        ]
      }
    };
  }
}

window.questionManager = new QuestionManager();
