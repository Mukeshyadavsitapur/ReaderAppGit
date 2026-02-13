import { FileImage, GraduationCap, HelpCircle, MonitorCheck } from 'lucide-react-native';

export const HIGHLIGHT_COLORS = {
    yellow: { day: '#fef08a', night: '#854d0e', code: '#facc15' }, // Yellow-200/800
    green: { day: '#bbf7d0', night: '#14532d', code: '#4ade80' }, // Green-200/800
    blue: { day: '#bfdbfe', night: '#1e3a8a', code: '#60a5fa' }, // Blue-200/800
    pink: { day: '#fbcfe8', night: '#831843', code: '#f472b6' }, // Pink-200/800
    purple: { day: '#ddd6fe', night: '#5b21b6', code: '#a78bfa' }, // Violet-200/800
    orange: { day: '#fed7aa', night: '#7c2d12', code: '#fb923c' }, // Orange-200/800
};

export const SPEECH_RECORDING_OPTIONS: any = {
    extension: '.m4a',
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    android: {
        extension: '.m4a',
        outputFormat: 'mpeg4', // AndroidOutputFormat.MPEG_4
        audioEncoder: 'aac', // AndroidAudioEncoder.AAC
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
    },
    ios: {
        extension: '.m4a',
        audioQuality: 96, // IOSAudioQuality.HIGH
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
    web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
    },
};

export const SCHOOL_TOOLS: any[] = [
    // Row 1
    { id: "visual_learner", title: "Vision", Icon: FileImage, role: "Visual Tutor", type: "vision", actionLabel: "Select Image", prompt: "Analyze images.", color: ["#2dd4bf", "#10b981"] },
    { id: "examiner", title: "Quiz", Icon: MonitorCheck, role: "Quiz Examiner", type: "quiz", actionLabel: "Start Quiz", prompt: "You are an examiner.", placeholder: "Enter topic (e.g. 'Hard Math Quiz', 'Grade 5 History')...", color: ["#34d399", "#22c55e"] },
    { id: "ai_tutor", title: "Personal Assistant", Icon: GraduationCap, role: "Personal Tutor", type: "lesson", actionLabel: "Start Learning", prompt: "You are a friendly Personal Assistant. Explain concepts in simple, beginner-friendly language, like easy-to-read study notes. Avoid complex jargon. Use tables, charts, diagrams, and bullet points. Use [[CONCEPT_CARD]] for formulas, code snippets, dates, and key definitions in ANY subject. **STRICTLY MAX 30-50 words per card**. Split complex topics into multiple cards. End with a [[CONCEPT_CARD: CHAPTER SUMMARY]].", placeholder: "Ask for study notes, explanations, or help...", color: ["#3b82f6", "#8b5cf6"] },
    // Row 2, 3, 4, 5 and others (Placeholders implied by original code structure if needed, or just clean it up)
];

export const APP_GUIDE_TOOL = { id: "help_guide_char", title: "App Guide", Icon: HelpCircle, role: "ReaderApp Guide", type: "chat", actionLabel: "Get Help", prompt: "You are the official guide for ReaderApp. HELP ONLY with these available features: Vision (Image Analysis & Flashcards), Quiz (Create Quizzes), Flashcards (Study Decks), Personal Assistant (Study Notes), Story Mode (Write Novels), Dictionary, Notes, and Library. DO NOT mention or help with removed tools like 'Math Solver', 'ML Tutor', 'Editorial', or games. If asked about missing tools, say they are no longer available. Explicitly mention that Flashcards can be generated via Vision (from images) or Quiz mode.\n\nLATEST FEATURES (Highlight these when relevant):\n1. CUSTOM AUDIO UPLOAD: Users can now upload their own audio files (MP3, M4A, WAV, AAC) for dictionary words. In Dictionary, tap a word, then use the Upload Audio button to add custom pronunciation files. Custom audio is automatically cleaned up when words are deleted.\n\n2. DICTIONARY DRIVE IMPORT: Users can import entire dictionaries from Google Drive links. In Dictionary settings, paste a Google Drive share link containing a JSON dictionary file. Format: [{word, translation, language, timestamp}]. Ensure the Drive link has proper sharing permissions.\n\n3. PERMANENT DELETION: All content (Notes, Library, Stories, Quizzes) is now deleted permanently and immediately. This includes automatic cleanup of associated custom audio files. Note that this action cannot be undone, providing a streamlined and efficient workflow.\n\nWhen users ask about deletion, audio upload, or dictionary import, provide clear step-by-step instructions for these new features.", placeholder: "Ask how to use a feature...", color: ["#f59e0b", "#d97706"] };

export const STATIC_TEXT: { [key: string]: any } = {
    tabs: {
        story: "Story",
        dictionary: "Dictionary",
        studio: "All Apps",
        notes: "Notes",
        library: "Library",
        settings: "Settings"
    },
    home: {
        welcome: "Hello, Friend!",
        subtitle: "What shall we learn today?",
        searchLib: "Search library...",
        searchOnline: "Ask me anything...",
        searchNotes: "Search saved notes...",
        dictTitle: "Recent Words Flashcards",
        dictSub: "words in history",
        shortcuts: "Shortcuts"
    },
    dictionary: {
        title: "Recent Words Flashcards",
        searchPlaceholder: "Type a word...",
        share: "Share",
        import: "Import",
        export: "Export",
        empty: "Your history is empty.",
        recent: "Recently Searched"
    },
    notes: {
        title: "My Notes",
        edit: "Edit Note",
        create: "Create New Note",
        search: "Search notes...",
        emptyNotes: "No notes yet.",
        save: "Save",
        discard: "Discard",
        vision: "Vision",
        quiz: "Quiz",
        expand: "Expand",
        grammar: "Grammar",
        translate: "Translate"
    },
    library: {
        journals: "Assistant",
        stories: "Stories",
        audio: "Audio",
        test: "Test",
        search: "Search library...",
        emptyJournals: "No assistant data yet.",
        emptyStories: "No stories saved yet.",
        emptyAudio: "No offline audio found.",
        emptyQuizzes: "No quizzes.",
        emptyQuestions: "No saved questions.",
        emptyVocab: "No saved words.",
        startQuiz: "Start a New Quiz",
        createStory: "Write a Story"
    },
    studio: {
        student: "STUDENT HUB",
        creative: "LANGUAGE & CREATIVE",
        professional: "PROFESSIONAL SUITE",
        daily: "DAILY LIFE",
        custom: "MY CUSTOM ROLES",
        input: "INPUT",
        quickIdeas: "QUICK IDEAS",
        start: "Start",
        newRole: "New Role",
        addNew: "Add New"
    },
    quiz: {
        mode: "QUIZ MODE",
        practice: "Practice",
        exam: "Exam",
        instantFeedback: "Instant Feedback",
        resultsEnd: "Results at End",
        questions: "QUESTIONS",
        subject: "SUBJECT",
        quickTopics: "QUICK TOPICS",
        vision: "Vision",
        review: "Review",
        finish: "Finish",
        next: "Next",
        testAgain: "Test Again",
        close: "Close"
    },
    story: {
        title: "Story Generator",
        subtitle: "Write Novels, Epics, & Biographies",
        narrator: "Narrator",
        character: "Live Character",
        bookTitle: "Book Title / Topic",
        chapterTitle: "Chapter Title",
        genre: "Genre / Style",
        generate: "Generate Chapter",
        previous: "Previous",
        nextChapter: "Next Chapter"
    },
    settings: {
        cloud: "CLOUD API SETTINGS",
        getKey: "Get Free Gemini API Key",
        ai: "AI CAPABILITIES",
        priority: "Model Priority",
        tts: "Online TTS",
        images: "AI Images",
        customModel: "Custom Text Model",
        check: "Check Availability",
        language: "LANGUAGE & AUDIO",
        primaryLang: "PRIMARY LANGUAGE",
        female: "FEMALE NARRATORS",
        male: "MALE NARRATORS",
        speed: "READING SPEED",
        sleep: "Prevent Sleep",
        storage: "STORAGE & DATA",
        status: "System Status",
        limits: "DATA LIMITS",
        dictLimit: "Dictionary History",
        libLimit: "Library Limit",
        reset: "Reset All Data",
        backup: "FULL DATA BACKUP",
        backupBtn: "Backup All Data",
        restoreBtn: "Restore Data",
        rate: "Rate & Feedback",
        subscribe: "Subscribe on YouTube"
    },
    common: {
        cancel: "Cancel",
        delete: "Delete",
        error: "Error",
        success: "Success",
        loading: "Thinking..."
    }
};


