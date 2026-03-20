---
name: Storage Management & Data Hydration Pattern
description: Detailed instructions and implementation patterns for handling large dataset hydration, storage limits (SQLITE_FULL), and lazy-loading in ReaderApp.
---

# Storage Management & Data Hydration Pattern

## 1. Goal
When building PWAs or React Native apps with enormous local datasets (like ReaderApp's session history), we must strictly manage metadata loading during startup to prevent `SQLITE_FULL` loops, `QuotaExceededError`, and UI blocking ("Restoring Activity" stuck issue).

This skill outlines how to correctly handle App state initialization and storage pruning.

## 2. Core Concepts
*   **Metadata vs. Full Data**: Never load a monolithic JSON blob of user data. Keep an index dictionary (`library_metadata_index`) that contains "lite" sessions (no `messages`, no large `content` strings).
*   **Lazy Loading**: Fetch the massive `session_${id}` strings only when the user explicitly clicks/loads a session.
*   **Global Auto-Pruning**: Use a global `Proxy` interceptor on `AsyncStorage` methods to catch `13` (SQLITE_FULL) or `QuotaExceededError`.

## 3. Implementation Rules

### Rule 1: Handling Data Hydration (Startup)
*   **Always read from an index file** (`library_metadata_index`).
*   **Fallback safely**: If the index is missing, and you must "crawl" through all `session_${id}` to rebuild the index, **parse each string instantly, discard it, and only save the `Lite` version into state**. Do not retain massive strings during loops.
*   **Safety Timeout**: Initialization blocks should always have a `setTimeout` (e.g., 5-10 seconds) pushing the user forward. Do not let one rogue promise permanently trap the user in a loading screen.

```typescript
// Example: Safety Timeout in loadData useEffect
useEffect(() => {
    let isCancelled = false;
    const safetyTimeout = setTimeout(() => {
        if (!isCancelled) setIsSettingsLoaded(true);
    }, 5000);

    const loadData = async () => {
        // ... Load metadata index
        if (!isCancelled) {
            clearTimeout(safetyTimeout);
            setIsSettingsLoaded(true);
        }
    };
    loadData();
    return () => { isCancelled = true; clearTimeout(safetyTimeout); };
}, []);
```

### Rule 2: Handling Global Storage Constraints
*   **Intercept Globally**: Provide a fallback interceptor `handleStorageError` that hooks into your storage interface.
*   **Auto Data Deletion**: When hitting storage bounds (`QuotaExceededError`, `SQLITE_FULL`), do not rely on the user to go to settings to "clear data."
*   `autoFreeStorage` MUST **automatically scan the metadata index, find the oldest non-pinned items, and systematically purge them** (`AsyncStorage.multiRemove`). 
*   **Update State Cleanly**: Once the oldest 10 items are purged, update the master arrays (`session_index`, `library_metadata_index`) explicitly and silently retry the operation.

### Rule 3: Lazy Loading (loadHistorySession)
*   When a user clicks on an item, check if it's "lite" (e.g., `session.isLite` or missing `.messages`).
*   If lite, run the deep load from `AsyncStorage.getItem('session_' + id)` inside `loadHistorySession`.
*   Crucially, when updating simple flags like `lastOpened` in the overall session store, **DO NOT overwrite the storage file with the lite in-memory object**. Use `AsyncStorage.mergeItem` stringifying only the changing field, avoiding data loss loops.
