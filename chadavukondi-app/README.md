# Chadavukondi Firstu (చదువుకోండి ఫస్టు)

> *"Inka evaru matladakandi, Chadavukondi Firstu!"* 🎓🔥

A cross-platform study planner application built with React Native & Expo for iOS and Android, inspired by popular Telugu meme culture.

---

## Key Features

1. **Zero-Backend & Offline-First**:
   - Zero login / no accounts needed.
   - All study plans, daily schedules, custom topics, streak records, and milestone badges are stored strictly in local storage (`AsyncStorage`).
   - Sensitive credentials like the Gemini API Key are stored locally on the device (or configured through `.env`) and never committed to Git.
2. **Interactive AI Study Planner (Chat UI)**:
   - Conversational questionnaire asking:
     - Target Subject / Exam
     - Weekly Availability (Days/Week)
     - Daily Focused Hours
     - Target Timeline (Months)
   - Accurately generates a structured syllabus schedule via Google Gemini API (with smart fallback synthesizer).
3. **Business Calendar & Schedule Management**:
   - Week ribbon and day-by-day business calendar breakdown.
   - Per-topic actions: **Complete** (✅), **Review Later** (🔖).
   - **Add Custom Topic** button to dynamically insert subtopics or revision tasks into any day.
   - Native back gestures and header back button navigation to smoothly return to the plan dashboard.
4. **Export to Excel (.xlsx)**:
   - One-tap button that packages the full syllabus, week themes, daily dates, allocated hours, completion statuses, and progress metrics into an Excel `.xlsx` file.
   - Triggerable via native sharing on iOS/Android and direct file download on Web.
5. **Streaks & Telugu Meme Badges**:
   - Weekly & monthly milestone tracking.
   - Badges inspired by Telugu meme culture (*Beginner Topper*, *Brahmi Focus Mode*, *Relangi Mavayya Smile*, *Month 1 Boss Level*).
6. **Companion Content & Meme Manager**:
   - Located in [`companion-manager/`](file:///config/Desktop/BuildWithGemini/companion-manager).
   - Lightweight web app to manage, preview, export JSON, and sync meme references and milestone badges.

---

## Running the App

### 1. Mobile App (Expo)
```bash
cd chadavukondi-app
npm start       # Launches Expo Dev Tools (QR code for Expo Go on iOS/Android)
npm run web     # Launches instant Web preview
npm run android # Run on Android emulator
npm run ios     # Run on iOS simulator (macOS)
```

### 2. Companion Content Manager
Open [`companion-manager/index.html`](file:///config/Desktop/BuildWithGemini/companion-manager/index.html) directly in any web browser or serve with:
```bash
npx serve companion-manager
```
