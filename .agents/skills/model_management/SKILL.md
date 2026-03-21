---
name: AI Model Configuration Pattern
description: Detailed instructions and implementation patterns for the centralized AI model configuration in ReaderApp, including Gemini, Groq, and specialized models for image, tts, and stt features.
---

# AI Model Configuration Pattern

This skill documents the centralized model management system in ReaderApp. All AI model IDs must be defined in the centralized configuration file to ensure consistency across all features (Chat, Quiz, Reader, Settings, etc.).

## Core Configuration File
The source of truth for all AI model IDs is:
`[models.ts](file:///e:/ReaderAppGit/constants/models.ts)`

### Key Constants
- `GEMINI_MODELS`: List of supported Gemini model IDs, prioritized from newest/most stable to fallback.
- `GROQ_MODELS`: List of supported Groq model IDs, including Llama, Qwen, and specialized OSS models.
- `IMAGE_MODELS`: Supported models for image generation (e.g., Imagen, DALL-E).
- `TTS_MODELS`: Supported models for Text-to-Speech (native or cloud-based).
- `GROQ_TTS_MODELS`: Specialized TTS models available via Groq.
- `STT_GROQ_MODELS`: Specialized Speech-to-Text models for Groq (e.g., Whisper).
- `STT_GEMINI_MODELS`: Gemini model IDs used for Speech-to-Text tasks.

## Merging Strategy for Robustness
To prevent stale configuration data in `AsyncStorage` from breaking the app (e.g., outdated model IDs), the application uses a **Merging Strategy** during hydration and API calls:

### 1. Hydration (Startup)
When settings are loaded from storage in `app/index.tsx`, the stored lists are merged with the current official constants using a `Set` to remove duplicates while ensuring official models are present:
```typescript
textModels: [...new Set([...GEMINI_MODELS, ...(parsed.textModels || [])])],
groqModels: [...new Set([...GROQ_MODELS, ...(parsed.groqModels || [])])],
```

### 2. API Calls & Testing
Functions responsible for calling LLMs or testing connections must also use the merged list to ensure "known good" models are always tried, regardless of what's in the current state:
```typescript
let groqTestModels = [...new Set([...GROQ_MODELS, ...(displaySettings.groqModels || [])])];
```

## ⚠️ CRITICAL: Streaming Polyfill Conflict
`app/index.tsx` globally replaces `fetch` with the `react-native-fetch-api` streaming polyfill at startup:
```typescript
global.fetch = fetchPolyfill as any; // line ~15 in app/index.tsx
```
This polyfill **only works correctly for streaming responses**. Any plain `POST` request made via the global `fetch()` (e.g., for connection testing, non-streaming calls) will **silently fail or behave incorrectly**.

### Rule: Never use `fetch()` for connection tests or one-shot requests
Instead, use native **`XMLHttpRequest`** which is not affected by the polyfill:
```typescript
const xhrPost = (url: string, headers: Record<string, string>, body: string): Promise<{ status: number; text: string }> =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
        xhr.onload = () => resolve({ status: xhr.status, text: xhr.responseText });
        xhr.onerror = () => reject(new Error('Network request failed'));
        xhr.ontimeout = () => reject(new Error('Request timed out'));
        xhr.timeout = 15000;
        xhr.send(body);
    });
```

This pattern is already used in `handleTestConnection` in `app/index.tsx`. Any future connection testing or health-check logic should follow this same pattern.

## Updating Models
When a new model is released or an old one is deprecated:
1.  **Update `constants/models.ts`**: Add the new model ID at the top of the relevant array.
2.  **The app handles the rest**: Due to the merging strategy, the new model will automatically be injected into existing users' settings on the next app load and will be included in all connection tests and fallbacks.

## Why Centralize and Merge?
- **Consistency**: Prevents different parts of the app from using different (or outdated) models.
- **Resilience**: A user's local settings won't break the app if model IDs change; the app will always have the latest valid IDs as fallback.
- **Maintainability**: Single point of update for all AI features.
