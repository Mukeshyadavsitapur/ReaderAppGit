export interface Theme {
    id: string;
    bg: string;
    text: string;
    primary: string;
    secondary: string;
    highlight: string;
    uiBg: string;
    buttonBg: string;
    border: string;
    error: string;
    headerBg: string;
    headerText: string;
    badgeBg: string;
    badgeText: string;
    inputBg: string;
    logoBg: string;
    logoText: string;
    toolColor: string[] | null;
    activeWord: string;
    bubbleUser: string;
    bubbleAI: string;
    statusBarStyle: "light-content" | "dark-content";
}

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface Highlight {
    start: number;
    end: number;
    text: string;
    color: string;
    id: string;
}

export interface FlashcardItem {
    id: string;
    word: string;
    definition: string;
    timestamp?: string;
}

export interface ChatSession {
    id: string;
    toolId: string;
    title: string;
    timestamp: string;
    messages: Message[];
    pinned?: boolean;
    hasAudio?: boolean;
    image?: string;
    highlights?: Highlight[];
    items?: FlashcardItem[];
    // Properties used in App but optional in base interface
    images?: string[];
    score?: number;
    attempts?: number;
    completed?: boolean;
    currentIndex?: number;
    quizData?: any[];
    totalQuestions?: number;
    totalTime?: number;
    contentPath?: string;
    partNumber?: number;
    [key: string]: any;
}

export interface SavedQuestion {
    id: string;
    question: string;
    options?: string[];
    correctOptionIndex?: number;
    explanation?: string;
    visualPrompt?: string;
    visualUri?: string;
    timestamp: string;
}

export interface SavedWord {
    word: string;
    definition: string;
    timestamp: string;
    examples?: string[];
}

export interface DisplaySettings {
    theme: string;
    fontSize: number;
    fontFamily: string;
    textStyles: string[];
    language: string;
    voice: string;
    tapToDefine: boolean;
    questionsLimit?: number;
    userName?: string;
    userProfession?: string;
    userGoal?: string;
    userBio?: string;
    ttsRate?: number;
    availableLanguages?: string[];
    primaryLanguage?: string;
    onlineTtsEnabled?: boolean;
    imageGenerationEnabled?: boolean;
    modelPriority?: string;
    showPersonalDictionary?: boolean;
    customTextModel?: string;
    savedCustomModels?: any[];
    preventSleep?: boolean;
    dictionaryLimit?: number;
    libraryLimit?: number;
    keepLabelsEnglish?: boolean;
    nameLocked?: boolean;
    isExamMode?: boolean;
    quizTarget?: string;
    modeLocked?: boolean;
    isOnboarded?: boolean;
}

export interface QuizState {
    questions: SavedQuestion[];
    currentIndex: number;
    selectedOptions: (number | null)[];
    showExplanations: boolean[];
    translations?: Record<number, string>;
}

export interface FlashcardSession {
    items: FlashcardItem[];
    currentIndex: number;
    title?: string;
}

export interface AudioFile {
    id: string;
    name: string;
    uri: string;
    duration?: number;
    timestamp: string;
}

export interface Tool {
    id: string;
    title: string;
    emoji: string;
    prompt: string;
    color?: string;
    category?: string;
}

export interface LibraryGroup {
    id: string;
    isGroup: true;
    toolId?: string;
    title: string;
    items?: ChatSession[];
    chapters?: ChatSession[];
    timestamp: string;
    pinned: boolean;
    hasAudio: boolean;
    image?: string;
    count?: number;
}

export type LibraryItem = ChatSession | LibraryGroup;

export interface ReaderParagraph {
    id: string;
    type: 'text' | 'table' | 'concept-card';
    text?: string;
    rows?: string[];
    title?: string;
    content?: string;
    offset: number;
    initiallyHidden?: boolean;
    toggleLabel?: string;
    chapterName?: string;
}

export interface SpeechRange {
    start: number;
    end: number;
}

export interface StorageStats {
    free: number;
    used: number;
    audio: number;
}

export interface SimpleTableProps {
    rows: string[];
    theme: Theme;
    onExpand?: (data: string[]) => void;
    isFullScreen?: boolean;
    initiallyHidden?: boolean;
    toggleLabel?: string;
    fontSize?: number;
    initialCustomWidths?: Record<number, number>;
    onSaveWidths?: (colIndex: number, width: number | null) => void;
}

export interface ParsedTextProps {
    text: string;
    style?: any;
    theme: Theme;
    onExpand?: (data: string[]) => void;
}

export interface InteractiveTextProps {
    rawText: string;
    onWordPress?: (word: string) => void;
    onLinkPress?: (url: string) => void;
    style?: any;
    activeSentence?: SpeechRange | null;
    paragraphOffset?: number;
    theme: Theme;
    isHighlightMode?: boolean;
    highlights?: Highlight[];
    onHighlightPress?: (highlight: { start: number; end: number; text: string }) => void;
    tapToDefineEnabled?: boolean;
}

export interface ConceptCardProps {
    title?: string;
    subtitle?: string;
    content: string;
    theme: Theme;
    fontSize?: number;
    chapterName?: string;
    onSave?: (flashcard: any) => void;
}
