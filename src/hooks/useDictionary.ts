import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { extractJSON, generateId } from '../utils/textUtils';

// Constants
const SAVED_WORDS_LIMIT = 100;
const RECENT_SEARCHES_LIMIT = 50; // Performance-optimized limit

export interface UseDictionaryProps {
    callLLM: (prompt: string, systemRole: string, jsonMode?: boolean) => Promise<string>;
    displaySettings: any;
    displaySettingsRef: any;
    startQuiz: (mode: string, data?: any) => void;
    showWordModal: boolean;
    setShowWordModal: (show: boolean) => void;
    selectedWord: any;
    setSelectedWord: (word: any) => void;
    setIsDefining: (isDefining: boolean) => void;
    setWordData: (data: any) => void;
    modalLanguage: string;
    setModalLanguage: (lang: string) => void;
    activeTab: string;
}

export const useDictionary = ({
    callLLM,
    displaySettings,
    displaySettingsRef,
    startQuiz,
    showWordModal,
    setShowWordModal,
    selectedWord,
    setSelectedWord,
    setIsDefining,
    setWordData,
    modalLanguage,
    setModalLanguage,
    activeTab
}: UseDictionaryProps) => {
    // --- State ---
    const [dictionaryViewMode, setDictionaryViewMode] = useState('list');
    const [dictionaryInput, setDictionaryInput] = useState("");
    const [dictionaryResult, setDictionaryResult] = useState<any>(null);
    const [dictionaryCurrentWord, setDictionaryCurrentWord] = useState<any>("");
    const [isDictionaryLoading, setIsDictionaryLoading] = useState(false);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const [dictionaryCache, setDictionaryCache] = useState<any>({});
    const dictionaryCacheRef = useRef<any>({});

    const [savedWords, setSavedWords] = useState<any[]>([]);
    const savedWordsRef = useRef<any[]>([]);
    const [wordMap, setWordMap] = useState<Set<string>>(new Set());

    const [recentSearches, setRecentSearches] = useState<any[]>([]);
    const recentSearchesRef = useRef<any[]>([]);

    // --- References Sync ---
    useEffect(() => {
        dictionaryCacheRef.current = dictionaryCache;
    }, [dictionaryCache]);

    useEffect(() => {
        savedWordsRef.current = savedWords;
        // Build O(1) lookup set
        const m = new Set<string>();
        savedWords.forEach(w => {
            if (w.word) m.add(w.word.toLowerCase());
        });
        setWordMap(m);
    }, [savedWords]);

    useEffect(() => {
        recentSearchesRef.current = recentSearches;
    }, [recentSearches]);

    // --- File System Helpers ---
    const getRecentSearchesPath = () => FileSystem.documentDirectory + 'recentSearches.json';
    const getSavedWordsIndexPath = () => FileSystem.documentDirectory + 'dictionary_index.json';

    const saveRecentSearchesToFile = async (data: any) => {
        try {
            await FileSystem.writeAsStringAsync(getRecentSearchesPath(), JSON.stringify(data), { encoding: 'utf8' });
        } catch (e) {
            console.error("Failed to save recent searches to file", e);
        }
    };

    const loadRecentSearchesFromFile = async () => {
        try {
            const path = getRecentSearchesPath();
            const content = await FileSystem.readAsStringAsync(path, { encoding: 'utf8' });
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    };

    const loadWordFromFile = async (liteWord: any) => {
        if (!liteWord || !liteWord.id) return liteWord;
        if (liteWord.simple || liteWord.advanced) return liteWord;
        try {
            const docDir = FileSystem.documentDirectory;
            const fileName = `word_${liteWord.id}.json`;
            const fileUri = docDir + fileName;
            const content = await FileSystem.readAsStringAsync(fileUri);
            const fullData = JSON.parse(content);
            return { ...fullData, id: liteWord.id, timestamp: liteWord.timestamp };
        } catch (e) { }
        return liteWord;
    };

    // --- Core Dictionary Functions ---

    const fetchBatchDefinitions = async (words: string[], targetLang: string | null = null) => {
        if (!words || words.length === 0) return [];

        const userLanguages = displaySettings.availableLanguages && displaySettings.availableLanguages.length > 0
            ? displaySettings.availableLanguages
            : [displaySettings.language || "English"];

        let languageInstruction = "";
        if (userLanguages.length === 1) {
            languageInstruction = `Provide definitions and examples strictly in ${userLanguages[0]}.`;
        } else {
            const langsToInclude = userLanguages.join(' and ');
            languageInstruction = `Provide definitions and examples bilingually in ${langsToInclude}. Ensure definitions are SINGLE STRINGS (e.g. "Def 1 / Def 2"). Do NOT return objects for definitions.`;
        }

        const prompt = `
        Task: Analyze the following list of words: ${JSON.stringify(words)}.
        User's Available Languages: ${userLanguages.join(', ')}.
        ${languageInstruction}

        INSTRUCTION:
        For EACH word in the list, return a Dictionary Object.
        
        STRICT OUTPUT FORMAT:
        Return a single JSON Array containing an object for each word.
        [
          {
            "word": "Base form",
            "simple": { "definition": "...", "examples": [...] },
            "advanced": { "definition": "...", "examples": [...], "collocations": [...], "nuances": "..." },
            "phonetic": "...",
            "partOfSpeech": "...",
            "forms": string[],
            "synonyms": string[],
            "antonyms": string[]
          },
          ...
        ]
        `;

        try {
            const raw = await callLLM(prompt, "Dictionary", true);
            if (!raw || raw.startsWith("Error")) {
                console.error("Dictionary lookup failed.");
                return [];
            }

            const cleanJson = extractJSON(raw);
            const parsed = JSON.parse(cleanJson);

            const sanitized = Array.isArray(parsed) ? parsed.map((item: any) => {
                if (item.simple && typeof item.simple.definition === 'object') {
                    item.simple.definition = Object.values(item.simple.definition).join(' / ');
                }
                if (item.advanced && typeof item.advanced.definition === 'object') {
                    item.advanced.definition = Object.values(item.advanced.definition).join(' / ');
                }
                return item;
            }) : [];

            return sanitized;
        } catch (e: any) {
            console.error("Batch Dictionary Error", e);
            return [];
        }
    };

    const getDictionaryData = async (word: string, targetLang: any = null) => {
        try {
            const results = await fetchBatchDefinitions([word]);
            return (results && results.length > 0) ? results[0] : { error: "Definition not found" };
        } catch (error: any) {
            console.error("getDictionaryData Error:", error);
            return { error: error.message || "Could not define. Please try again." };
        }
    };

    const updateRecentSearchesOrchestrator = async (newItems: any[], skipStateUpdate: boolean = false) => {
        recentSearchesRef.current = newItems;
        await saveRecentSearchesToFile(newItems);
        if (!skipStateUpdate) {
            setRecentSearches(newItems);
        }
    };

    const handleDictionaryTabSearch = async (word: string) => {
        if (!word.trim()) return;
        const lowerWord = word.trim().toLowerCase();
        Keyboard.dismiss();
        setDictionaryInput("");

        const checkDataMatch = (data: any) => {
            if (!data) return false;
            if (data.word && data.word.toLowerCase() === lowerWord) return true;
            if (data.forms && Array.isArray(data.forms) && data.forms.some((f: any) => typeof f === 'string' && f.toLowerCase() === lowerWord)) return true;
            return false;
        };

        let cachedData: any = Object.values(dictionaryCache).find(d => checkDataMatch(d));

        if (!cachedData) {
            const liteMatch = savedWords.find(w => checkDataMatch(w));
            if (liteMatch) cachedData = await loadWordFromFile(liteMatch);
        }

        if (!cachedData) {
            const recentItem = recentSearches.find(item => {
                const d = typeof item === 'object' ? item.data : null;
                return checkDataMatch(d);
            });
            if (recentItem) cachedData = recentItem.data;
        }

        const updateHistory = (fullData: any) => {
            const rootWord = fullData.word || word;
            const currentMaster = recentSearchesRef.current;
            const filtered = currentMaster.filter((w: any) => {
                const existingWord = typeof w === 'string' ? w : w.word;
                return existingWord.toLowerCase() !== rootWord.toLowerCase();
            });
            const limit = displaySettingsRef.current?.dictionaryLimit || RECENT_SEARCHES_LIMIT;
            const updated = [{ word: rootWord, data: fullData }, ...filtered].slice(0, limit);
            updateRecentSearchesOrchestrator(updated);
        };

        if (cachedData && !cachedData.error) {
            setDictionaryResult(cachedData);
            setDictionaryCurrentWord(cachedData.word || word);
            updateHistory(cachedData);
            return;
        }

        setIsDictionaryLoading(true);
        setDictionaryResult(null);
        const data = await getDictionaryData(word);
        const completeData = { ...data, word: data.word || word };
        setDictionaryResult(completeData);
        setDictionaryCurrentWord(completeData.word);
        setIsDictionaryLoading(false);
        if (!data.error) {
            setDictionaryCache((prev: any) => ({ ...prev, [lowerWord]: completeData }));
            updateHistory(completeData);
        }
    };

    const handleWordLookup = async (word: string) => {
        if (!word) return;
        const cleanWordInput = word.trim();
        setSelectedWord({ word: cleanWordInput });
        setShowWordModal(true);
        setIsDefining(true);
        setWordData(null);
        setDictionaryViewMode('advanced');
        setModalLanguage(displaySettingsRef.current?.language);

        const lowerWord = cleanWordInput.toLowerCase();
        const checkDataMatch = (data: any) => {
            if (!data) return false;
            if (data.word && data.word.toLowerCase() === lowerWord) return true;
            if (data.forms && Array.isArray(data.forms) && data.forms.some((f: any) => typeof f === 'string' && f.toLowerCase() === lowerWord)) return true;
            return false;
        };

        let cachedData = null;
        const liteMatch = savedWordsRef.current.find(w => checkDataMatch(w));
        if (liteMatch) cachedData = await loadWordFromFile(liteMatch);
        if (!cachedData) cachedData = Object.values(dictionaryCacheRef.current).find(d => checkDataMatch(d));
        if (!cachedData) {
            const recentItem = recentSearchesRef.current.find(item => {
                const d = typeof item === 'object' ? item.data : null;
                return checkDataMatch(d);
            });
            if (recentItem) cachedData = recentItem.data;
        }

        const updateHistory = (fullData: any) => {
            const rootWord = fullData.word || cleanWordInput;
            const currentMaster = recentSearchesRef.current;
            const filtered = currentMaster.filter((w: any) => {
                const existingWord = typeof w === 'string' ? w : w.word;
                return existingWord.toLowerCase() !== rootWord.toLowerCase();
            });
            const limit = displaySettingsRef.current?.dictionaryLimit || RECENT_SEARCHES_LIMIT;
            const updated = [{ word: rootWord, data: fullData }, ...filtered].slice(0, limit);
            updateRecentSearchesOrchestrator(updated, true);
        };

        if (cachedData && !cachedData.error) {
            setWordData(cachedData);
            setIsDefining(false);
            updateHistory(cachedData);
            return;
        }

        try {
            const data = await getDictionaryData(cleanWordInput);
            const completeData = { ...data, word: data.word || cleanWordInput };
            setWordData(completeData);
            setIsDefining(false);
            if (!data.error) {
                setDictionaryCache((prev: any) => ({ ...prev, [lowerWord]: completeData }));
                updateHistory(completeData);
            }
        } catch (e) {
            setIsDefining(false);
            setWordData({ error: "Search failed" });
        }
    };

    const handleRefreshDefinition = async (wordToRefresh: string) => {
        if (!wordToRefresh) return;
        const isModal = showWordModal;
        if (isModal) {
            setIsDefining(true);
            setWordData(null);
        } else {
            setIsDictionaryLoading(true);
            setDictionaryResult(null);
        }

        try {
            const targetLang = isModal ? modalLanguage : displaySettings.language;
            const data = await getDictionaryData(wordToRefresh, targetLang);
            const cleanData = { ...data, word: data.word || wordToRefresh };
            const completeData = {
                ...cleanData,
                language: targetLang,
                translations: { [targetLang]: cleanData }
            };

            if (!data.error) {
                const lower = wordToRefresh.trim().toLowerCase();
                setDictionaryCache((prev: any) => ({ ...prev, [lower]: completeData }));
                const filtered = recentSearches.filter(item => {
                    const w = typeof item === 'string' ? item : item.word;
                    return w.toLowerCase() !== lower;
                });
                const limit = displaySettingsRef.current?.dictionaryLimit || RECENT_SEARCHES_LIMIT;
                const updated = [{ word: completeData.word, data: completeData }, ...filtered].slice(0, limit);
                updateRecentSearchesOrchestrator(updated);
            }

            if (isModal) {
                setWordData(completeData);
                setIsDefining(false);
            } else {
                setDictionaryResult(completeData);
                setIsDictionaryLoading(false);
            }
        } catch (e) {
            console.error("Refresh failed", e);
            const errorData = { error: "Could not refresh definition." };
            if (isModal) {
                setWordData(errorData);
                setIsDefining(false);
            } else {
                setDictionaryResult(errorData);
                setIsDictionaryLoading(false);
            }
        }
    };

    const toggleSaveWord = async (word: any, def?: string, examples?: string[]) => {
        let wordToSave = "";
        let dataToSave: any = {};

        if (typeof word === 'object' && word !== null) {
            if (word.word && typeof word.word === 'string' && word.word.trim()) wordToSave = word.word;
            dataToSave = word;
            if (!dataToSave.definition && dataToSave.advanced?.definition) dataToSave.definition = dataToSave.advanced.definition;
            if ((!dataToSave.examples || dataToSave.examples.length === 0) && dataToSave.advanced?.examples) dataToSave.examples = dataToSave.advanced.examples;
        } else {
            wordToSave = word;
            dataToSave = { word: word, definition: def, examples: examples || [] };
        }

        if (!wordToSave || typeof wordToSave !== 'string' || !wordToSave.trim()) {
            if (showWordModal && selectedWord?.word) wordToSave = selectedWord.word;
            else if (activeTab === 'dictionary' && dictionaryCurrentWord) wordToSave = dictionaryCurrentWord;

            if (!wordToSave || typeof wordToSave !== 'string' || !wordToSave.trim()) {
                Alert.alert("Cannot Save", "The word text is missing.");
                return;
            }
        }

        dataToSave = { ...dataToSave, word: wordToSave };
        const existingIndexItem = savedWords.find(w => w.word.toLowerCase() === wordToSave.toLowerCase());

        if (existingIndexItem) {
            await deleteSavedWord(existingIndexItem.id);
        } else {
            let currentWords = savedWords;
            if (currentWords.length >= SAVED_WORDS_LIMIT) {
                await deleteSavedWord(currentWords[0].id);
                currentWords = currentWords.slice(1);
            }

            const id = generateId();
            const fullData = { id, ...dataToSave, timestamp: new Date().toISOString() };
            const liteData = {
                id,
                word: wordToSave,
                definition: fullData.simple?.definition || fullData.definition || "No definition",
                partOfSpeech: fullData.partOfSpeech,
                forms: fullData.forms || [],
                examples: fullData.examples || [],
                timestamp: fullData.timestamp
            };

            try {
                const docDir = FileSystem.documentDirectory;
                await FileSystem.writeAsStringAsync(docDir + `word_${id}.json`, JSON.stringify(fullData));
                const newWords = [...currentWords, liteData];
                setSavedWords(newWords);
                await FileSystem.writeAsStringAsync(getSavedWordsIndexPath(), JSON.stringify(newWords));
            } catch (e) {
                console.error("Failed to save word", e);
                Alert.alert("Error", "Could not save word.");
            }
        }
    };

    const deleteSavedWord = async (id: string) => {
        try {
            const docDir = FileSystem.documentDirectory;
            await FileSystem.deleteAsync(docDir + `word_${id}.json`, { idempotent: true });
            const newWords = savedWordsRef.current.filter(w => w.id !== id);
            setSavedWords(newWords);
            await FileSystem.writeAsStringAsync(getSavedWordsIndexPath(), JSON.stringify(newWords));
        } catch (e) {
            console.error("Error deleting word", e);
            Alert.alert("Error", "Could not delete word.");
        }
    };

    const deleteRecentSearch = (wordToDelete: string) => {
        Alert.alert(
            "Delete Word",
            `Remove "${wordToDelete}" from your personal dictionary?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: 'destructive',
                    onPress: async () => {
                        const updated = recentSearchesRef.current.filter(item => {
                            const w = typeof item === 'string' ? item : item.word;
                            return w.toLowerCase() !== wordToDelete.toLowerCase();
                        });
                        updateRecentSearchesOrchestrator(updated);
                    }
                }
            ]
        );
    };

    const isWordSaved = (word: string) => wordMap.has(word?.trim().toLowerCase());

    const handleWordQuiz = async (wordDataOverride?: any) => {
        const data = wordDataOverride || (showWordModal ? selectedWord : dictionaryResult);
        if (!data) return;
        const currentWord = data.word || (typeof data === 'string' ? data : "");
        if (!currentWord) return;

        let fullData = data;
        if (!data.simple && !data.advanced) {
            fullData = await loadWordFromFile(data);
        }
        startQuiz('word_focus', { word: currentWord, dictionaryData: fullData });
    };

    // --- Startup Synchronization ---
    useEffect(() => {
        const initDictionary = async () => {
            try {
                // 1. Load Recent Searches
                const loadedSearches = await loadRecentSearchesFromFile();
                if (loadedSearches) {
                    setRecentSearches(loadedSearches);
                    recentSearchesRef.current = loadedSearches;
                }

                // 2. Load Saved Words Index
                const savedPath = getSavedWordsIndexPath();
                const savedContent = await FileSystem.readAsStringAsync(savedPath).catch(() => null);
                if (savedContent) {
                    const parsed = JSON.parse(savedContent);
                    if (Array.isArray(parsed)) {
                        setSavedWords(parsed);
                        savedWordsRef.current = parsed;
                    }
                }
            } catch (e) {
                console.error("Failed to initialize dictionary", e);
            }
        };
        initDictionary();
    }, []);

    return {
        // State
        dictionaryViewMode,
        setDictionaryViewMode,
        dictionaryInput,
        setDictionaryInput,
        dictionaryResult,
        setDictionaryResult,
        dictionaryCurrentWord,
        setDictionaryCurrentWord,
        isDictionaryLoading,
        setIsDictionaryLoading,
        isBatchProcessing,
        setIsBatchProcessing,
        dictionaryCache,
        setDictionaryCache,
        savedWords,
        setSavedWords,
        wordMap,
        recentSearches,
        setRecentSearches,

        // Handlers
        handleDictionaryTabSearch,
        handleWordLookup,
        handleRefreshDefinition,
        toggleSaveWord,
        deleteSavedWord,
        deleteRecentSearch,
        isWordSaved,
        handleWordQuiz,
        fetchBatchDefinitions,
        getDictionaryData,
        loadWordFromFile,
        recentSearchesRef,
        savedWordsRef,
        updateRecentSearchesOrchestrator
    };
};