export const VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Analyze Colors", prompt: "Analyze the color palette and artistic style." },
    { label: "Compare Images", prompt: "Compare and contrast the content of these images." },
    { label: "Creative Story", prompt: "Write a short, creative story inspired by these images." },
    { label: "Data Quiz", prompt: "Create a cohesive quiz based on this chart, graph, or arrangement." },
    { label: "Describe Detail", prompt: "Describe these images in detail." },
    { label: "Detect Emotion", prompt: "Analyze the emotions or mood depicted in the image." },
    { label: "Explain Concept", prompt: "Explain the main concept or diagram shown in simple terms." },
    { label: "Extract Text", prompt: "Extract all visible text from these images." },
    { label: "Historical Info", prompt: "Explain the historical context or significance of this image." },
    { label: "Identify Objects", prompt: "List the main objects and elements present." },
    { label: "Quiz Me", prompt: "Create a short quiz based on the content of these images." },
    { label: "Solve Problem", prompt: "Solve the problem or equation shown step-by-step." },
    { label: "Summarize", prompt: "Summarize the key points shown in these images." },
    { label: "To Text Note", prompt: "Convert this image content into a structured text note." },
    { label: "Translate", prompt: "Translate any text in these images to English." }
];

export const DOCUMENT_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Action Items", prompt: "List any action items or tasks mentioned." },
    { label: "Critique", prompt: "Provide a constructive critique of the writing." },
    { label: "Describe Details", prompt: "Describe this document in detail." },
    { label: "Draft Email", prompt: "Draft an email summarizing this document." },
    { label: "Explain Concept", prompt: "Explain the main concept described." },
    { label: "Extract Text", prompt: "Extract the raw text from this document." },
    { label: "Key Insights", prompt: "Extract the most important insights and findings." },
    { label: "Quiz Me", prompt: "Create a quiz based on this document's content." },
    { label: "Simplify", prompt: "Explain the content in simple terms." },
    { label: "Summarize", prompt: "Summarize the key points of this document." },
    { label: "To Text Note", prompt: "Convert this document content into a structured text note." },
    { label: "Translate", prompt: "Translate the document content." }
];

export const QUIZ_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Generate Quiz", prompt: "Create a comprehensive quiz based on the content of these images." },
    { label: "Similar Questions", prompt: "Create a quiz with questions that follow the same logic/pattern as the ones in the image, but with different values." },
    { label: "Extract Questions", prompt: "Extract the exact questions visible in these images and create a quiz from them." },
    { label: "Harder Version", prompt: "Create a significantly harder version of the quiz shown in these images." },
    { label: "Data Analysis", prompt: "Create a data interpretation quiz based on the charts, graphs, or tables in this image." },
    { label: "Concept Check", prompt: "Identify the core concepts in this image and create a conceptual quiz to test understanding." },
    { label: "True/False", prompt: "Create a True/False quiz based on the facts presented in these images." },
    { label: "Solve These", prompt: "Create a quiz where I have to solve the specific problems shown in the image." }
];

export const QUIZ_DOCUMENT_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Generate Quiz", prompt: "Create a comprehensive quiz based on the content of this document." },
    { label: "Mock Exam", prompt: "Create a mock exam based on the content covered in this document." },
    { label: "Extract Questions", prompt: "Extract the exact questions found in this document and create a quiz from them." },
    { label: "Reading Comp", prompt: "Create reading comprehension questions based on the text." },
    { label: "Key Concepts", prompt: "Identify the core concepts in this document and create a conceptual quiz." },
    { label: "True/False", prompt: "Create a True/False quiz based on the facts presented in this document." },
    { label: "Vocabulary", prompt: "Create a quiz testing definitions of key terms found in this document." },
    { label: "Summarize First", prompt: "Summarize the key points of the document, then create a quiz based on them." }
];

export const STORY_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Write Story", prompt: "Write a creative story inspired by these images." },
    { label: "Describe Scene", prompt: "Describe the scene in detail for a book chapter." },
    { label: "Character Bio", prompt: "Create a character biography based on the person in this image." },
    { label: "Autobiography", prompt: "Write an autobiography from the perspective of the main subject in this image/document." },
    { label: "Fantasy Lore", prompt: "Create a fantasy lore and backstory based on this visual." },
    { label: "Mystery Plot", prompt: "Write a mystery plot hook based on the details in this image." },
    { label: "Sci-Fi Concept", prompt: "Develop a sci-fi concept or technology description based on this image." },
    { label: "Dialogue", prompt: "Write a dialogue between the characters visible in this image." },
    { label: "Expand Story", prompt: "Use the content of this image/document as a base and expand it into a full narrative." },
    { label: "Complete Story", prompt: "Use the provided visual/text context as the beginning and write a complete ending to the story." },
    { label: "Detailed Story", prompt: "Analyze the visual elements and provide a detailed storytelling description of what is happening." },
    { label: "Extract Text", prompt: "Extract all visible text from this image." },
    { label: "Translate", prompt: "Translate any text in this image." }
];

export const SEARCH_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Identify", prompt: "Identify the main object, product, or landmark in this image and provide detailed information." },
    { label: "Solve Problem", prompt: "Solve the math problem or logic puzzle shown in this image step-by-step." },
    { label: "Translate", prompt: "Translate any visible text in this image to [Target Language]." },
    { label: "Extract Text", prompt: "Extract and output all visible text from this image." },
    { label: "Explain", prompt: "Explain the diagram, chart, or concept shown in this image simply." },
    { label: "Product Info", prompt: "Identify this product and list its key features, price range, and likely use cases." },
    { label: "Summary", prompt: "Summarize the content or scene shown in this image." },
    { label: "Landmark Info", prompt: "Identify this place or landmark and tell me its history and location." },
    { label: "Plant/Animal", prompt: "Identify the plant or animal species in this picture." },
    { label: "Read Handwriting", prompt: "Transcribe the handwritten text in this image." }
];

export const SEARCH_DOCUMENT_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Summarize", prompt: "Summarize the key points of this document." },
    { label: "Explain Concept", prompt: "Explain the main concept described in this document in simple terms." },
    { label: "Key Insights", prompt: "Extract the most important insights and findings from this text." },
    { label: "Action Items", prompt: "List any action items or tasks mentioned in this document." },
    { label: "Translate", prompt: "Translate the document content." },
    { label: "Simplify", prompt: "Rewrite the content in simple, easy-to-understand language." },
    { label: "Extract Text", prompt: "Extract the raw text from this document." }
];

