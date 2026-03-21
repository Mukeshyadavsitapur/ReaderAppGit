---
name: LLM Streaming Pattern
description: Detailed instructions for implementing real-time LLM streaming using `callLLM_Stream` across various app features, including polyfills, background generation, and UI synchronization.
---

# LLM Streaming Implementation Pattern

## Overview
ReaderApp uses a custom streaming architecture to provide real-time AI responses. This improves perceived performance by showing text as it is generated rather than waiting for the entire response.

## Technical Foundation

### 1. Polyfills (`app/index.tsx`)
React Native's default `fetch` does not support readable streams. We use `react-native-fetch-api` to enable this.
- **Polyfills**: Ensure `URL`, `URLSearchParams`, and `fetch` are polyfilled at the top of the entry file.
- **Fetch Option**: Always pass `reactNative: { textStreaming: true }` in the fetch request to bypass the native bridge's buffering.

### 2. Core Functions
- **`callLLM_Stream`**: The primary orchestrator. It handles provider selection (Gemini vs. Groq) and automatic failover.
- **`callLLM_Internal_Stream`**: Handles the actual network request and stream parsing. Updates the UI via an `onChunk` callback.

## Implementation Workflow

### 1. Unified Search / Follow-up (`handleQuickSearch`)
When triggering a streaming response from the reader or search bar:
1. **Clear State**: Reset `generationData` to `null` or a placeholder (e.g., \"Searching...\").
2. **Switch Mode**: Set `appMode` to `'generating'` to display the streaming overlay.
3. **Execute Stream**: Call `callLLM_Stream` and update `generationData` with each chunk.
4. **Transition**: Once the stream is complete, load the resulting session and switch `appMode` back to `'reader'`.

### 2. Feature-Specific Generators (`handleSearchSubmit`)
For tools like "Teacher" or "Health Guide":
- **Custom Logic**: Use large switch-case blocks to set tool-specific `systemRole` and `prompt`.
- **Streaming Entry**: Most tools fall through to a shared `callLLM_Stream` call at the end of the input processing logic.
- **Visuals**: If `IMAGE_PROMPT` is detected at the end of a stream, wait for the stream to finish, then call `generateImage` and update the session.

### 3. Chatbot Streaming (`handleChatbotSend`)
- **UI Element**: Uses an `aiMsg` placeholder in the message list.
- **Update Logic**: `onChunk` updates the `content` property of the specific message ID in the `chatbotMessages` state array.
- **Scroll**: Ensure the chat list auto-scrolls to the bottom as the content expands.

## UI Consistency: Streaming → Reader Transition

> **CRITICAL RULE**: The `generating` mode overlay and the `reader` mode `renderReaderItem` must use **identical** `fontSize` and `lineHeight` values. A mismatch causes a jarring visual "shrink" or layout jump the moment the stream completes and the reader loads.

### Generating Mode (`appMode === 'generating'`)
The streaming text is rendered via `InteractiveText` with `generationData`:

```tsx
<InteractiveText
    rawText={generationData || "Thinking..."}
    theme={theme}
    style={{
        fontSize: 18 * displaySettings.fontSize,
        color: theme.text,
        lineHeight: 32 * displaySettings.fontSize,
        textAlign: 'left'
    }}
    tapToDefineEnabled={false}
/>
```

### Reader Mode (`renderReaderItem`)
The finalised session paragraphs are rendered with the **same** base values, plus a matching `marginBottom` to preserve the visual blank space built into the text blocks:

```tsx
style={[
    styles.articleText,
    {
        color: theme.text,
        fontSize: 18 * displaySettings.fontSize,
        lineHeight: 32 * displaySettings.fontSize,
        marginBottom: 32,
        ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles)
    }
]}
```

**Both use `fontSize: 18` as the base and `lineHeight: 32` as the base, both scaled by `displaySettings.fontSize`.**
Additionally, since reader mode strips blank `\n` spacing characters when converting to paragraphs, `InteractiveText` internally injects `dynamicMarginBottom = 16` for `# headings` and the outer wrapper injects `marginBottom: 32` for content paragraphs to visually mimic the empty line spacing of raw streaming text.

## Best Practices
1. **Error Handling**: Always provide a fallback to non-streaming or show a clear user alert if the stream breaks.
2. **Markdown Safety**: Ensure the streaming UI (`generationData`) can handle partial Markdown strings (e.g., unfinished bolding `**text...`) gracefully.
3. **Image Prompts**: If the AI appends an `IMAGE_PROMPT`, strip it from the visible `generationData` stream using regex: `chunk.replace(/IMAGE_PROMPT:.*$/is, '')`.
4. **Performance**: Avoid complex parsing inside the `onChunk` callback; keep it lightweight (state updates only).
5. **Style Sync**: Always keep `generating` and `reader` `InteractiveText` styles in sync. Any change to the font size or line height in one view must be mirrored in the other to avoid visual layout jumps.
