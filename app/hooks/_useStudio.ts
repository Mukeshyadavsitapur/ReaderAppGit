
import { useState } from 'react';
import { Alert } from 'react-native';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

interface UseStudioProps {
    appMode: string;
    setAppMode: (mode: string) => void;
    displaySettings: any;
    setGenerationData: (data: string | null) => void;
    callLLM: (prompt: string, systemRole: string, jsonMode?: boolean, modelOverride?: string | null) => Promise<string>;
    generateImage: (prompt: string) => Promise<string | null>;
    persistSession: (session: any) => Promise<void>;
    loadHistorySession: (session: any, mode?: string) => void;
    chatSessions: any;
    setChatSessions: React.Dispatch<React.SetStateAction<any>>;
    setReadingSession: (session: any) => void;
    storyMode: string; // 'narrator' | 'scriptwriter'
    apiKey: string;
    customApiKey: string;
    autoPlayRef: React.MutableRefObject<boolean>;
}

export const useStudio = ({
    appMode,
    setAppMode,
    displaySettings,
    setGenerationData,
    callLLM,
    generateImage,
    persistSession,
    loadHistorySession,
    chatSessions,
    setChatSessions,
    setReadingSession,
    storyMode,
    apiKey,
    customApiKey,
    autoPlayRef
}: UseStudioProps) => {

    // --- State ---
    const [storyTabMode, setStoryTabMode] = useState('story'); // 'story' or 'editorial'
    const [storyQuery, setStoryQuery] = useState("");
    const [bookParams, setBookParams] = useState({ title: "", chapter: "", description: "", genre: "Mythology" });
    const [editorialParams, setEditorialParams] = useState({ topic: "", stance: "Balanced", tone: "Professional", length: "Medium" });

    // --- Helpers ---
    const saveEditorialSession = async (title: string, content: string) => {
        const newSession = {
            id: generateId(),
            title: title,
            messages: [{ role: 'model', content: content }],
            timestamp: new Date().toISOString(),
            lastOpened: new Date().toISOString(),
            toolId: 'editorial_writer',
            pinned: false,
            voice: displaySettings.voice,
            hasAudio: false
        };

        setChatSessions((prev: any) => ({ ...prev, [newSession.id]: newSession }));
        await persistSession(newSession);

        setReadingSession(newSession);
        setGenerationData(null);
        setAppMode('reader');
    };

    // --- Handlers ---
    const handleGenerateBookChapter = async () => {
        let title = "";
        let description = "";
        const query = storyQuery.trim();

        if (!query) {
            // PROFILE-BASED GENERATION
            const { userName, userProfession, userGoal, userBio } = displaySettings as any;
            description = `Create a story tailored to the user profile:
            - Name: ${userName || "User"}
            - Profession: ${userProfession || "Learner"}
            - Goal: ${userGoal || "Self-improvement"}
            - Bio: ${userBio || "No bio provided."}
            Write a story that resonates with this person's background and aspirations. Use the ${bookParams.genre} genre.`;
        } else {
            // Parsing logic: look for separator, otherwise check length
            const separatorIdx = query.indexOf(':') !== -1 ? query.indexOf(':') : query.indexOf('-');
            if (separatorIdx !== -1) {
                title = query.substring(0, separatorIdx).trim();
                description = query.substring(separatorIdx + 1).trim();
            } else if (query.length < 60) {
                title = query;
            } else {
                description = query;
            }
        }

        const effectiveChapter = "Chapter 1: The Beginning";

        setAppMode("generating");
        setGenerationData(`Writing ${effectiveChapter}...`);

        let prompt = "";
        let systemRole = "Professional Author";

        const titleContext = title
            ? `titled "${title}"`
            : `and invent a creative, fitting title for this book based on the description provided. Start your response with "BOOK_TITLE: [Your Creative Title]" on the first line.`;

        const descriptionContext = description
            ? `\n\nPLOT/SCENE DESCRIPTION: The user has provided the following details:\n"${description}"\nEnsure these events or details are incorporated naturally into the narrative.`
            : "";

        if (storyMode === 'narrator') {
            systemRole = "Master Narrator";
            prompt = `Act as a master storyteller. 
        Write "${effectiveChapter}" for a ${bookParams.genre} book ${titleContext}.
        ${descriptionContext}
        
        MODE: NARRATOR
        - Style: Classic storytelling.
        - Perspective: Third-Person Omniscient (or appropriate for genre).
        - Focus: Descriptive prose, world-building, internal monologues, and narrative arc.
        - Tone: The narrator guides the reader through the events.
        
        Guidelines:
        - Genre Style: ${bookParams.genre}.
        - Length: Comprehensive and detailed.
        - Vocabulary: Use strict A1/A2 beginner vocabulary. Short sentences, simple words, and clear grammar. Focus on clarity and emotion over complex vocabulary.
        - Format: Use Markdown with a clear chapter title header.
        `;
        } else {
            systemRole = "Scriptwriter";
            prompt = `Act as a professional Scriptwriter.
        Write "${effectiveChapter}" for a ${bookParams.genre} book ${titleContext}.
        ${descriptionContext}
        
        MODE: AUDIO DRAMA SCRIPT
        
        STRICT RULES:
        1. **DIALOGUE DRIVEN**: The story must be told primarily through what characters SAY.
        2. **SEPARATE NARRATION**: Use "**Narrator:**" for all scene settings, actions, and non-spoken descriptions.
        3. **REALISTIC SPEECH**: Characters must speak naturally. Do NOT write internal thoughts as dialogue.
        4. **FORMAT**: 
           - **[Character Name]:** "Dialogue..."
           - **Narrator:** [Description of scene or action].
        5. **NO GENERIC LABELS**: Do NOT use "Scene:" or "Action:" as speaker names. Use "Narrator:" instead.
        
        Guidelines:
        - Genre Style: ${bookParams.genre}.
        - Length: Comprehensive script.
        - Vocabulary: Use strict A1/A2 beginner vocabulary.
        `;
        }

        // Add Visual Requirement to prompt
        prompt += `\n\nVISUAL REQUIREMENT:
    At the very end of your response, strictly on a new line, provide a detailed image generation prompt to create a cover or scene for this chapter. Format: IMAGE_PROMPT: <prompt>`;

        const rawContent = await callLLM(prompt, systemRole);

        // NEW: Check for error before saving
        if (rawContent.startsWith("Error")) {
            setGenerationData(null);
            setAppMode("idle"); // Return to story tab
            Alert.alert("Generation Failed", rawContent);
            return;
        }

        let content = rawContent;
        let finalTitle = title;

        // NEW: Extract BOOK_TITLE if inferred by AI
        const titleMatch = content.match(/BOOK_TITLE:\s*(.*)/);
        if (titleMatch) {
            finalTitle = titleMatch[1].trim();
            content = content.replace(/BOOK_TITLE:.*$/, '').trim();
        }

        if (!finalTitle) finalTitle = "Untitled Story";

        let image = null;
        const imgMatch = content.match(/IMAGE_PROMPT:\s*(.*)/);
        if (imgMatch) {
            const imgPrompt = imgMatch[1].trim();
            content = content.replace(/IMAGE_PROMPT:.*$/, '').trim();
            setGenerationData("Illustrating...");
            try {
                image = await generateImage(imgPrompt);
            } catch (e) { console.warn("Image generation failed", e); }
        }

        // NEW: Calculate Sequence Number (Footer)
        const bookPrefix = `${finalTitle}:`;
        const existingChaptersCount = Object.values(chatSessions).filter((s: any) =>
            s.toolId === 'story_generator' &&
            s.title.startsWith(bookPrefix)
        ).length;

        // Append Footer
        content += `\n\n---\n*Sequence: ${existingChaptersCount} previous chapters*`;

        const newSession = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            messages: [{ role: "ai", content }],
            title: `${finalTitle}: ${effectiveChapter}`,
            toolId: 'story_generator',
            image: image,
            translations: { [displaySettings.language]: content },
            language: displaySettings.language,
            storyMode: storyMode,
        };
        await persistSession(newSession);

        autoPlayRef.current = true;
        loadHistorySession(newSession);
        setGenerationData(null);
        setStoryQuery(""); // NEW: Clear query after generation
    };

    const handleGenerateEditorial = async () => {
        const topic = editorialParams.topic.trim();

        const key = customApiKey || apiKey;
        if (!key) {
            Alert.alert("API Key Required", "Please add your Gemini API Key in Settings.");
            return;
        }

        setAppMode("generating");
        setGenerationData(topic ? `Writing Editorial: ${topic}...` : "Brainstorming & Writing Editorial...");

        try {
            let prompt = "";
            let systemRole = "Professional Author";

            if (!topic) {
                // INTEGRATED BRAINSTORMING + GENERATION
                const existingTopics = Object.values(chatSessions)
                    .filter((s: any) => s.toolId === 'editorial_writer')
                    .map((s: any) => s.title)
                    .slice(0, 30)
                    .join(", ");

                prompt = `
                Task: 
                1. Brainstorm ONE unique, controversial, or thought-provoking editorial topic. (Constraint: Must NOT be similar to: [${existingTopics}]).
                2. Act as a senior Editor-in-Chief. Write a comprehensive ${editorialParams.length} editorial piece on that topic immediately.

                Key Requirements:
                - Stance: ${editorialParams.stance}
                - Tone: ${editorialParams.tone}
                - Structure: Catchy Headline, Engaging Introduction, 3-4 Clear Arguments, Counter-argument rebuttal (if balanced), and a Strong Conclusion.
                - Formatting: Use Markdown (## Headers, **Bold** for emphasis).
                - Vocabulary: Use advanced, sophisticated vocabulary (B1-C2 level).
                - **IMPORTANT**: Return your response such that the first line is exactly "EDITORIAL_TITLE: [Your Creative Headline]".
                `;
            } else {
                prompt = `
                Act as a senior Editor-in-Chief. Write a comprehensive ${editorialParams.length} editorial piece on the topic: "${topic}".
                
                Key Requirements:
                - Stance: ${editorialParams.stance}
                - Tone: ${editorialParams.tone}
                - Structure: Catchy Headline, Engaging Introduction, 3-4 Clear Arguments, Counter-argument rebuttal (if balanced), and a Strong Conclusion.
                - Formatting: Use Markdown (## Headers, **Bold** for emphasis).
                - Style: Professional, articulate, and thought-provoking.
                - Vocabulary: Use advanced, sophisticated vocabulary (B1-C2 level). Demonstrate complex sentence structures and precise language.
                - **IMPORTANT**: Do NOT use Concept Cards or special widget formats. Write in a continuous, flowing newspaper editorial style.
                `;
            }

            const response = await callLLM(prompt, "You are a professional editor.", false, null);

            if (!response || response.startsWith("Error")) {
                throw new Error("Generation failed: " + response);
            }

            let finalTopic = topic;
            let finalContent = response;

            // Robust title extraction handling various model output formats
            // Handles: EDITORIAL_TITLE, EDITORIAL-TITLE, EDITORIAL TITLE, TITLE, HEADLINE
            const titleRegex = /(?:EDITORIAL[_\s-]?TITLE|TITLE|HEADLINE):\s*(.*)/i;
            const titleMatch = response.match(titleRegex);

            if (titleMatch) {
                finalTopic = titleMatch[1].trim();
                // Remove the matched title line from the content
                finalContent = response.replace(titleMatch[0], '').trim();
            }

            if (!finalTopic) finalTopic = "Untitled Editorial";

            await saveEditorialSession(finalTopic, finalContent);

        } catch (error) {
            setGenerationData(null);
            setAppMode('idle');
            Alert.alert("Error", "Failed to generate editorial. Please try again.");
            console.error(error);
        }
    };

    return {
        storyTabMode,
        setStoryTabMode,
        storyQuery,
        setStoryQuery,
        bookParams,
        setBookParams,
        editorialParams,
        setEditorialParams,
        handleGenerateBookChapter,
        handleGenerateEditorial
    };
};
