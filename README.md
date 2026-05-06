# ElderSpeak

ElderSpeak is a mobile learning app built with **Expo** and **React Native**. It targets older learners with a calm UI, adjustable text size, and Vietnamese copy for greetings and lesson content. The app includes onboarding, sign-in flows (demo-oriented), structured lessons (reading, listening, writing), vocabulary flashcards, progress tracking, medals, history, and profile settings.

## Features

- **Onboarding** and **authentication** screens (register, login, OTP, profile setup)
- **Lessons** by topic with mode selection, then reading, listening, and writing activities plus a results screen
- **Vocabulary** tab with topic-based flashcards
- **Home** dashboard with current lesson and topic cards
- **Profile**: edit profile, settings (including font size), history, feedback, medals
- **Accessibility**: font size presets in app settings
- **Audio & speech**: `expo-audio` and `expo-speech` for listening and TTS-style flows
- **Local persistence**: AsyncStorage for onboarding, login flag, and last selected tab

> Lesson and user data are largely driven by **mock data** in `frontend/src/data/` for prototyping; there is no separate backend in this repository.

## Tech stack

- [Expo](https://expo.dev/) SDK ~54
- React 19 / React Native 0.81
- React Navigation (stack + bottom tabs)
- Async Storage, SVG, Google Fonts (Audiowide)

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node)
- For physical devices: [Expo Go](https://expo.dev/go) or a simulator/emulator (Xcode / Android Studio)

## Getting started

From the repository root:

```bash
cd frontend
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

### Other scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm start`    | Start the Expo dev server |
| `npm run android` | Open on Android       |
| `npm run ios`     | Open on iOS           |
| `npm run web`     | Run in web browser    |

## Project layout

```
ElderSpeak/
├── README.md
└── frontend/
    ├── App.js                 # Navigation and app shell
    ├── app.json               # Expo config
    ├── assets/                # Icons, splash, images
    └── src/
        ├── components/        # Shared UI (e.g. buttons, text)
        ├── data/              # mockData, themes, lesson registry
        ├── screens/           # Onboarding, Auth, Lesson, Main, Flashcard
        ├── store/             # React contexts (progress, settings)
        └── utils/             # Helpers (e.g. sound effects)
```

## License

This project is marked **private** in `package.json`. Add a license file if you plan to distribute the code.