export const STORY_DOCUMENT_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Summarize Story", prompt: "Summarize the narrative or story present in this document." },
    { label: "Continue Story", prompt: "Continue the story from where this document ends." },
    { label: "Rewrite Ending", prompt: "Rewrite the ending of the story found in this document." },
    { label: "Character Study", prompt: "Analyze the main characters described in this text." },
    { label: "Modern Retelling", prompt: "Retell the story in this document in a modern setting." },
    { label: "To Script", prompt: "Convert the narrative in this document into a screenplay/script format." },
    { label: "Change Tone", prompt: "Rewrite the content of this document with a darker or more humorous tone." },
    { label: "First Person", prompt: "Rewrite this text from a first-person perspective." },
    { label: "Extract Text", prompt: "Extract all text from this document." },
    { label: "Translate", prompt: "Translate the document content." }
];

export const EDITORIAL_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Social Commentary", prompt: "Write a social commentary about the issue depicted." },
    { label: "Opinion Piece", prompt: "Write a strong opinion piece based on this image." },
    { label: "Critique", prompt: "Provide a critical analysis of the subject shown." },
    { label: "Satire", prompt: "Write a satirical take on the situation in this image." },
    { label: "Investigative", prompt: "Write an investigative report hypothesis based on these visual clues." },
    { label: "Debate Topic", prompt: "Formulate a debate topic derived from this image and argue for one side." }
];

export const CUSTOM_ROLE_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Analyze", prompt: "Analyze this content strictly from the perspective of a [ROLE]." },
    { label: "Opinion", prompt: "What is your professional opinion on this as a [ROLE]?" },
    { label: "Advice", prompt: "Based on this, what advice would you give as a [ROLE]?" },
    { label: "Explain", prompt: "Explain this using your persona as a [ROLE]." },
    { label: "Critique", prompt: "Critique this based on the standards of a [ROLE]." },
    { label: "Identify", prompt: "Identify key elements relevant to your expertise as a [ROLE]." },
    { label: "Solve/Help", prompt: "Help me with the problem shown here, acting as a [ROLE]." },
    { label: "Step-by-Step", prompt: "Guide me through this visual step-by-step in your style." }
];

export const MATH_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Solve", prompt: "Solve this math problem step-by-step and provide the final answer." },
    { label: "Step-by-Step", prompt: "Break down the solution into clear, numbered steps." },
    { label: "Explain Logic", prompt: "Explain the mathematical concept and logic behind this problem." },
    { label: "Identify Formula", prompt: "Identify the formula or theorem used in this problem." },
    { label: "Geometry", prompt: "Solve for the missing angles or side lengths in this geometry problem." },
    { label: "Word Problem", prompt: "Extract the data from this word problem and solve it." },
    { label: "Graph Analysis", prompt: "Analyze this graph and interpret the function or data shown." },
    { label: "Simplify", prompt: "Simplify the expression shown in the image." }
];

export const WRITER_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Analyze Style", prompt: "Analyze the writing style and tone of this text." },
    { label: "Improve Flow", prompt: "Suggest improvements to the flow and readability." },
    { label: "Proofread", prompt: "Check for grammar and spelling errors." },
    { label: "Summarize", prompt: "Provide a concise summary of the content." },
];

export const WRITER_DOCUMENT_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Critique", prompt: "Provide a constructive critique of this document." },
    { label: "Edit", prompt: "Suggest edits to improve clarity and impact." },
    { label: "Expand", prompt: "Expand on the key points mentioned in the document." },
    { label: "Format", prompt: "Suggest formatting improvements for better readability." },
];

export const DOCTOR_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Identify Symptoms", prompt: "Identify any visible symptoms or conditions." },
    { label: "Medical Advice", prompt: "Provide general medical advice based on the image (Disclaimer: Consult a doctor)." },
    { label: "Analyze Report", prompt: "Explain the medical report or chart shown." },
];

export const DOCTOR_DOCUMENT_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Explain Terms", prompt: "Explain any complex medical terms found in the document." },
    { label: "Summarize Report", prompt: "Summarize the key findings of this medical report." },
    { label: " Drug Info", prompt: "Provide information about any medications mentioned." },
];

export const EMAIL_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Draft Reply", prompt: "Draft a professional reply to this email screenshot." },
    { label: "Extract Info", prompt: "Extract key contact information and dates." },
    { label: "Summarize", prompt: "Summarize the main points of the email." },
];

export const ORGANIZER_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Create Task List", prompt: "Create a task list based on the visual information." },
    { label: "Schedule Event", prompt: "Extract event details for scheduling." },
    { label: "Categorize", prompt: "Categorize the items or information shown." },
];

export const GREETINGS_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Identify Occasion", prompt: "Identify the occasion or event shown." },
    { label: "Suggest Greeting", prompt: "Suggest an appropriate greeting or message for this image." },
];

export const WORD_HELP_VISION_QUICK_ACTIONS: { label: string; prompt: string }[] = [
    { label: "Identify Words", prompt: "Identify any difficult words in the image." },
    { label: "Define", prompt: "Provide definitions for prominent words." },
    { label: "Synonyms", prompt: "Suggest synonyms for key words in the text." },
];


