# Reader App 📚

A comprehensive language learning and reading application built with React Native and Expo, featuring AI-powered tools, custom audio support, and intelligent content management.

---

## ✨ Features

### Core Capabilities
- 📖 **Interactive Reading**: Tap-to-translate with instant word lookup
- 🎧 **Audio Support**: Text-to-speech with custom audio upload
- 📝 **Smart Notes**: Quick notes with rich formatting and audio
- 📚 **Library Management**: Organize articles, stories, and reading materials
- 🎯 **Quiz & Flashcards**: AI-generated quizzes and spaced repetition learning
- 📖 **Personal Dictionary**: Save words with translations and pronunciations

### Latest Updates
- ✨ **Custom Audio Upload**: Upload your own pronunciation files for words
- 📥 **Dictionary Drive Import**: Download dictionaries from Google Drive links
- 🗑️ **Unified Delete System**: Consistent soft-delete with Recycle Bin across all content types
- 🧹 **Smart File Cleanup**: Automatic audio file management and cleanup

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run on your device:**
   - Scan the QR code with Expo Go app
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

### Configuration

1. **API Key Setup**: Enter your Gemini API key in Settings
2. **Language Preferences**: Configure your target learning language
3. **Customize Appearance**: Choose theme and reading preferences

---

## 📖 Documentation

For detailed feature documentation, usage guides, and troubleshooting:

👉 **[Read the User Guide](USER_GUIDE.md)**

The user guide includes:
- Complete feature documentation
- Step-by-step tutorials for new features
- Tips and best practices
- Troubleshooting guide
- Keyboard shortcuts

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **AI Integration**: Google Gemini API
- **Storage**: AsyncStorage
- **Audio**: Expo AV
- **File System**: Expo FileSystem
- **UI Components**: Custom components with Lucide icons

---

## 📱 Key Features Explained

### Custom Audio Upload
Upload your own audio files to use as pronunciation guides for dictionary words. Supports MP3, M4A, WAV, and AAC formats.

### Dictionary Import from Drive
Quickly import entire dictionaries by pasting a Google Drive share link. Perfect for sharing vocabulary lists or importing pre-made dictionaries.

### Unified Delete System
All content types (Notes, Library, Stories, Quizzes) use a consistent soft-delete system:
- Items move to Recycle Bin when deleted
- Restore accidentally deleted items
- Permanent deletion with automatic file cleanup
- Smart storage management

---

## 🔧 Development

### Project Structure
```
ReaderApp/
├── app/                 # Main application code
│   └── index.tsx       # Primary app component
├── components/         # Reusable UI components
├── constants/          # App constants and configuration
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Images, fonts, and static files
```

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Powered by [Google Gemini API](https://ai.google.dev)
- Icons by [Lucide](https://lucide.dev)

---

## 📞 Support

For detailed usage instructions and troubleshooting, please refer to the [User Guide](USER_GUIDE.md).

---

**Happy Learning! 🎓**
