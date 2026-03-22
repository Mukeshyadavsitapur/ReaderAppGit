---
name: Offline TTS & Structural Integrity
description: Patterns for maintaining the Offline TTS engine and ensuring the structural integrity of the main app index.
---

# Offline TTS & Structural Integrity Patterns

This skill documents the shift to a strictly **Offline TTS** engine and the structural rules for maintaining `app/index.tsx`.

## 1. Offline TTS Management

The application now exclusively uses **Offline TTS** via `expo-speech`. Online (Gemini/Groq) TTS has been removed to reduce complexity and redundant state.

### Key References
- **`speechState`**: A `useRef` that tracks the current playback state (chunks, index, isActive, isPaused, etc.).
- **`speechSessionId`**: A incrementing `useRef` used to "fence" background speech callbacks. If a playback session is interrupted, the ID is incremented, and stale callbacks return early.
- **`currentSound`**: A `useRef` (typed as `any`) for managing sound objects.

### Usage in Components
When using the `speak` function:
1.  **Stop Previous**: Ensure `Speech.stop()` and `currentSound.current?.pause()` are called.
2.  **Clean Text**: Use `cleanTextForDisplay` to remove LLM artifacts (markdown tags, dividers).
3.  **Language Detection**: Check for Devanagari characters to auto-switch to Hindi voices if needed.

## 2. Structural Integrity (Brace Balancing)

`app/index.tsx` is a monolithic file. Structural integrity is paramount.

### Rules
- **Brace Matching**: Every `{` must have a corresponding `}`. An unclosed brace (especially in functions like `speak` or `handleImportAllData`) can cause a `'}' expected` error at the very end of the file.
- **Indentation**: While the file is large, consistent indentation helps catch premature functional closures.
- **Lint Verification**: Always check for `Cannot find name` errors after major edits. If a local variable is suddenly undefined, a block may have closed too early.

## 3. Storage & Backup Import Patterns

When implementing backup/restore logic (`handleImportAllData`):
- **Variable Declaration**: Always use `let` or `const` inside the function scope for temporary arrays (`sessionsToImport`, `wordsToImport`).
- **Data Identification**:
    - `toolId`: Identifies a Chat Session.
    - `word` / `data`: Identifies a Dictionary Item.
- **Index Invalidation**: After a bulk import, invalidate the `library_metadata_index` in `AsyncStorage` to force the app to rebuild the library view on next load.

## 4. Audio Removal
- Do **NOT** restore the "Audio" tab in the library unless requested.
- `audioFiles` and related states are obsolete.
