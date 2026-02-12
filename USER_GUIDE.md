# Reader App - User Guide

A comprehensive language learning and reading application with AI-powered tools, custom audio support, and intelligent content management.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Core Features](#core-features)
  - [Library Management](#library-management)
  - [Reading & Translation](#reading--translation)
  - [Audio Features](#audio-features)
  - [Dictionary](#dictionary)
  - [Quiz & Flashcards](#quiz--flashcards)
  - [Notes](#notes)
- [Latest Features](#latest-features)
  - [Custom Audio Upload](#custom-audio-upload)
  - [Dictionary Download from Drive](#dictionary-download-from-drive)
  - [Unified Delete Function](#unified-delete-function)
- [Settings & Customization](#settings--customization)

---

## Getting Started

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Open the app in:
   - Expo Go (scan QR code)
   - Android Emulator
   - iOS Simulator

### Initial Setup

1. **Configure API Key**: Enter your Gemini API key in Settings
2. **Set Language Preferences**: Choose your target language for learning
3. **Customize Appearance**: Select day/night mode and reading preferences

---

## Core Features

### Library Management

Organize your reading materials across multiple categories:

- **Library**: Store articles, documents, and reading materials
- **Stories**: Creative writing and narrative content
- **Questions**: Quiz sessions and Q&A materials
- **Audio**: Manage audio files and audiobooks

**Actions:**
- Long-press items to enter selection mode
- Batch operations: delete, organize, or export multiple items
- Group items by date or category

### Reading & Translation

**Interactive Reading:**
- Tap any word for instant translation and pronunciation
- Highlight text for context-aware translations
- Save words to your personal dictionary
- Generate audio pronunciation for selected text

**Reading Modes:**
- Day/Night mode for comfortable reading
- Adjustable font size and spacing
- Customizable text appearance

### Audio Features

**Text-to-Speech:**
- Generate audio for any text content
- Multiple voice options and languages
- Adjustable playback speed
- Background playback support

**Audio Library:**
- Organize audiobooks and audio files
- Chapter-based navigation for books
- Playback controls with progress tracking

### Dictionary

**Personal Dictionary:**
- Save words from your reading sessions
- Add custom translations and notes
- Audio pronunciation for each word
- Search and filter saved words

**Word Lookup:**
- Instant translation while reading
- Context-aware definitions
- Example sentences
- Pronunciation guide

### Quiz & Flashcards

**Quiz Creation:**
- Generate quizzes from your reading materials
- Multiple question types
- Track scores and progress
- Review incorrect answers

**Flashcards:**
- Create flashcard decks from saved words
- Spaced repetition learning
- Audio support for pronunciation practice
- Track learning progress

### Notes

**Quick Notes:**
- Create notes on the go
- Rich text formatting
- Attach audio recordings
- Organize with tags and categories

---

## Latest Features

### Custom Audio Upload

**Upload your own audio files** to use as pronunciation guides for words and phrases.

#### How to Use:

1. **Navigate to Dictionary**
   - Open the Dictionary section from the main menu

2. **Select a Word**
   - Tap on any saved word to view details

3. **Upload Custom Audio**
   - Tap the **"Upload Audio"** button (📁 icon)
   - Choose an audio file from your device
   - Supported formats: MP3, M4A, WAV, AAC

4. **Manage Audio**
   - Play the custom audio to preview
   - Replace with a different file anytime
   - Delete custom audio to revert to generated audio

**Benefits:**
- Use native speaker recordings
- Add regional dialect pronunciations
- Include context-specific audio examples
- Perfect for specialized vocabulary

**File Management:**
- Custom audio files are automatically cleaned up when words are deleted
- Files are preserved in the Recycle Bin until permanently deleted
- Efficient storage management prevents orphan files

---

### Dictionary Download from Drive

**Import dictionaries directly from Google Drive links** for quick setup.

#### How to Use:

1. **Open Dictionary Settings**
   - Navigate to Settings → Dictionary

2. **Enter Drive Link**
   - Paste a Google Drive share link containing a dictionary JSON file
   - Format: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

3. **Download & Import**
   - Tap **"Download from Drive"**
   - The app will fetch and import the dictionary
   - Progress indicator shows download status

4. **Verify Import**
   - Check the Dictionary section to see imported words
   - All words will include translations and metadata

**Dictionary JSON Format:**
```json
[
  {
    "word": "example",
    "translation": "उदाहरण",
    "language": "hi",
    "timestamp": 1234567890000
  }
]
```

**Supported Sources:**
- Google Drive public/shared links
- Direct download URLs
- JSON files with proper formatting

**Tips:**
- Ensure the Drive link has proper sharing permissions
- Large dictionaries may take a moment to import
- Existing words will be updated with new data

---

### Unified Delete Function

**Consistent deletion behavior across all content types** with a safety net.

#### How It Works:

**Soft Delete (Move to Bin):**
- All deletions initially move items to the **Recycle Bin**
- Items remain recoverable until permanently deleted
- Applies to: Notes, Library items, Stories, Quizzes, Flashcards

**Recycle Bin:**
1. **Access the Bin**
   - Navigate to Notes section
   - Tap the **Trash icon** to view deleted items

2. **View Deleted Items**
   - See all trashed content regardless of type
   - Items show original title and deletion date
   - Empty bin button appears when items are present

3. **Restore Items**
   - Long-press to select items
   - Tap **"Restore"** to move back to original location
   - Items return with all data intact

4. **Permanent Delete**
   - Select items in the Recycle Bin
   - Tap **"Delete Forever"** for permanent removal
   - Or use **"Empty Bin"** to clear all trashed items

**Smart Cleanup:**
- Custom audio files are preserved until permanent deletion
- Automatic cleanup when bin exceeds 100 items (oldest deleted first)
- All associated files removed when emptying bin

**Delete Actions by Section:**

| Section | Delete Action | Result |
|---------|--------------|--------|
| Notes | Tap delete | Moves to Recycle Bin |
| Library | Select & delete | Moves to Recycle Bin |
| Stories | Select & delete | Moves to Recycle Bin |
| Quizzes | Select & delete | Moves to Recycle Bin |
| Recent Activity | Swipe delete | Moves to Recycle Bin |
| Recycle Bin | Select & delete | **Permanent deletion** |

**Benefits:**
- **Safety Net**: Recover accidentally deleted items
- **Consistent**: Same behavior across all sections
- **Clean**: Automatic file cleanup prevents storage bloat
- **Flexible**: Restore or permanently delete as needed

---

## Settings & Customization

### Appearance

- **Theme**: Day/Night mode toggle
- **Font Size**: Adjust reading text size
- **Text Spacing**: Customize line height and letter spacing
- **Color Scheme**: Choose accent colors

### Language

- **Target Language**: Set your learning language
- **Translation Language**: Choose translation output language
- **Voice Selection**: Pick preferred TTS voice

### Audio

- **Playback Speed**: Adjust audio speed (0.5x - 2.0x)
- **Auto-play**: Enable/disable automatic audio playback
- **Background Audio**: Allow audio to play when app is minimized

### Storage

- **Cache Management**: Clear cached data
- **Audio Files**: View and manage downloaded audio
- **Backup**: Export your data for backup
- **Recycle Bin**: Manage deleted items and storage

### Privacy

- **API Key**: Securely store your Gemini API key
- **Data Export**: Export all your data
- **Clear Data**: Reset app to initial state

---

## Tips & Best Practices

### For Language Learning

1. **Build Your Dictionary**: Save new words as you read
2. **Use Custom Audio**: Upload native speaker recordings for better pronunciation
3. **Regular Review**: Use flashcards for spaced repetition
4. **Context Learning**: Read full articles instead of isolated words

### For Reading

1. **Adjust Settings**: Find comfortable font size and spacing
2. **Use Night Mode**: Reduce eye strain during evening reading
3. **Save Highlights**: Mark important passages for later review
4. **Audio Support**: Listen while reading for better comprehension

### For Organization

1. **Use Categories**: Organize library items by topic
2. **Regular Cleanup**: Review and delete unused items
3. **Backup Important Content**: Export valuable materials
4. **Recycle Bin**: Check before emptying to avoid data loss

### For Performance

1. **Clear Cache**: Periodically clear cached data
2. **Manage Audio Files**: Delete unused custom audio
3. **Limit Active Items**: Archive completed materials
4. **Update Regularly**: Keep the app updated for best performance

---

## Troubleshooting

### Audio Issues

**Problem**: Custom audio not playing
- **Solution**: Check file format (MP3, M4A, WAV, AAC supported)
- Ensure file is not corrupted
- Try re-uploading the audio file

### Dictionary Issues

**Problem**: Drive download fails
- **Solution**: Verify the Drive link has public/shared access
- Check internet connection
- Ensure JSON format is correct

### Deletion Issues

**Problem**: Items not appearing in Recycle Bin
- **Solution**: Check if you're in the correct view mode
- Ensure items were soft-deleted (not permanently deleted)
- Refresh the app

### General Issues

**Problem**: App running slowly
- **Solution**: Clear cache in Settings
- Close and restart the app
- Check available device storage

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Toggle Theme | Settings → Appearance |
| Quick Search | Tap search icon |
| Go Home | Tap home icon |
| Open Settings | Tap gear icon |

---

## Support & Feedback

For issues, suggestions, or feedback:
- Check the troubleshooting section above
- Review app settings for configuration options
- Report bugs through the app's feedback system

---

## Version History

### Latest Updates

- ✨ **Custom Audio Upload**: Upload your own pronunciation files
- 📥 **Dictionary Drive Import**: Download dictionaries from Google Drive
- 🗑️ **Unified Delete**: Consistent soft-delete with Recycle Bin
- 🧹 **Smart Cleanup**: Automatic audio file management
- 🔄 **Restore Function**: Recover deleted items easily

---

**Happy Learning! 📚**