export const SUBJECT_QUICK_PROMPTS: { [key: string]: { label: string; prompt: string }[] } = {
    "General": [
        { label: "Animals", prompt: "Animal Kingdom Trivia" },
        { label: "Current Affairs", prompt: "Current World Events" },
        { label: "General Knowledge", prompt: "General Knowledge Trivia" },
        { label: "Inventions", prompt: "Famous Inventions" },
        { label: "Logic", prompt: "Logic Puzzles & Riddles" },
        { label: "Movies", prompt: "Cinema & Movies" },
        { label: "Personalities", prompt: "Famous Historical Figures" },
        { label: "Pop Culture", prompt: "Pop Culture & Entertainment" },
        { label: "Sports", prompt: "Sports & Athletics" },
        { label: "World Records", prompt: "Guinness World Records" }
    ],
    "English": [
        { label: "Active/Passive", prompt: "Active & Passive Voice" },
        { label: "Articles", prompt: "Articles (A, An, The)" },
        { label: "Cloze Test", prompt: "Cloze Test (Fill in the blanks)" },
        { label: "Conjunctions", prompt: "Conjunctions & Connectors" },
        { label: "Direct/Indirect", prompt: "Direct & Indirect Speech" },
        { label: "Error Spotting", prompt: "Spotting Grammatical Errors" },
        { label: "Figures of Speech", prompt: "Figures of Speech (Simile, Metaphor)" },
        { label: "Grammar", prompt: "English Grammar Rules" },
        { label: "Homophones", prompt: "Homophones & Homonyms" },
        { label: "Idioms", prompt: "Idioms & Phrases" },
        { label: "One Word", prompt: "One Word Substitution" },
        { label: "Para Jumbles", prompt: "Para Jumbles (Sentence Rearrangement)" },
        { label: "Phrasal Verbs", prompt: "Phrasal Verbs" },
        { label: "Prepositions", prompt: "Prepositions" },
        { label: "Reading Comp", prompt: "Reading Comprehension" },
        { label: "Sentence Imp.", prompt: "Sentence Improvement" },
        { label: "Spellings", prompt: "Spelling Correction" },
        { label: "Synonyms", prompt: "Synonyms & Antonyms" },
        { label: "Tenses", prompt: "Verb Tenses" },
        { label: "Unseen Passage", prompt: "Unseen Paragraph and Questions" },
        { label: "Vocabulary", prompt: "Advanced Vocabulary" }
    ],
    "Reasoning": [
        { label: "Analogies", prompt: "Verbal Analogies" },
        { label: "Blood Relations", prompt: "Blood Relations Logic" },
        { label: "Cause & Effect", prompt: "Cause and Effect Reasoning" },
        { label: "Classification", prompt: "Odd One Out Classification" },
        { label: "Clocks/Calendars", prompt: "Clocks and Calendars Problems" },
        { label: "Coding", prompt: "Coding & Decoding Patterns" },
        { label: "Critical", prompt: "Statement & Conclusion" },
        { label: "Data Sufficiency", prompt: "Data Sufficiency" },
        { label: "Decision Making", prompt: "Decision Making Logic" },
        { label: "Dice & Cubes", prompt: "Dice and Cubes Visualization" },
        { label: "Directions", prompt: "Direction Sense Test" },
        { label: "Inequalities", prompt: "Mathematical Inequalities" },
        { label: "Input-Output", prompt: "Machine Input-Output Logic" },
        { label: "Mirror Images", prompt: "Mirror and Water Images" },
        { label: "Number Series", prompt: "Number Series & Sequences" },
        { label: "Puzzles", prompt: "Logical Puzzles" },
        { label: "Ranking", prompt: "Ordering & Ranking" },
        { label: "Seating", prompt: "Seating Arrangement (Circular/Linear)" },
        { label: "Syllogism", prompt: "Syllogism & Logic" },
        { label: "Venn Diagrams", prompt: "Venn Diagrams & Set Logic" }
    ],
    "Art": [
        { label: "Art History", prompt: "History of Art & Movements" },
        { label: "Famous Artists", prompt: "Famous Artists & Their Works" },
        { label: "Modern Art", prompt: "Modern & Contemporary Art" },
        { label: "Painting", prompt: "Painting Techniques & Styles" },
        { label: "Sculptures", prompt: "Famous Sculptures & Sculptors" }
    ],
    "Basic Computer": [
        { label: "Hardware", prompt: "Computer Hardware Components" },
        { label: "Software", prompt: "Types of Software & Operating Systems" },
        { label: "Networking", prompt: "Basics of Computer Networking" },
        { label: "Internet", prompt: "Internet, Web Browsers & Email" },
        { label: "Shortcuts", prompt: "Common Keyboard Shortcuts" },
        { label: "Security", prompt: "Cybersecurity & Viruses" },
        { label: "MS Office", prompt: "Microsoft Office (Word, Excel, PPT)" }
    ],
    "Biology": [
        { label: "Cell Biology", prompt: "Cell Structure & Function" },
        { label: "Genetics", prompt: "DNA, RNA & Inheritance" },
        { label: "Human Anatomy", prompt: "Human Body Systems" },
        { label: "Botany", prompt: "Plant Life & Photosynthesis" },
        { label: "Zoology", prompt: "Animal Kingdom & Physiology" },
        { label: "Evolution", prompt: "Theory of Evolution & Selection" }
    ],
    "Chemistry": [
        { label: "Periodic Table", prompt: "Elements & Periodic Trends" },
        { label: "Organic", prompt: "Organic Chemistry & Carbon Compounds" },
        { label: "Reactions", prompt: "Chemical Reactions & Equations" },
        { label: "Acids & Bases", prompt: "pH Scale, Acids & Bases" },
        { label: "Matter", prompt: "States of Matter & Properties" }
    ],
    "Computer Science": [
        { label: "Algorithms", prompt: "Sorting & Searching Algorithms" },
        { label: "Data Structures", prompt: "Arrays, Lists, Trees & Graphs" },
        { label: "OS", prompt: "Operating System Concepts" },
        { label: "Networking", prompt: "TCP/IP & Network Protocols" },
        { label: "DBMS", prompt: "Database Management Systems" },
        { label: "Cybersecurity", prompt: "Network Security & Cryptography" }
    ],
    "Geography": [
        { label: "World Map", prompt: "Countries, Capitals & Borders" },
        { label: "Topography", prompt: "Mountains, Rivers & Deserts" },
        { label: "Climate", prompt: "Weather Patterns & Climate Zones" },
        { label: "Continents", prompt: "Facts about the Seven Continents" },
        { label: "Oceanography", prompt: "Oceans, Currents & Marine Life" }
    ],
    "History": [
        { label: "Ancient", prompt: "Ancient Civilizations (Egypt, Indus, etc.)" },
        { label: "Medieval", prompt: "Medieval History & Kingdoms" },
        { label: "World Wars", prompt: "World War I & World War II" },
        { label: "Renaissance", prompt: "The Renaissance & Scientific Revolution" },
        { label: "Modern", prompt: "Colonization & Independence Movements" }
    ],
    "Literature": [
        { label: "Classics", prompt: "Classical Literature & Epics" },
        { label: "Authors", prompt: "Famous Authors & Their Biographies" },
        { label: "Poetry", prompt: "Poetic Devices & Famous Poems" },
        { label: "Shakespeare", prompt: "Plays & Sonnets of Shakespeare" },
        { label: "Modern Fiction", prompt: "Contemporary Novels & Styles" }
    ],
    "Machine Learning": [
        { label: "Supervised", prompt: "Regression & Classification" },
        { label: "Unsupervised", prompt: "Clustering & Association" },
        { label: "Deep Learning", prompt: "Neural Networks & Architectures" },
        { label: "NLP", prompt: "Natural Language Processing" },
        { label: "Computer Vision", prompt: "Image Processing & Analysis" },
        { label: "Reinforcement", prompt: "Agent-based Learning & RL" }
    ],
    "Mathematics": [
        { label: "Algebra", prompt: "Equations, Expressions & Variables" },
        { label: "Calculus", prompt: "Limits, Derivatives & Integrals" },
        { label: "Geometry", prompt: "Shapes, Angles & Theorems" },
        { label: "Trigonometry", prompt: "Triangles & Trigonometric Functions" },
        { label: "Statistics", prompt: "Probability, Mean, Median & Mode" }
    ],
    "Physics": [
        { label: "Mechanics", prompt: "Newton's Laws & Motion" },
        { label: "Thermodynamics", prompt: "Heat, Energy & Entropy" },
        { label: "Optics", prompt: "Light, Lenses & Mirrors" },
        { label: "Electricity", prompt: "Circuits & Electromagnetism" },
        { label: "Quantum", prompt: "Atomic Theory & Particle Physics" }
    ],
    "Science": [
        { label: "Space Science", prompt: "Astronomy & Cosmology" },
        { label: "Environmental", prompt: "Ecology & Sustainability" },
        { label: "Forensics", prompt: "Crime Scene Science" },
        { label: "Microbiology", prompt: "Bacteria, Viruses & Fungi" }
    ],
};


export const DEFAULT_VOCABULARY: { word: string; definition: string; partOfSpeech: string; phonetic: string; simple: { definition: string; examples: string[] } }[] = [
    { word: "Altruism", definition: "The belief in or practice of disinterested and selfless concern for the well-being of others.", partOfSpeech: "Noun", phonetic: "/ˈæl.tru.ɪ.zəm/", simple: { definition: "Selfless helping of others.", examples: ["Donating anonymously is an act of altruism."] } } // Decrease preloaded dictionary word only 1 word.
];

