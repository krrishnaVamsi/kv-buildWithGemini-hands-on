# ⚡️ Chadavukondi Firstu! — Project & Deployment Documentation

> **“Okkasari commit aithe na maata nene vinanu!”** 🔥  
> *Stop scrolling, lock in.*

---

## 🔗 Quick Links

| Resource | URL |
| :--- | :--- |
| 🌐 **Student App (iOS / Android / Web)** | [https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/](https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/) |
| 🛠️ **Creator Studio & Meme Vault (Private Admin App)** | [https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/creator/](https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/creator/) |
| 💻 **Source Code Repository** | [https://github.com/krrishnaVamsi/kv-buildWithGemini-hands-on](https://github.com/krrishnaVamsi/kv-buildWithGemini-hands-on) |
| 🚀 **GitHub Pages Branch** | [https://github.com/krrishnaVamsi/kv-buildWithGemini-hands-on/tree/gh-pages](https://github.com/krrishnaVamsi/kv-buildWithGemini-hands-on/tree/gh-pages) |

---

## 📱 About the App

**Chadavukondi Firstu! ⚡️** is a cross-platform mobile and web application designed for Gen Z learners. It replaces generic, bureaucratic study planners with an energetic, locked-in experience powered by **Google Gemini AI**, **Material You 3.0**, and popular Telugu pop-culture easter eggs.

### 🌟 Key Highlights

1. **AI Game Plan Architect (Chat UI)**:
   - Interactive conversational assistant powered by Google Gemini.
   - Dynamically crafts custom weekly schedules and daily focused quests based on user availability (days/week, hours/day, target months).
   - Built-in smart offline syllabus synthesizer as a graceful fallback.

2. **OLED Dark Mode & Gen Z Aesthetic**:
   - One-tap Moon/Sun header toggle with persistent local storage.
   - Deep Obsidian (`#0B0F19`) OLED palette with Electric Glow Violet (`#818CF8`) accents.
   - Typography combination: **Space Grotesk** (display & numbers) + **Plus Jakarta Sans** (body & labels).

3. **Daily Quests & Roadmaps**:
   - Week-by-week carousel and daily quest tabs.
   - Tonal action chips: **Crushed It! ⚡️** (`completed`) and **Saved for Review 🔖** (`review_later`).
   - Add custom quests dynamically to any scheduled day.

4. **Surprise Milestone Achievements 🔒**:
   - Telugu meme-inspired milestone badges are kept as hidden surprise easter eggs that reveal themselves only when streaks are completed.

5. **Excel (.xlsx) Export**:
   - One-tap export generating structured `.xlsx` roadmaps complete with date stamps, focus themes, and progress tracking.

---

## 🔒 Security & Privacy Model

- **Zero Credential Leakage**: No `.env` or API keys are ever committed to git.
- **Offline-First / Local Storage**: All plans, progress, and user-provided API keys stay strictly on the user's device via `AsyncStorage`.
- Both root `.gitignore` and `chadavukondi-app/.gitignore` explicitly block `.env*`, `*-sa-key.json`, and credentials.

---

## 🏗️ Architecture & Tech Stack

```
chadavukondi-app/
├── App.tsx                      # App entrypoint with Google Fonts injection & ThemeProvider
├── src/
│   ├── api/gemini.ts            # Google Gemini AI planner + offline fallback generator
│   ├── components/
│   │   ├── PlanCard.tsx         # Material You 3.0 elevated card with progress capsules
│   │   └── TopicItem.tsx        # Daily quest item with status toggles
│   ├── data/memeCatalog.ts      # Surprise meme badges & Telugu dialogues
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Main dashboard, hero banner, dark mode toggle
│   │   ├── ChatPlannerScreen.tsx# Conversational AI study architect
│   │   ├── PlanDetailScreen.tsx # Multi-week syllabus, day schedules, Excel export
│   │   └── SettingsScreen.tsx   # Appearance toggle, API key config, meme vault
│   ├── storage/planStorage.ts   # AsyncStorage local persistence
│   ├── theme/
│   │   ├── material3.ts         # Material You 3.0 tokens & typography
│   │   └── ThemeContext.tsx     # Dark mode provider & persistence hook
│   ├── types/index.ts           # TypeScript interfaces
│   └── utils/excelExport.ts     # Excel sheet generator
└── dist/                        # Optimized production web bundle (deployed to gh-pages)
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps
```bash
# 1. Clone repository
git clone https://github.com/krrishnaVamsi/kv-buildWithGemini-hands-on.git
cd kv-buildWithGemini-hands-on/chadavukondi-app

# 2. Install dependencies
npm install

# 3. Start development server
npx expo start --web
```

---

## 📲 Installing as a Mobile App (PWA)

You can run the deployed app on any iOS or Android device like a native application:

1. Open [**`https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/`**](https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/) on your phone.
2. **On iPhone (Safari)**: Tap the **Share** button (`⎋`) ➔ select **Add to Home Screen**.
3. **On Android (Chrome)**: Tap the menu (`⋮`) ➔ select **Add to Home Screen** / **Install App**.
4. Launch the app directly from your home screen in distraction-free full-screen mode!
