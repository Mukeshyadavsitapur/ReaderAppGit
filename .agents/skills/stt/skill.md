---
name: Offline Speech-to-Text (STT) Pattern
description: Detailed instructions and implementation patterns for the Offline STT function using expo-speech-recognition in ReaderApp.
---

# Offline Speech-to-Text (STT) Implementation

## Overview
> [!IMPORTANT]
> **Online STT (Gemini/Groq) has been fully removed from the application.**
> The app now exclusively uses `expo-speech-recognition` for all voice features. This ensures 100% privacy, zero API costs, and near-instant feedback even without an internet connection.

This skill documents the robust offline STT implementation that handles cross-platform discrepancies between iOS and Android, manages permissions efficiently, and provides a "Live Chatbot" mode with volume-based silence detection.

---

## Detailed Logic (Beginner Friendly)

### 1. The "Accumulator" Pattern
One of the hardest parts of STT is preventing text from repeating or disappearing when the OS "refreshes" the recognition session. We use the `accumulatedOfflineTranscriptRef` to bridge this gap.

**How it works:**
1. User speaks: "Hello world."
2. STT Engine sends: `event.isFinal = true`.
3. We save "Hello world." into the **Accumulator**.
4. User speaks more: "How are you?"
5. We append the new partial text to the Accumulator: "Hello world. How are you?"

**Why we do this:**
On Android, the engine often includes previous sentences in new delivery packets. On iOS, it might clear them. By managing our own "Accumulator", we ensure the text stays stable regardless of the platform.

### 2. Smart Silence Detection (Volume Thresholds)
Instead of relying on the system to decide when you've stopped talking (which is often too slow or too aggressive), we monitor the actual microphone volume in real-time.

```javascript
// Threshold logic inside the volumechange event
const SILENCE_THRESHOLD = 4.5; // Decibel-relative value
if (volume < SILENCE_THRESHOLD) {
    // Start a timer. If it hits 3 seconds, STOP the mic automatically.
} else {
    // User is still talking! Reset the timer.
}
```

---

## Core Methods & Flow

### `getOfflineSTT(options)`
This is the main entry point. It returns a `Promise<string>` that resolves when the user stops talking or the silence timer triggers.

**Internal Flow:**
1. **Permission Check**: Checks if the mic is allowed.
2. **Setup Listeners**: Attaches `start`, `result`, `error`, and `end` handlers.
3. **Start Engine**: Calls `ExpoSpeechRecognitionModule.start()` with `continuous: true`.
4. **Volume Monitoring**: Actively calculates silence.
5. **Resolve**: When the mic stops, the `end` event triggers the `resolve()` of the promise with the final transcript.

### `handleVoiceToggle()`
In `app/index.tsx`, this function is now extremely simple:
```typescript
const handleVoiceToggle = async () => {
   // 1. Visually show 'recording' state
   // 2. Await the voice input
   const transcript = await getOfflineSTT();
   // 3. Put the transcript into the input field!
}
```

---

## Best Practices & Handling Gotchas

1. **Avoid Duplicates**: Always take the *first* result (`event.results?.[0]`) from the results array. Android sometimes sends multiple "alternative" guesses that can lead to stuttering text if not filtered.
2. **Optimistic UI**: When calling `stopOfflineSTT()`, toggle your UI buttons to `false` **immediately**. Do not wait for the `end` event. The OS takes a few seconds to shut down the hardware, and "waiting" makes the app feel laggy.
3. **Volume Calibration**: The threshold of `4.5` is a "sweet spot" for most mobile microphones. If users find the mic cuts off too early, consider lowering this to `3.5`.

---

## Example Usage (GeminiChat)
When the microphone button is pressed:
- `isRecording` state becomes `true`.
- `getOfflineSTT()` starts listening.
- As the user speaks, `offlineTranscript` updates the UI in real-time.
- On completion, the text is automatically sent to the AI.
