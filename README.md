# ★ Family Feud - Live Interactive Game Show Platform ★

A modern, full-featured **Family Feud** interactive game show web application designed to be **100% statically hosted on GitHub Pages**. Featuring unlimited mobile player buzzers, spreadsheet question uploads (Excel & CSV), custom team names, customizable round counts (1 to 15 rounds), 3D flip card animations, 20s/15s countdown timers, Web Audio synthesizer sound effects, and an Admin supervisor screen.

---

## 🌟 Key Features

### 📺 1. Big Screen Game Board (`board.html`)
- **Iconic Game Show Styling**: Navy/royal blue stage frame with glowing golden marquee bulbs.
- **Custom Team Names**: Displays your custom team names prominently on both scoreboards and the winner celebration screen.
- **Dynamic Rounds Indicator**: Displays `ROUND X OF Y (MX POINTS)` based on your chosen round count and multipliers.
- **3D Flip Answer Cards**: Smooth 3D flippable card slots (up to 8 answers) revealing answer text and point values with high-legibility bold text.
- **Live Bank & Scoreboards**: Animated team scoreboards with active control spotlight.
- **Strikes Overlay**: Giant, dramatic illuminated red `X`, `X X`, and `X X X` with electric strike buzzer sound effects.
- **Dynamic Event Ribbon & Timers**: Visual banners for The Face-Off, Playing the Board, and Steal Phase with synchronized 20s/15s timer badges.
- **Victory Celebration**: Grand winner screen with canvas confetti particle explosion and victory fanfare arpeggios.

### 🎮 2. Admin / Host Supervisor Screen (`admin.html`)
- **Custom Team Names Setup**: Configure team names (e.g. *The Smiths* vs *The Johnsons*) with live real-time sync to the board and all mobile buzzers.
- **Custom Amounts of Rounds**:
  - Set total rounds to any number (e.g. 1, 3, 5, 7 rounds).
  - Customize point multipliers per round (1X, 2X, 3X, 4X).
  - Jump to any round or click `Next Round ➔`.
- **Spreadsheet Question Import (Excel & CSV)**:
  - Drag & drop or upload `.xlsx`, `.xls`, or `.csv` files.
  - Automatically parses multiple questions and answers into the game bank.
  - Click **"📥 Download Sample Spreadsheet"** to get a pre-formatted template ready for Excel or Google Sheets.
- **The Face-Off Helper (Automated Rules Engine)**:
  - **Arm / Disarm Buzzers**: One-click buzzer lock/unlock with buzzer hit log (1st & 2nd fastest buzz with millisecond accuracy).
  - **#1 Answer Direct Win**: Immediate board control button.
  - **Higher Rank Advantage**: Pass to 2nd player to beat rank button.
  - **First Player Strike Default**: Default control button if neither answers on the board.
- **Board Play & Turn Supervisor**:
  - Track player turns across unlimited teammates.
  - One-click **20-Second Turn Countdown Timer** with pause/reset and audio warnings.
  - One-click **Answer Reveal Matrix** with points calculation.
  - Strikes controller (`+1`, `+2`, `+3`, `Clear`).
- **The Steal Phase (Three Strikes Rule)**:
  - Automatically triggers when Strike 3 is reached.
  - One-click **15-Second Group Conferral Timer**.
  - **Steal Successful**: Transfers accumulated bank points to stealing team.
  - **Steal Failed**: Retains accumulated bank points for original team.
- **Roster & Player Manager**:
  - Real-time roster of all connected mobile players.
  - Switch player team or designate team captain with 1 click.
- **Audio Soundboard**:
  - Web Audio API synthesizer for Ding, Strike Buzz, Face-Off buzzer, Steal Gong, and Victory Fanfare (zero external audio files or broken links!).
- **Buzzer QR Code**:
  - Built-in canvas QR Code generator for mobile players to scan and join instantly.

