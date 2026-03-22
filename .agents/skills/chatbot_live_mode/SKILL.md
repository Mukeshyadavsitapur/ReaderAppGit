---
name: Chatbot Live Mode Pattern
description: Detailed instructions for the hands-free, voice-first "Live Mode" conversation loop in the chatbot.
---

# Chatbot Live Mode Implementation

## Overview
**Live Mode** transforms the chatbot into a hands-free, voice-first companion. In this mode, the application automatically handles the transition between listening (STT) and speaking (TTS), allowing for a natural, continuous conversation without the user needing to press any buttons.

---

## The Conversation Loop
Live Mode operates on a continuous 4-step cycle:

1.  **LISTEN (STT)**: The app waits for the user to speak. It uses **Volume-based Silence Detection** to know when the user has finished their sentence.
2.  **PROCESS (LLM)**: Once speech is captured, it is sent to the AI (Gemini/Groq) to generate a response.
3.  **SPEAK (TTS)**: The AI's text response is converted to speech and played back to the user.
4.  **AUTO-RESTART**: As soon as the TTS finishes, the app triggers the next **LISTEN** turn automatically.

---

## Technical Implementation Details

### 1. The Auto-Trigger Mechanism
The loop is maintained by a `useEffect` hook that monitors the `ttsFinishedNaturally` state. This state is updated every time the TTS engine reaches the end of its playback.

```typescript
// Inside app/index.tsx
useEffect(() => {
    if (ttsFinishedNaturally > 0) {
        // ... (Session-independent logic) ...
        if (isLiveChatbotMode) {
            setTimeout(() => {
                // Ensure we only restart if we are still in live mode
                // and not already recognizing.
                if (isLiveChatbotMode && !isOfflineRecognizing) {
                    handleChatbotVoiceToggle();
                }
            }, 500);
        }
        setTtsFinishedNaturally(0); // Reset for next turn
    }
}, [ttsFinishedNaturally, isLiveChatbotMode, isOfflineRecognizing]);
```

### 2. Silence Detection (Hands-Free End)
To avoid requiring a manual "Stop" press, Live Mode uses real-time microphone volume monitoring. If the volume stays below a certain threshold (e.g., `4.5`) for a set duration (e.g., `3000ms`), the mic stops automatically.

- **Threshold**: `4.5` (Adjustable for different environments).
- **Timeout**: `3000ms` (Gives the user enough time to pause between thoughts).

---

## Beginner-Friendly Example: A Live Session

1.  **Start**: User toggles "Live Mode" and taps the mic once to begin.
2.  **User**: "Hi Wordy, how do I say 'Apple' in Spanish?"
3.  **App (Detects Silence)**: After 3 seconds of silence, the mic stops and sends the text to the AI.
4.  **AI**: Generates the response: "Apple in Spanish is 'Manzana'."
5.  **App (TTS)**: Speaks: *"Apple in Spanish is 'Manzana'."*
6.  **Loop Restart**: 0.5 seconds after the word *"Manzana"* is spoken, the mic button turns red again automatically.
7.  **User**: "Thanks! And what about 'Orange'?"
8.  **Repeat**: The cycle continues indefinitely until the user exits Live Mode or closes the chat.

---

## Developer Pro-Tips

### A. Grouping logic
Always ensure that your "Loop Restart" logic is decoupled from `readingSession` state. This ensures the chatbot remains interactive even if the user is not currently reading a book or article.

### B. Optimistic State Updates
When `handleChatbotVoiceToggle` is called, it should immediately signal the transition in the UI (e.g., changing the mic icon color) before the underlying OS service has fully warmed up. This makes the app feel faster.

### C. Handle "Stale" State
Since the auto-restart uses a `setTimeout`, always re-verify the `isLiveChatbotMode` and `isOfflineRecognizing` states *inside* the timeout to prevent starting the mic if the user has manually exited the mode or closed the app in that brief window.