export const TOOL_QUICK_PROMPTS: { [key: string]: { label: string; prompt: string }[] | { [key: string]: { label: string; prompt: string }[] } } = {
    "teacher": [
        { label: "Algebra", prompt: "Explain the basics of Algebra." },
        { label: "Black Holes", prompt: "Explain Black Holes simply." },
        { label: "Blockchain", prompt: "Explain how Blockchain works." },
        { label: "Calculus", prompt: "Explain the fundamental theorem of Calculus." },
        { label: "Chemistry", prompt: "Explain the Periodic Table trends." },
        { label: "Critical Thinking", prompt: "Teach me how to think critically." },
        { label: "Democracy", prompt: "Explain the concept of Democracy." },
        { label: "Economics", prompt: "Explain Supply and Demand." },
        { label: "Evolution", prompt: "Explain the Theory of Evolution." },
        { label: "Feynman Technique", prompt: "Explain the Feynman Technique for learning." },
        { label: "Financial Lit", prompt: "Explain Compound Interest." },
        { label: "Genetics", prompt: "Explain DNA and Genetics." },
        { label: "Gravity", prompt: "Explain Newton's Law of Gravity." },
        { label: "Mental Math", prompt: "Teach me tricks for fast mental calculation." },
        { label: "Negotiation", prompt: "Teach me basic negotiation skills." },
        { label: "Philosophy", prompt: "Explain Stoicism." },
        { label: "Photosynthesis", prompt: "Explain Photosynthesis." },
        { label: "Psychology", prompt: "Explain Cognitive Dissonance." },
        { label: "Public Speaking", prompt: "Teach me how to give a good speech." },
        { label: "Quantum Physics", prompt: "Explain the basics of Quantum Physics." },
        { label: "Shakespeare", prompt: "Explain the significance of Hamlet." },
        { label: "Statistics", prompt: "Explain Mean, Median, and Mode." },
        { label: "Time Mgmt", prompt: "Teach me the Pomodoro technique." },
        { label: "World War II", prompt: "Explain the causes of World War II." }
    ],
    "ai_for_everyone": [
        { label: "Agriculture", prompt: "How does AI help farmers monitor crops?" },
        { label: "Algorithms", prompt: "How do social media algorithms know what I like?" },
        { label: "Art", prompt: "How do AI art generators create images from text?" },
        { label: "Autonomous Cars", prompt: "How do self-driving cars see the road?" },
        { label: "Banking", prompt: "How does AI detect fraud in banking?" },
        { label: "Customer Service", prompt: "How do AI chatbots understand my problems?" },
        { label: "E-Commerce", prompt: "How do online stores recommend products?" },
        { label: "Education", prompt: "How is AI personalizing learning for students?" },
        { label: "Email", prompt: "How do spam filters work?" },
        { label: "Face ID", prompt: "How does Facial Recognition work on my phone?" },
        { label: "Finance", prompt: "How does AI predict stock market trends?" },
        { label: "Gaming", prompt: "How is AI used in video games for NPCs?" },
        { label: "Healthcare", prompt: "How does AI help doctors diagnose diseases?" },
        { label: "Language", prompt: "How does AI help in learning new languages?" },
        { label: "Manufacturing", prompt: "How are robots using AI in factories?" },
        { label: "Navigation", prompt: "How does Google Maps predict traffic?" },
        { label: "Photography", prompt: "How does my phone camera enhance photos automatically?" },
        { label: "Security", prompt: "How does AI analyze security camera footage?" },
        { label: "Smart Home", prompt: "How do smart thermostats learn my schedule?" },
        { label: "Social Media", prompt: "How does AI filter harmful content online?" },
        { label: "Streaming", prompt: "How does Netflix know what movies I'll like?" },
        { label: "Translation", prompt: "How does Google Translate work instantly?" },
        { label: "Transportation", prompt: "How do ride-sharing apps optimize routes?" },
        { label: "Voice Assistants", prompt: "How do Siri and Alexa understand me?" },
        { label: "Weather", prompt: "How does AI improve weather forecasting?" }
    ],
    "ml_tutor": [
        // Level 1: Foundations
        { label: "History of AI", prompt: "Summarize the History of Artificial Intelligence." },
        { label: "ML Basics", prompt: "Explain the fundamental paradigms of Machine Learning. Use [[CONCEPT_CARD]] for key definitions." },
        { label: "Supervised", prompt: "Explain Supervised Learning algorithms (Regression, Classification)." },
        { label: "Unsupervised", prompt: "Explain Unsupervised Learning and Dimensionality Reduction." },
        { label: "Reinforcement", prompt: "Explain Reinforcement Learning (RL) and Q-Learning. Use [[CONCEPT_CARD]] for the Bellman equation." },
        { label: "Overfitting", prompt: "Explain Overfitting, Underfitting, and Regularization." },
        { label: "Gradient Descent", prompt: "Explain Gradient Descent optimization and its variants (Adam, SGD). Use [[CONCEPT_CARD]] for the update rule." },
        { label: "Bias & Ethics", prompt: "Explain Bias, Fairness, and Ethics in AI systems." },
        // Level 2: Core Algorithms & Neural Networks
        { label: "Clustering", prompt: "Explain K-Means and Hierarchical Clustering algorithms." },
        { label: "SVMs", prompt: "Explain Support Vector Machines (SVMs). Use [[CONCEPT_CARD]] for the hyperplane formula." },
        { label: "Neural Networks", prompt: "Explain the anatomy and math of Neural Networks. Use [[CONCEPT_CARD]] for activation functions." },
        { label: "Backprop", prompt: "Explain the Backpropagation algorithm in Neural Networks. Use [[CONCEPT_CARD]] for chain rule." },
        { label: "Deep Learning", prompt: "Explain Deep Learning fundamentals and how it differs from ML." },
        { label: "CNNs", prompt: "Explain Convolutional Neural Networks (CNNs) and their layers." },
        { label: "RNNs", prompt: "Explain Recurrent Neural Networks (RNNs)." },
        { label: "LSTM/GRU", prompt: "Explain LSTMs and GRUs for sequence modeling." },
        // Level 3: Advanced Architectures & NLP
        { label: "NLP", prompt: "Explain Natural Language Processing (NLP) core tasks." },
        { label: "Embeddings", prompt: "Explain Vector Embeddings and semantic search." },
        { label: "Transformers", prompt: "Explain the Transformer architecture (Encoder/Decoder). Use [[CONCEPT_CARD]] for Attention mechanism." },
        { label: "Attention", prompt: "Explain the Self-Attention mechanism in Transformers. Use [[CONCEPT_CARD]] for Q, K, V formulas." },
        { label: "LLMs", prompt: "Explain the architecture and training of Large Language Models." },
        { label: "RAG", prompt: "Explain Retrieval-Augmented Generation (RAG) systems." },
        { label: "Fine-Tuning", prompt: "Explain Fine-Tuning, PEFT, and LoRA techniques." },
        { label: "Prompt Eng.", prompt: "Explain detailed Prompt Engineering strategies for developers." },
        // Level 4: Generative AI & Specialized
        { label: "Computer Vision", prompt: "Explain the core concepts and tasks in Computer Vision." },
        { label: "GANs", prompt: "Explain Generative Adversarial Networks (GANs) architecture. Use [[CONCEPT_CARD]] for loss functions." },
        { label: "Diffusion", prompt: "Explain how Diffusion Models (like Stable Diffusion) work." },
        { label: "Data Augmentation", prompt: "Explain Data Augmentation techniques for image and text." },
        { label: "Agents", prompt: "Explain Autonomous AI Agents and their architectures." },
        { label: "XAI", prompt: "Explain Explainable AI (XAI) and interpretability tools (SHAP, LIME)." },
        { label: "Model Deploy", prompt: "Explain ML Model Deployment strategies (ONNX, Docker, Serving)." }
    ],
    "ai_usage": [
        { label: "Brainstorming", prompt: "How to use AI to generate creative ideas for a project?" },
        { label: "Budgeting", prompt: "How to use AI to create a monthly budget plan?" },
        { label: "Conflict Resolution", prompt: "How to use AI to roleplay difficult conversations?" },
        { label: "Cooking", prompt: "How to use AI for meal planning based on ingredients I have?" },
        { label: "DIY Projects", prompt: "How to use AI to get step-by-step DIY instructions?" },
        { label: "Emails", prompt: "How to use AI to write and refine professional emails?" },
        { label: "Entertainment", prompt: "How to use AI to find movies similar to my favorites?" },
        { label: "Fitness", prompt: "How to use AI to create a personalized workout plan?" },
        { label: "Gardening", prompt: "How to use AI to identify plants and care for them?" },
        { label: "Gift Ideas", prompt: "How to use AI to find the perfect gift based on interests?" },
        { label: "Interview", prompt: "How to use AI to simulate a job interview?" },
        { label: "Learning", prompt: "How to use AI as a personal language tutor?" },
        { label: "Mental Health", prompt: "How to use AI for daily journaling and reflection?" },
        { label: "Negotiation", prompt: "How to use AI to practice salary negotiation?" },
        { label: "Scheduling", prompt: "How to use AI to organize my daily schedule?" },
        { label: "Shopping", prompt: "How to use AI to compare products and find deals?" },
        { label: "Study", prompt: "How to use AI to summarize long PDFs or articles?" },
        { label: "Time Mgmt", prompt: "How to use AI to prioritize tasks using the Eisenhower Matrix?" },
        { label: "Travel", prompt: "How to use AI to plan a complete vacation itinerary?" },
        { label: "Writing", prompt: "How to use AI to overcome writer's block?" }
    ],
    "prompt_engineer": [
        // Level 1: Fundamentals
        { label: "Zero-Shot", prompt: "Explain Zero-Shot Prompting." },
        { label: "Persona", prompt: "Explain Persona/Role-based prompting." },
        { label: "Context", prompt: "Explain the importance of Context in prompting." },
        { label: "Delimiters", prompt: "How to use delimiters (like triple quotes or XML tags) to structure prompts?" },
        { label: "Format Output", prompt: "How to force specific output formats (JSON/CSV)?" },

        // Level 2: Core Techniques
        { label: "Few-Shot", prompt: "Explain Few-Shot Prompting with examples." },
        { label: "Chain of Thought", prompt: "Explain Chain of Thought (CoT) prompting." },
        { label: "Step-by-Step", prompt: "Why does 'Let's think step by step' work?" },
        { label: "Constraints", prompt: "How to effectively use constraints in prompts?" },
        { label: "Iterative Refinement", prompt: "Explain the iterative prompting process for better results." },

        // Level 3: Advanced Strategies
        { label: "Self-Consistency", prompt: "Explain Self-Consistency prompting." },
        { label: "Tree of Thoughts", prompt: "Explain Tree of Thoughts (ToT) prompting." },
        { label: "Generated Knowledge", prompt: "Explain Generated Knowledge Prompting." },
        { label: "Least-to-Most", prompt: "Explain Least-to-Most prompting technique." },
        { label: "Meta-Prompting", prompt: "What is Meta-Prompting and how to use it?" },

        // Level 4: System & Optimization
        { label: "System Prompts", prompt: "What are System Prompts and how do they differ from User prompts?" },
        { label: "Temperature", prompt: "Explain the 'Temperature' parameter in LLMs." },
        { label: "Hallucinations", prompt: "Techniques to reduce AI hallucinations." },
        { label: "Multi-Persona", prompt: "How to use Multi-Persona prompting for debate or critique?" },
        { label: "Refine Prompt", prompt: "Refine this prompt: 'Write a blog post about coffee'." }
    ],
    "grammar_guide": [
        // Unit 1: The Basics (Parts of Speech)
        { label: "Nouns", prompt: "Explain Countable vs Uncountable Nouns." },
        { label: "Pronouns", prompt: "Explain Subject and Object Pronouns." },
        { label: "Verbs", prompt: "Explain Regular vs Irregular Verbs." },
        { label: "Adjectives", prompt: "Explain Order of Adjectives" },
        { label: "Adverbs", prompt: "Explain the function and placement of Adverbs." },
        // Unit 2: Sentence Structure
        { label: "Articles", prompt: "Explain the use of A, An, and The." },
        { label: "Prepositions", prompt: "Explain Prepositions of Place" },
        { label: "Conjunctions", prompt: "Explain Coordinating and Subordinating Conjunctions." },
        { label: "Subject-Verb", prompt: "Explain Subject-Verb Agreement rules." },
        // Unit 3: Tenses & Modes
        { label: "Tenses", prompt: "Explain Past Perfect Tense" },
        { label: "Modals", prompt: "Explain Modal Verbs (Can, Could, Should)." },
        { label: "Passive Voice", prompt: "Explain Passive vs Active Voice" },
        { label: "Gerunds", prompt: "Explain Gerunds vs Infinitives." },
        // Unit 4: Advanced Composition
        { label: "Conditionals", prompt: "Explain Zero and First Conditionals" },
        { label: "Punctuation", prompt: "Explain the use of Semicolons" }
    ],
    "idiom_guide": [
        { label: "Business", prompt: "Teach me 3 popular business idioms used in the workplace." },
        { label: "Emotions", prompt: "Teach me 3 idioms used to describe strong emotions." },
        { label: "Animals", prompt: "Teach me 3 funny idioms involving animals." },
        { label: "Time", prompt: "Teach me 3 useful idioms related to time." },
        { label: "Weather", prompt: "Teach me 3 common idioms related to weather." },
        { label: "Food", prompt: "Teach me 3 interesting idioms involving food." },
        { label: "Colors", prompt: "Teach me 3 idioms related to colors." },
        { label: "Relationships", prompt: "Teach me 3 idioms about friendship and relationships." },
        { label: "Success", prompt: "Teach me 3 idioms about success and failure." },
        { label: "Random", prompt: "Teach me 3 random, interesting English idioms." },
        { label: "Body Parts", prompt: "Teach me 3 idioms involving body parts (e.g., 'Cold feet')." },
        { label: "Sports", prompt: "Teach me 3 idioms that originated from sports." },
        { label: "Music", prompt: "Teach me 3 idioms related to music." },
        { label: "Travel", prompt: "Teach me 3 idioms related to travel or movement." },
        { label: "Education", prompt: "Teach me 3 idioms related to school or learning." },
        { label: "Health", prompt: "Teach me 3 idioms about health and sickness." },
        { label: "Numbers", prompt: "Teach me 3 idioms involving numbers." },
        { label: "Nature", prompt: "Teach me 3 idioms involving nature or the outdoors." }
    ],
    "writer": [
        { label: "Application", prompt: "Write a formal Application for..." },
        { label: "Article", prompt: "Write a comprehensive Article about..." },
        { label: "Biography", prompt: "Write a biographical profile of..." },
        { label: "Blog Post", prompt: "Write an engaging Blog Post about..." },
        { label: "Case Study", prompt: "Write a Case Study analyzing..." },
        { label: "Cover Letter", prompt: "Write a professional Cover Letter for..." },
        { label: "Email", prompt: "Draft a professional Email regarding..." },
        { label: "Essay", prompt: "Write a structured Essay on..." },
        { label: "Feature Story", prompt: "Write a narrative Feature Story about..." },
        { label: "Future Outlook", prompt: "Write a speculative piece about the future of..." },
        { label: "How-To Guide", prompt: "Write a step-by-step Guide on..." },
        { label: "Letter", prompt: "Write a formal Letter to..." },
        { label: "News Report", prompt: "Write an objective News Report about..." },
        { label: "Opinion Piece", prompt: "Write a persuasive Opinion Piece arguing that..." },
        { label: "Review", prompt: "Write a balanced Review of..." },
        { label: "Speech", prompt: "Write an inspiring Speech about..." }
    ],
    "health_guide": [
        { label: "Symptom Check", prompt: "I am feeling [Symptoms]. What could this be?" },
        { label: "Cold/Flu", prompt: "I have a runny nose, sore throat, and mild fever. How should I treat it at home?" },
        { label: "Headache", prompt: "I have a throbbing headache. What are the likely causes and remedies?" },
        { label: "Stomach Pain", prompt: "I have a stomach ache after eating. Advise me on diet and relief." },
        { label: "Skin Rash", prompt: "I have a red, itchy rash. What are common causes and treatments?" },
        { label: "Insomnia", prompt: "I cannot sleep properly. Give me a medical plan to fix my sleep schedule." },
        { label: "Diet Plan", prompt: "Create a healthy diet plan for general well-being." },
        { label: "Anxiety", prompt: "I am feeling very anxious and stressed. Suggest coping mechanisms." },
        { label: "Fitness", prompt: "Suggest a beginner exercise routine for better heart health." },
        { label: "First Aid", prompt: "What are the immediate first aid steps for a minor burn/cut?" }
    ],

    "greetings_gen": {
        "greeting": [
            { label: "Birthday", prompt: "Write a touching birthday wish for a friend that also motivates them to achieve their goals this year." },
            { label: "Anniversary", prompt: "Write an anniversary message that celebrates love and motivates us to build a great future together." },
            { label: "New Year", prompt: "Write New Year wishes that inspire hope, resilience, and success for the coming year." },
            { label: "Get Well", prompt: "Write a get well message that encourages resilience and a strong recovery." },
            { label: "Diwali/Fest", prompt: "Write festival greetings that inspire light, positivity, and new beginnings." },
            { label: "Christmas", prompt: "Write Christmas wishes that inspire joy, kindness, and giving." },
            { label: "Eid", prompt: "Write Eid wishes that inspire peace, gratitude, and spiritual growth." },
            { label: "Thank You", prompt: "Write a thank you note that appreciates the gesture and motivates the person." },
            { label: "Promotion", prompt: "Write a congratulatory message for a promotion that inspires them to embrace new challenges." },
            { label: "Farewell", prompt: "Write a farewell message for a coworker that motivates them to conquer their new path." }
        ],
        "quote": [
            { label: "Success", prompt: "Generate 5 powerful motivational quotes about Success." },
            { label: "Hard Work", prompt: "Generate 5 inspiring quotes about Hard Work and Persistence." },
            { label: "Life", prompt: "Generate 5 deep philosophical quotes about Life." },
            { label: "Morning", prompt: "Generate 5 positive Good Morning quotes to start the day." },
            { label: "Failure", prompt: "Generate 5 encouraging quotes about overcoming Failure." },
            { label: "Confidence", prompt: "Generate 5 quotes to boost Self-Confidence." },
            { label: "Focus", prompt: "Generate 5 quotes about Focus and Discipline." },
            { label: "Change", prompt: "Generate 5 quotes about embracing Change." }
        ],
        "shayari": [
            { label: "Study Motivation", prompt: "Write a motivating Shayari about the importance of studying and hard work for students (in Hindi/Urdu style with English translation)." },
            { label: "Success (Jeet)", prompt: "Write an inspiring Shayari about achieving success (Jeet) through struggle." },
            { label: "Hard Work", prompt: "Write a powerful Shayari about the value of hard work (Mehnat) in student life." },
            { label: "Knowledge (Ilm)", prompt: "Write a beautiful Shayari about the power of knowledge (Ilm/Vidya)." },
            { label: "Dreams", prompt: "Write an encouraging Shayari about chasing dreams and ambitions." },
            { label: "Focus", prompt: "Write a Shayari about staying focused and avoiding distractions." },
            { label: "Teacher (Guru)", prompt: "Write a respectful Shayari dedicated to Teachers (Guru/Ustad)." },
            { label: "Never Give Up", prompt: "Write a Shayari about resilience and never giving up during exams." }
        ]
    },


    "study_planner": [
        { label: "Python (2 Weeks)", prompt: "Create a 2-week curriculum to learn Python basics from scratch." },
        { label: "Exam Cram (3 Days)", prompt: "Create a 3-day emergency revision plan for an upcoming History/Science exam." },
        { label: "Web Dev (1 Month)", prompt: "Create a 1-month roadmap to learn HTML, CSS, and JavaScript basics." },
        { label: "Language Basics", prompt: "Create a 14-day plan to learn conversational Spanish/French for travel." },
        { label: "Data Science", prompt: "Create a 3-month comprehensive roadmap for getting started with Data Science." },
        { label: "Calculus Review", prompt: "Create a 5-day refresher plan for key Calculus I concepts." },
        { label: "SAT Prep", prompt: "Create a 4-week study schedule for SAT preparation." },
        { label: "Public Speaking", prompt: "Create a 1-week practical plan to improve public speaking skills." },
        { label: "Machine Learning", prompt: "Create a 6-week roadmap to learn the fundamentals of Machine Learning." },
        { label: "Photography", prompt: "Create a 10-day plan to master the basics of digital photography." }
    ],
    "math_solver": [
        { label: "Algebra", prompt: "Solve for x: 3x - 7 = 14. Use [[CONCEPT_CARD]] for the solution steps." },
        { label: "Derivative", prompt: "Calculate the derivative of f(x) = 3x^2 + 5x. Use [[CONCEPT_CARD]] for the rules used." },
        { label: "Pythagoras", prompt: "Find the hypotenuse of a right triangle with sides 3 and 4. Use [[CONCEPT_CARD]] for the calculation." },
        { label: "Statistics", prompt: "Calculate the Mean, Median, and Mode of: 5, 2, 8, 2, 9." },
        { label: "Quadratic", prompt: "Solve x^2 - 5x + 6 = 0 using the quadratic formula. Use [[CONCEPT_CARD]] for the formula." },
        { label: "Fractions", prompt: "Calculate 3/4 + 2/5 and simplify. Use [[CONCEPT_CARD]] for steps." },
        { label: "Trig", prompt: "Calculate the value of sin(30°) + cos(60°)." },
        { label: "Geometry", prompt: "Calculate the area of a circle with radius 5. Use [[CONCEPT_CARD]] for the formula." },
        { label: "Matrix", prompt: "Multiply matrices: [[1, 2], [3, 4]] * [[1, 0], [0, 1]]. Use [[CONCEPT_CARD]] for the matrix." },
        { label: "Logarithms", prompt: "Evaluate log10(1000)." }
    ],
    "debate_coach": [
        { label: "Trending News", prompt: "Pick a random, controversial topic from recent global news (Politics, Environment, Economics, or Society). Generate a debate on it." },
        { label: "AI Safety", prompt: "Debate Topic: Artificial Intelligence is a threat to humanity." },
        { label: "Remote Work", prompt: "Debate Topic: Remote work is better than office work." },
        { label: "Social Media", prompt: "Debate Topic: Social media does more harm than good." },
        { label: "UBI", prompt: "Debate Topic: Universal Basic Income is necessary for the future." },
        { label: "Space Exp.", prompt: "Debate Topic: Space exploration is a waste of resources vs essential for survival." },
        { label: "Climate", prompt: "Debate Topic: Individual action vs Corporate regulation for Climate Change." },
        { label: "Education", prompt: "Debate Topic: Traditional college degrees are becoming obsolete." },
        { label: "Privacy", prompt: "Debate Topic: Privacy is dead in the digital age." },
        { label: "Genetic Eng.", prompt: "Debate Topic: Genetic engineering of humans should be banned." },
        { label: "Nuclear", prompt: "Debate Topic: Nuclear energy is the greenest solution." }
    ],

};

