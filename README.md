# Chadavukondi Firstu! (చదువుకోండి ఫస్టు) 🔥

<div align="center">

### *“Okkasari commit aithe na maata nene vinanu!”* ⚡️
**Zero excuses. Lock in, build your daily roadmap, and crush your goals.**

[![Live Web App](https://img.shields.io/badge/Live%20App-Online-success?style=for-the-badge&logo=google-chrome&logoColor=white)](https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/)
[![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native 0.86](https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Google Gemini API](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](chadavukondi-firstu/LICENSE)

</div>

---

## 🌐 Live Deployments

| Experience | Target Audience | Direct Link |
| :--- | :--- | :--- |
| 🎓 **Chadavukondi Firstu (Student App)** | Students & Learners | [**krrishnavamsi.github.io/kv-buildWithGemini-hands-on/**](https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/) |
| 🛠️ **Creator Studio & Meme Vault** | Creator & Admin | [**krrishnavamsi.github.io/kv-buildWithGemini-hands-on/creator/**](https://krrishnavamsi.github.io/kv-buildWithGemini-hands-on/creator/) |

*Both apps are fully responsive and work seamlessly as Progressive Web Apps (PWAs) on iOS Safari, Android Chrome, and Desktop browsers.*

---

## ⚡️ Key Features

- 🤖 **Interactive AI Interviewer**: Friendly chat planner that extracts your target subject, weekly commitment, daily hours, and target timeline to build an achievable roadmap.
- 🎯 **Domain-Aware Curriculum Engine**: Tailored, professional syllabi for:
  - **Full Stack Web Development** (HTML5, Modern JS, React Hooks, Node.js APIs, DB models)
  - **Python & AI / Data Science** (OOP, NumPy, Pandas, Scikit-Learn, Deep Learning, Gemini agents)
  - **Data Structures & Algorithms (DSA)** (Big-O, Two Pointers, Stacks, Trees, Graphs, DP)
  - **UPSC Civil Services** (Polity, Modern History, Geography, Economy, Ethics)
  - **Medical & NEET** (Cell Bio, Human Physiology, Plant Bio, Organic Chemistry, Mechanics)
  - **Universal Adaptive Synthesizer** (Dynamically maps any custom passion, skill, or exam)
- 📅 **Interactive Multi-Week Tracker**: Filter by week and day, toggle topic completion statuses (*Pending*, *In Progress*, *Completed*), and add custom topics on the fly.
- 🏆 **Mystery Milestone Badges**: Complete study streaks to unlock surprise Telugu pop-culture meme badges.
- 📊 **One-Click Excel Export**: Download your entire structured study syllabus as a clean `.xlsx` spreadsheet for offline printing or desktop planning.
- 🌓 **Material 3 Expressive Design**: Beautiful light and dark themes with Space Grotesk and Plus Jakarta Sans typography.
- 🔐 **Isolated Creator Studio**: Private administrative dashboard to manage meme quotes, streak milestone rewards, and API keys without exposing admin settings to students.

---

## 📂 Project Architecture

```
kv-buildWithGemini-hands-on/
├── chadavukondi-firstu/            # Core Cross-Platform Application
│   ├── assets/                     # App icons, splash screens, favicon
│   ├── creator-studio/             # Standalone Creator Admin App
│   │   ├── index.html              # Creator dashboard UI
│   │   ├── styles.css              # Glassmorphic admin styling
│   │   └── app.js                  # Meme vault & API key configuration
│   ├── src/
│   │   ├── api/
│   │   │   └── gemini.ts           # Gemini API client & domain syllabus engine
│   │   ├── components/
│   │   │   ├── PlanCard.tsx        # Study plan summary card with progress bars
│   │   │   └── TopicItem.tsx       # Daily topic checklist item
│   │   ├── data/
│   │   │   └── memeCatalog.ts      # Telugu dialogue quotes & milestone tiers
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx      # Main dashboard with dark mode & active plans
│   │   │   ├── ChatPlannerScreen.tsx# Conversational roadmap builder
│   │   │   └── PlanDetailScreen.tsx# Week-by-week deep-dive view
│   │   ├── storage/
│   │   │   └── planStorage.ts      # AsyncStorage persistence & streak calculations
│   │   ├── theme/
│   │   │   ├── material3.ts        # M3 tonal color palettes (Dark / Light)
│   │   │   └── ThemeContext.tsx    # Reactive theme provider
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   └── utils/
│   │       └── excelExport.ts      # SheetJS .xlsx syllabus generator
│   ├── App.tsx                     # Root component with font preloading
│   ├── app.json                    # Expo project configuration
│   ├── index.ts                    # Application entrypoint
│   ├── package.json                # Project dependencies
│   └── tsconfig.json               # TypeScript configuration
├── .gitignore                      # Clean repository ignore rules
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device (optional, for physical phone testing)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/krrishnaVamsi/kv-buildWithGemini-hands-on.git
   cd kv-buildWithGemini-hands-on/chadavukondi-firstu
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start --web
   ```
   - Press **`w`** to open in your default web browser.
   - Scan the terminal QR code with **Expo Go** on Android or Camera on iOS.

### Building for Web Deployment

```bash
npx expo export --platform web
```
The production bundle will be generated in `chadavukondi-firstu/dist`.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 57)
- **Web Runtime**: React Native Web (`react-native-web`)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Space Grotesk*)
- **Icons**: `@expo/vector-icons` (*Ionicons*) with preloaded font fallbacks
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`) with dynamic offline domain fallback
- **Data Persistence**: `@react-native-async-storage/async-storage` with cross-tab local storage synchronization
- **Spreadsheet Generation**: `xlsx` (SheetJS)
- **Design System**: Material Design 3 (M3) Dynamic Color System

---

## 📜 License

Distributed under the MIT License. See [LICENSE](chadavukondi-firstu/LICENSE) for more information.
