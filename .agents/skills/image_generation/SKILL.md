---
name: Image Generation Management Pattern
description: Detailed instructions and implementation patterns for Imagen (Gemini) and custom OpenAI-compatible (Groq) image generation in ReaderApp.
---

# Image Generation Management Pattern

This document outlines the centralized management of image generation models and the API logic used to interface with Gemini and third-party providers.

## Centralized Model IDs

All image generation models are defined in [models.ts](file:///e:/ReaderAppGit/constants/models.ts).

### Gemini (Imagen)
- **Latest**: `imagen-4.0-generate-001`, `imagen-4.0-fast-generate-001`.
- **Fallbacks**: `imagen-3.0-generate-001`, `imagen-3.0-fast-generate-001`.
- **Constants**: `GEMINI_IMAGE_MODELS`.

### Third-Party / Groq
- **Models**: `grok-2-image-gen`, `dall-e-3`.
- **Constants**: `GROQ_IMAGE_MODELS`.

## API Logic (`generateImage`)

The `generateImage` function in [index.tsx](file:///e:/ReaderAppGit/app/index.tsx) handles image requests using `XMLHttpRequest` to avoid React Native polyfill issues with `fetch` and binary data.

### Key Logic Steps:
1. **Model Selection**: Filters `displaySettings.imageModels` based on the active provider.
2. **Provider Handling**:
   - **Gemini**: Uses the standard Google AI endpoint.
   - **Groq**: Uses a configurable `groqImageBaseUrl` from display settings.
3. **Groq Base URL**: Default is `https://api.groq.com/openai/v1`. Since Groq lacks native image generation, this allows users to specify a proxy or compatible service (like xAI) that works with their key.
4. **Error Handling**:
   - **404 Handling**: Specific 404 check for Groq to notify users that a custom base URL is required.
   - **Retries**: Implements exponential backoff for 5xx and 503 errors.

## Settings Integration

- **Hydration**: `groqImageBaseUrl` is persisted in `AsyncStorage` as part of `displaySettings`.
- **UI**: A `TextInput` field for "Groq Image Base URL" is visible in the **Cloud API Settings** section of the settings modal when the provider is set to **Groq**.

## Best Practices
- **Always update models.ts**: When new Imagen or other image models become available, add them to the centralized arrays.
- **Merge Lists**: The app merges official constants with user-added models to ensure robustness.
- **Informative Errors**: Use `showToast` to guide users when provider-specific configuration (like the Groq Base URL) is missing or mismatched.