export const LANGUAGE_CODES: { [key: string]: string } = {
    "English": "en-US",
    "Hindi": "hi-IN",
    "Spanish": "es-ES",
    "French": "fr-FR",
    "German": "de-DE",
    "Italian": "it-IT",
    "Japanese": "ja-JP",
    "Korean": "ko-KR",
    "Chinese": "zh-CN",
    "Russian": "ru-RU",
    "Portuguese": "pt-BR",
    "Arabic": "ar-SA",
    "Dutch": "nl-NL",
    "Swedish": "sv-SE",
    "Turkish": "tr-TR"
};

export const THEMES: { [key: string]: any } = {
    day: { id: 'day', label: 'Day', bg: "#ffffff", text: "#1a1a1a", secondary: "#555555", uiBg: "#f8f9fa", border: "#e9ecef", highlight: "#e7f5ff", buttonBg: "#f1f3f5", bubbleUser: "#2563eb", bubbleAI: "#f8f9fa", inputBg: "#f1f3f5", logoBg: "#4f46e5", logoText: "#ffffff", toolColor: null, activeWord: "#bfdbfe", primary: "#2563eb", statusBarStyle: "light-content" },
    sepia: { id: 'sepia', label: 'E-Reader', bg: "#f8f1e3", text: "#5b4636", secondary: "#8c7b66", uiBg: "#f1eadd", border: "#e3dccf", highlight: "#e8dfce", buttonBg: "#e8dfce", bubbleUser: "#8c7b66", bubbleAI: "#f1eadd", inputBg: "#e3dccf", logoBg: "#8c7b66", logoText: "#f5e6d3", toolColor: ["#a89f91", "#8c7b66"], activeWord: "#d6cbb6", primary: "#8c7b66", statusBarStyle: "dark-content" },
    night: { id: 'night', label: 'Night', bg: "#000000", text: "#e5e5e5", secondary: "#a3a3a3", uiBg: "#121212", border: "#27272a", highlight: "#1f2937", buttonBg: "#18181b", bubbleUser: "#4b5563", bubbleAI: "#18181b", inputBg: "#18181b", logoBg: "#e5e5e5", logoText: "#000000", toolColor: ["#1f2937", "#374151"], activeWord: "#374151", primary: "#2563eb", statusBarStyle: "light-content" },
    midnight: { id: 'midnight', label: 'Midnight', bg: "#0f172a", text: "#cbd5e1", secondary: "#94a3b8", uiBg: "#1e293b", border: "#334155", highlight: "#1e293b", buttonBg: "#334155", bubbleUser: "#3b82f6", bubbleAI: "#1e293b", inputBg: "#0f172a", logoBg: "#cbd5e1", logoText: "#0f172a", toolColor: ["#1e293b", "#334155"], activeWord: "#3b82f6", primary: "#3b82f6", statusBarStyle: "light-content" },
    forest: { id: 'forest', label: 'Forest', bg: "#f0fdf4", text: "#14532d", secondary: "#166534", uiBg: "#dcfce7", border: "#bbf7d0", highlight: "#dcfce7", buttonBg: "#bbf7d0", bubbleUser: "#16a34a", bubbleAI: "#dcfce7", inputBg: "#f0fdf4", logoBg: "#166534", logoText: "#f0fdf4", toolColor: null, activeWord: "#86efac", primary: "#16a34a", statusBarStyle: "dark-content" },
    lavender: { id: 'lavender', label: 'Lavender', bg: "#faf5ff", text: "#581c87", secondary: "#7e22ce", uiBg: "#f3e8ff", border: "#e9d5ff", highlight: "#f3e8ff", buttonBg: "#e9d5ff", bubbleUser: "#9333ea", bubbleAI: "#f3e8ff", inputBg: "#faf5ff", logoBg: "#7e22ce", logoText: "#faf5ff", toolColor: null, activeWord: "#d8b4fe", primary: "#9333ea", statusBarStyle: "dark-content" },
    pink: { id: 'pink', label: 'Pink', bg: "#fdf2f8", text: "#831843", secondary: "#be185d", uiBg: "#fce7f3", border: "#fbcfe8", highlight: "#fce7f3", buttonBg: "#fbcfe8", bubbleUser: "#db2777", bubbleAI: "#fce7f3", inputBg: "#fdf2f8", logoBg: "#be185d", logoText: "#fdf2f8", toolColor: null, activeWord: "#f9a8d4", primary: "#db2777", statusBarStyle: "dark-content" },
    yellow: { id: 'yellow', label: 'Sunny', bg: "#fefce8", text: "#422006", secondary: "#a16207", uiBg: "#fef9c3", border: "#fde047", highlight: "#fef08a", buttonBg: "#fde047", bubbleUser: "#ca8a04", bubbleAI: "#fef9c3", inputBg: "#fefce8", logoBg: "#ca8a04", logoText: "#ffffff", toolColor: null, activeWord: "#fde047", primary: "#ca8a04", statusBarStyle: "dark-content" },
    // NEW THEMES
    coffee: { id: 'coffee', label: 'Coffee', bg: "#201a16", text: "#d6c4b0", secondary: "#8a7b6b", uiBg: "#2c241f", border: "#3e322b", highlight: "#2c241f", buttonBg: "#3e322b", bubbleUser: "#a67c52", bubbleAI: "#2c241f", inputBg: "#2c241f", logoBg: "#a67c52", logoText: "#201a16", toolColor: ["#2c241f", "#3e322b"], activeWord: "#43302b", primary: "#a67c52", statusBarStyle: "light-content" },
    nord: { id: 'nord', label: 'Nord', bg: "#2e3440", text: "#d8dee9", secondary: "#81a1c1", uiBg: "#3b4252", border: "#4c566a", highlight: "#3b4252", buttonBg: "#434c5e", bubbleUser: "#88c0d0", bubbleAI: "#3b4252", inputBg: "#3b4252", logoBg: "#88c0d0", logoText: "#2e3440", toolColor: ["#3b4252", "#434c5e"], activeWord: "#434c5e", primary: "#88c0d0", statusBarStyle: "light-content" },
    ocean: { id: 'ocean', label: 'Ocean', bg: "#f0f9ff", text: "#0c4a6e", secondary: "#0284c7", uiBg: "#e0f2fe", border: "#bae6fd", highlight: "#e0f2fe", buttonBg: "#bae6fd", bubbleUser: "#0ea5e9", bubbleAI: "#e0f2fe", inputBg: "#f0f9ff", logoBg: "#0284c7", logoText: "#f0f9ff", toolColor: null, activeWord: "#7dd3fc", primary: "#0284c7", statusBarStyle: "dark-content" },
    slate: { id: 'slate', label: 'Slate', bg: "#f8fafc", text: "#334155", secondary: "#64748b", uiBg: "#e2e8f0", border: "#cbd5e1", highlight: "#e2e8f0", buttonBg: "#cbd5e1", bubbleUser: "#475569", bubbleAI: "#e2e8f0", inputBg: "#f8fafc", logoBg: "#475569", logoText: "#f8fafc", toolColor: null, activeWord: "#94a3b8", primary: "#475569", statusBarStyle: "dark-content" },
};
