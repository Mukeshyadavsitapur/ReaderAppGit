---
name: Custom AI Scenario Pattern
description: Detailed instructions and implementation patterns for the user-defined custom AI features (Roles/Tools) in ReaderApp, including storage, execution, and UI constraints.
---

# Custom AI Scenario Implementation

## Overview
ReaderApp allows users to define their own AI personas and tools. These are referred to as "Custom Features" or "Custom Roles" and are treated with similar priority to built-in tools like "Teacher" or "Writer".

## Logic & State Management

### 1. Data Structure
Each custom tool is an object with the following properties:
- `id`: `role_${Date.now()}` (Unique identifier).
- `title`: Short descriptive name (e.g., "Physicist").
- `systemPrompt`: The primary instruction for the LLM.
- `iconName`: Reference key for `ICON_MAP`.
- `isCustom`: Boolean `true` (Crucial for routing logic).
- `actionLabel`: (Optional) Text for the primary action button.

### 2. Primary Feature State
- `homeFeatureId`: (State) Tracks the ID of the custom feature currently acting as the **Home Page Personal Assistant**.
- `selectedScenario`: (State) Used for sessions explicitly started from the "Studio" or a specific tool.

### 3. Storage
- **Key**: `customTools` (AsyncStorage).
- **Initialization**: Loaded into the `customTools` state array during app startup (`useEffect` hook).

## Execution Flow (`handleSearchSubmit`)

When a user selects a custom feature and clicks "Start":
1. **Routing**: The `if (selectedScenario.isCustom)` block intercepts the call.
2. **Mode Switch**: `setAppMode("generating")` is called to show the streaming UI.
3. **Prompt Construction**:
    - **Global Override**: If `homeFeatureId` is set, `handleQuickSearch` prepends the custom feature's `systemPrompt` to ALL queries (Home and Reader), unless the session already has a specific custom tool.
    - In **Lesson Mode**: The `systemPrompt` is passed directly as the system instruction.
    - In **Discussion Mode**: A Q&A dialogue template is wrapped around the `systemPrompt`.
4. **Streaming**: Uses `callLLM_Stream` to provide real-time feedback.
5. **Image Generation**: Automated visual prompt injection is disabled for Custom Scenarios to prevent layout shifts. Images should be requested explicitly or generated within the Quiz feature.

## UI Patterns

### 1. Input Interface
- **Pill-Shaped Bar**: Custom features use the modern pill-shaped search bar pinned to the bottom of the screen.
- **Micro-Animations**: Uses `spring` animations for the input bar's appearance and height adjustments.

### 2. Home Page / Selection
- **Side Menu Toggle**: Clicking a custom assistant in the side menu toggles `homeFeatureId`.
- **Greeting**: `GeminiHome` dynamically updates its greeting to display: `"I am your {homeFeatureId.title}"`.
- **Grid Filtering**: Custom features (`isCustom: true`) are filtered out of the Home Screen tool grid to maintain a clean layout.
- **Icons**: Icons are dynamically resolved from `ICON_MAP` using the `iconName` property.

## Best Practices
1. **Role Priority**: In the system prompt, clearly instruct the AI to "Act strictly according to the Role defined".
2. **Markdown Enrichment**: Always request the AI to use Markdown (headers, bold, lists) for a premium reading experience in the Reader.
3. **Delete Protection**: Ensure a confirmation dialog or long-press gesture (`handleDeleteCustomTool`) is used to prevent accidental deletion of user-created roles.
4. **Validation**: Validate that the `systemPrompt` is not empty before saving to prevent broken AI behavior.