### 📱 3. Mobile Player Buzzer (`buzzer.html`)
- **Unlimited Players Per Team**: Anyone in the room can join either team on their smartphone.
- **Custom Team Selection**: Dynamically shows custom team names on the join buttons.
- **Instant Touch Responsiveness**: Optimized touch event handling with zero mobile lag.
- **Haptic Vibration**: Smartphone vibrates upon buzz in (`navigator.vibrate`).
- **Status Lighting**:
  - 🔴 **Red**: Armed & ready to buzz.
  - 🟢 **Green ("1ST!")**: You buzzed first!
  - 🟡 **Yellow ("2ND")**: You buzzed second.
  - ⚪ **Grey ("LOCKED")**: Host locked buzzers.
- **Live HUD**: Displays live team scores, current round, and game rules reminders.

---

## 📊 Spreadsheet Format Guide

You can upload spreadsheets in `.xlsx`, `.xls`, or `.csv` format:

### Standard Row Format (Recommended):
| Question | Answer 1 | Points 1 | Answer 2 | Points 2 | Answer 3 | Points 3 | ... | Answer 8 | Points 8 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Name something you find in hotel rooms | Television | 35 | Mini fridge | 22 | Hairdryer | 11 | ... | Safe | 8 |

Click **"📥 Download Sample Spreadsheet"** inside the Question Manager modal in `admin.html` to download a pre-filled template!

---

## 📜 Rules & Mechanics Implemented

| Phase | Mechanic | Automated System Helper |
| :--- | :--- | :--- |
| **The Face-Off** | One representative per team approaches the podium. First to buzz answers. | Buzzer logs 1st & 2nd buzz with timestamps. |
| **#1 Answer Direct Win** | Revealing the #1 survey answer immediately awards board control. | "Award Control to Buzz Winner" button. |
| **Higher Rank Advantage** | If not #1, 2nd player guesses: higher rank gains control. | "Pass to Player 2 to Beat Rank" button. |
| **First Player Default** | If neither player guesses an answer on the board, control defaults to 1st player's team. | "Default Control to 1st Team" button. |
| **Playing the Board** | Turn-based guessing by controlling team members. **No consultation allowed.** | Turn roster tracker + Rule warning banner. |
| **20s Time Limit** | Each player has 20 seconds to state their answer once called upon. | Built-in 20s countdown with ticking sound. |
| **Three Strikes Rule** | Incorrect guess = 1 Strike (X). 3 Strikes triggers the Steal Phase. | Dramatic red X overlay on projector + audio. |
| **The Steal** | Opposing team gets **15 seconds group conferral**; captain presents answer. | 15s countdown timer + Steal outcome buttons. |
| **Winning** | Points tallied across all rounds. Highest cumulative score wins! | Cumulative score tracker + Grand celebration fanfare. |

---

## 🚀 How to Host on GitHub Pages (Free, in 2 Minutes)

1. Create a new repository on [GitHub.com](https://github.com) (e.g. `family-feud`).
2. Upload all the files in this folder to the repository:
   ```
   ├── index.html
   ├── board.html
   ├── admin.html
   ├── buzzer.html
   ├── css/
   ├── js/
   └── .github/
   ```
3. In your GitHub repository, click on **Settings** (top tab).
4. On the left sidebar, click **Pages**.
5. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and folder `/(root)`.
   - Click **Save**.
6. Within ~60 seconds, GitHub Pages will provide your live URL:
   `https://<your-username>.github.io/<repo-name>/`

---

## 💻 How to Run Locally

You can open the HTML files directly in any modern browser:
- Open `index.html` to access the game launcher.
- Open `admin.html` on your laptop screen.
- Open `board.html` on your projector or secondary monitor.
- Open `buzzer.html` on players' phones.

---

## ⌨️ Board Keyboard Shortcuts

When presenting on `board.html`:
- `1` through `8`: Reveal / Hide answer slots #1 to #8.
- `X`: Trigger dramatic Strike (X).
- `F11`: Toggle Fullscreen projector view.
