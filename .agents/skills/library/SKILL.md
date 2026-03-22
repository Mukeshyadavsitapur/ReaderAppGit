# Library Management Pattern

## Overview
The Library in ReaderApp is a centralized hub for all user-generated content, including AI chats, generated stories, editorials, and educational materials (quizzes, cards, vocabulary).

## Tab Structure
The Library is divided into two primary sections:
1.  **Assistant**: Merged view containing general AI chats, generated stories, and editorials.
2.  **Test**: Dedicated section for educational content (Quizzes, Flashcards, Saved Questions, Vocabulary).

## Merged Assistant Tab
The "Assistant" tab combines what were previously separate "Assistant" and "Studio" sections. 

### Filtering Logic (`filteredLibraryItems`)
- **Combined Filter**: Includes general sessions, `story_generator` sessions, and `editorial_writer` sessions.
- **Exclusions**: Specifically excludes `quick_notes`, `quiz_save`, `flashcards`, and `audio_player` (these are handled in the "Test" tab or other specialized views).
- **Grouping**: 
    - **Editorials**: Grouped under a single "Editorials" group.
    - **Stories**: Grouped by "Book Title" (extracted from the session title using the `:` separator).
    - **Standalone**: Items that don't fit grouping criteria or are the only item in their potential group are shown as standalone sessions.

### Unified Rendering (`renderLibraryItem`)
A single renderer handles both standalone sessions and groups within the Assistant tab:
- **`LibraryGroupItem`**: Used for grouped stories or editorials. It manages its own expansion state (`expandedStoryGroups`) and handles chapter navigation.
- **`LibrarySessionItem`**: Used for individual chat sessions.

## UI Constraints
- **Full Width Tabs**: Library tabs ("Assistant" and "Test") are designed to take up the full available width (50% each) for better accessibility and a premium feel.
- **Icon-less Labels**: Tabs use bold text labels without icons to minimize vertical height and maintain a clean interface.
- **Responsive Layout**: The library automatically adjusts its grid (number of columns) based on device orientation (Portrait vs. Landscape).

## Search Integration
The Library features a unified search bar that filters the current active tab's content in real-time. It searches through both titles and message content using a memoized filtering approach for performance.
