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
}

window.questionManager = new QuestionManager();
