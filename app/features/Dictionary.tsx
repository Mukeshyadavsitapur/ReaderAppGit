import * as FileSystem from 'expo-file-system/legacy';
import { AlertTriangle, ArrowRight, BookA, BrainCircuit, Camera, Globe, History, Layers, Mic, Quote, RefreshCcw, ScrollText, Search, Star, Volume2, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DisplaySettings, Theme } from '../../src/types';
import { extractJSON, generateId } from '../../src/utils/textUtils';
import InteractiveText from '../components/InteractiveText';

// --- Constants ---
const SAVED_WORDS_LIMIT = 100;
const RECENT_SEARCHES_LIMIT = 50;

// --- Types ---
export interface UseDictionaryProps {
    callLLM: (contents: any, systemInstruction: any, jsonMode?: boolean, modelOverride?: string | null) => Promise<string>;
    displaySettings: any;
    displaySettingsRef: any;
    startQuiz: (topic: string, isCustomList?: boolean, subject?: string, isContextBasedInput?: boolean, images?: string[], overrideCount?: number | null, isFlashcardMode?: boolean) => void;
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

export interface DictionaryProps {
    theme: Theme;
    dictionaryInput: string;
    setDictionaryInput: (text: string) => void;
    dictionaryResult: any;
    dictionaryCurrentWord: string;
    isDictionaryLoading: boolean;
    savedWords: any[];
    recentSearches: any[];
    handleDictionaryTabSearch: (word: string) => void;
    handleWordLookup: (word: string) => void;
    deleteRecentSearch: (item: any) => void;
    toggleSaveWord: (wordData: any) => void;
    isWordSaved: (word: string) => boolean;
    startQuiz: (topic: string, isCustomList?: boolean, subject?: string) => void;
    refreshDefinition: (word: string) => void;
    speak: (text: string, rate?: number, forceLegacy?: boolean, forceGoogle?: boolean, purpose?: string) => void;
    setPlayingMeta: (meta: any) => void;
    primaryColor: string;
    handleVoiceToggle: (target: string) => void;
    isTranscribing: boolean;
    voiceTarget: string;
    isRecording: boolean;
    recordingOpacity: any;
    setImagePickerMode: (mode: string) => void;
    setVisionDraft: (draft: any) => void;
    setShowImageSourceModal: (show: boolean) => void;
    appMode: string;
    activeTab: string;
    displaySettings: DisplaySettings;
    isLandscape: boolean;
}

// --- Hook ---
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

    useEffect(() => {
        dictionaryCacheRef.current = dictionaryCache;
    }, [dictionaryCache]);

    useEffect(() => {
        savedWordsRef.current = savedWords;
        const m = new Set<string>();
        savedWords.forEach(w => {
            if (w.word) m.add(w.word.toLowerCase());
        });
        setWordMap(m);
    }, [savedWords]);

    useEffect(() => {
        recentSearchesRef.current = recentSearches;
    }, [recentSearches]);

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
        startQuiz(currentWord, true, "Dictionary");
    };

    useEffect(() => {
        const initDictionary = async () => {
            try {
                const loadedSearches = await loadRecentSearchesFromFile();
                if (loadedSearches) {
                    setRecentSearches(loadedSearches);
                    recentSearchesRef.current = loadedSearches;
                }
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

// --- Component ---
const getTypographyStyle = (fontFamily: string, textStyles: any) => {
    return { fontFamily };
};

export const Dictionary: React.FC<DictionaryProps> = ({
    theme,
    dictionaryInput,
    setDictionaryInput,
    dictionaryResult,
    dictionaryCurrentWord,
    isDictionaryLoading,
    savedWords,
    recentSearches,
    handleDictionaryTabSearch,
    handleWordLookup,
    deleteRecentSearch,
    toggleSaveWord,
    isWordSaved,
    startQuiz,
    refreshDefinition,
    speak,
    setPlayingMeta,
    primaryColor,
    handleVoiceToggle,
    isTranscribing,
    voiceTarget,
    isRecording,
    recordingOpacity,
    setImagePickerMode,
    setVisionDraft,
    setShowImageSourceModal,
    appMode,
    activeTab,
    displaySettings,
    isLandscape
}) => {
    const styles = StyleSheet.create({
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            paddingHorizontal: 10,
        },
        searchInput: {
            flex: 1,
            height: '100%',
        }
    });

    const renderDictionarySearchBar = ({ marginBottom = 15 }: { marginBottom?: number } = {}) => (
        <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.border, marginBottom: marginBottom, height: 50, borderRadius: 12 }]}>
            <TextInput
                style={[styles.searchInput, { color: theme.text, fontSize: 16, marginLeft: 10 }]}
                placeholder="Type a word..."
                placeholderTextColor={theme.secondary}
                value={dictionaryInput}
                onChangeText={setDictionaryInput}
                onSubmitEditing={() => {
                    if (dictionaryInput.trim()) handleDictionaryTabSearch(dictionaryInput.trim());
                }}
                autoCapitalize="none"
                returnKeyType="search"
            />

            <TouchableOpacity
                onPress={() => handleVoiceToggle('dictionary')}
                style={{
                    width: 38,
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 4
                }}
            >
                {isTranscribing && voiceTarget === 'dictionary' ? (
                    <ActivityIndicator size="small" color={theme.text} />
                ) : (
                    <Animated.View style={{ opacity: voiceTarget === 'dictionary' ? recordingOpacity : 1 }}>
                        <Mic size={20} color={(isRecording && voiceTarget === 'dictionary') ? '#ef4444' : theme.text} />
                    </Animated.View>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setImagePickerMode('dictionary_vision');
                    setVisionDraft({ uris: [], prompt: "" });
                    setShowImageSourceModal(true);
                }}
                style={{
                    width: 38,
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 4
                }}
            >
                <Camera size={20} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    if (dictionaryInput.trim()) handleDictionaryTabSearch(dictionaryInput.trim());
                }}
                style={{
                    width: 38,
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {dictionaryInput.trim().length > 0 ? (
                    <ArrowRight size={20} color={primaryColor} />
                ) : (
                    <Search size={20} color={theme.text} />
                )}
            </TouchableOpacity>
        </View>
    );

    const renderDefinitionContent = (data: any, word: string, isSaved: any, toggleSave: any, hideHeader = false, onStartQuiz: any = null, onRefresh: any = null) => {
        if (data?.error) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 20 }} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, textAlign: 'center', marginBottom: 10 }}>Connection Issue</Text>
                    <Text style={{ fontSize: 14, color: theme.secondary, textAlign: 'center' }}>{data.error}</Text>
                    {onRefresh && (
                        <TouchableOpacity
                            onPress={onRefresh}
                            style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.buttonBg, padding: 12, borderRadius: 12 }}
                        >
                            <RefreshCcw size={18} color={theme.text} style={{ marginRight: 8 }} />
                            <Text style={{ color: theme.text, fontWeight: 'bold' }}>Try Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            );
        }

        const onDefWordClick = (w: string) => {
            if (activeTab === 'dictionary' && appMode === 'idle') {
                handleDictionaryTabSearch(w);
            } else {
                handleWordLookup(w);
            }
        };

        const handleToggleSave = () => {
            if (toggleSave) {
                toggleSave({ ...data, word: word });
            }
        };

        const definition = data?.advanced?.definition || data?.definition;
        const examples = data?.advanced?.examples || data?.examples || [];
        const advancedData = data?.advanced || {};

        return (
            <View style={{ flex: 1 }}>
                {!hideHeader && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>{word}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                                {data?.phonetic && (
                                    <Text style={{ color: theme.secondary, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{data.phonetic}</Text>
                                )}
                                {data?.partOfSpeech && (
                                    <Text style={{ color: primaryColor, fontSize: 14, fontWeight: '700', fontStyle: 'italic', backgroundColor: theme.highlight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' }}>
                                        {data.partOfSpeech}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {onRefresh && (
                                <TouchableOpacity onPress={onRefresh} style={{ padding: 5 }}>
                                    <RefreshCcw size={24} color={theme.text} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    speak(word, 0, false, false, "Word Pronunciation");
                                    setPlayingMeta(null);
                                }}
                                style={{ padding: 5 }}
                            >
                                <Volume2 size={24} color={theme.text} />
                            </TouchableOpacity>
                            {toggleSave && (
                                <TouchableOpacity onPress={handleToggleSave} style={{ padding: 5 }}>
                                    <Star size={24} color={theme.text} fill={isSaved(word) ? theme.text : "transparent"} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}>
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ padding: 15, backgroundColor: theme.uiBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border }}>
                            <InteractiveText
                                rawText={definition || "No definition found."}
                                onWordPress={onDefWordClick}
                                theme={theme}
                                activeSentence={null}
                                style={{ fontSize: 18, color: theme.text, lineHeight: 28, fontWeight: '500', textAlign: 'justify', ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                            {data?.forms && data.forms.map((form: any, idx: number) => (
                                <View key={idx} style={{ backgroundColor: theme.uiBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: theme.border }}>
                                    <Text style={{ fontSize: 14, color: theme.secondary, ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}>{form}</Text>
                                </View>
                            ))}
                        </View>
                        {examples && examples.length > 0 && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 12, color: theme.secondary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10 }}>Examples</Text>
                                {examples.map((ex: any, i: number) => (
                                    <View key={i} style={{ flexDirection: 'row', marginBottom: 10, paddingLeft: 10 }}>
                                        <View style={{ width: 3, height: '100%', backgroundColor: theme.highlight, marginRight: 12, borderRadius: 2 }} />
                                        <InteractiveText
                                            rawText={`"${ex}"`}
                                            onWordPress={onDefWordClick}
                                            theme={theme}
                                            activeSentence={null}
                                            style={{ fontStyle: 'italic', color: theme.secondary, fontSize: 16, lineHeight: 24, flex: 1, ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                        {advancedData.collocations && advancedData.collocations.length > 0 && (
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Layers size={14} color={theme.secondary} style={{ marginRight: 6 }} />
                                    <Text style={{ fontSize: 12, color: theme.secondary, fontWeight: 'bold', textTransform: 'uppercase' }}>Collocations</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {advancedData.collocations.map((col: any, idx: number) => (
                                        <View key={idx} style={{ backgroundColor: theme.buttonBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: theme.border }}>
                                            <Text style={{ color: theme.text, fontSize: 14, ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}>{col}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        {advancedData.nuances && (
                            <View style={{ marginTop: 20, backgroundColor: theme.highlight, padding: 12, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: primaryColor }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                    <Quote size={14} color={primaryColor} style={{ marginRight: 6 }} />
                                    <Text style={{ fontSize: 12, color: primaryColor, fontWeight: 'bold', textTransform: 'uppercase' }}>Nuance</Text>
                                </View>
                                <Text style={{ color: theme.text, fontSize: 15, fontStyle: 'italic', ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}>{advancedData.nuances}</Text>
                            </View>
                        )}
                    </View>

                    <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 20 }}>
                        {(data?.synonyms?.length > 0 || data?.antonyms?.length > 0) && (
                            <View style={{ marginBottom: 25 }}>
                                {data?.synonyms?.length > 0 && (
                                    <View style={{ marginBottom: 15 }}>
                                        <Text style={{ fontSize: 12, color: theme.secondary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 }}>Synonyms</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                            {data.synonyms.map((syn: any, i: number) => (
                                                <TouchableOpacity key={i} onPress={() => onDefWordClick(syn)} style={{ backgroundColor: theme.highlight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: theme.border }}>
                                                    <Text style={{ color: theme.text, ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}>{syn}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                                {data?.antonyms?.length > 0 && (
                                    <View>
                                        <Text style={{ fontSize: 12, color: theme.secondary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 }}>Antonyms</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                            {data.antonyms.map((ant: any, i: number) => (
                                                <TouchableOpacity key={i} onPress={() => onDefWordClick(ant)} style={{ backgroundColor: theme.uiBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: theme.border, opacity: 0.8 }}>
                                                    <Text style={{ color: theme.secondary, textDecorationLine: 'line-through', ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}>{ant}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                        {(data?.usageNote || data?.etymology) && (
                            <View style={{ gap: 20 }}>
                                {data?.usageNote && (
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <ScrollText size={14} color={theme.secondary} style={{ marginRight: 6 }} />
                                            <Text style={{ fontSize: 12, color: theme.secondary, fontWeight: 'bold', textTransform: 'uppercase' }}>Usage Note</Text>
                                        </View>
                                        <Text style={{ color: theme.text, fontSize: 15, lineHeight: 22, ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}>{data.usageNote}</Text>
                                    </View>
                                )}
                                {data?.etymology && (
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <Globe size={14} color={theme.secondary} style={{ marginRight: 6 }} />
                                            <Text style={{ fontSize: 12, color: theme.secondary, fontWeight: 'bold', textTransform: 'uppercase' }}>Origin & Etymology</Text>
                                        </View>
                                        <Text style={{ color: theme.secondary, fontSize: 14, lineHeight: 20, fontStyle: 'italic', ...getTypographyStyle(displaySettings.fontFamily, displaySettings.textStyles) }}>{data.etymology}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {onStartQuiz && (
                        <View style={{ marginTop: 30, marginBottom: 20 }}>
                            <TouchableOpacity onPress={onStartQuiz} style={{ backgroundColor: primaryColor, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                                <BrainCircuit size={20} color="white" />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Practice This Word</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </View>
        );
    };

    if (isLandscape) {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ width: 350, borderRightWidth: 1, borderColor: theme.border, padding: 20 }}>
                    {renderDictionarySearchBar()}
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.secondary, marginBottom: 10 }}>RECENT</Text>
                        <ScrollView style={{ height: '100%' }}>
                            {recentSearches.slice(0, 50).map((item: any, index: number) => {
                                const w = typeof item === 'string' ? item : item.word;
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => handleDictionaryTabSearch(w)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <History size={16} color={theme.secondary} style={{ marginRight: 10 }} />
                                            <Text style={{ color: theme.text, fontSize: 16 }}>{w}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteRecentSearch(item)} style={{ padding: 4 }}>
                                            <X size={14} color={theme.secondary} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
                <View style={{ flex: 1, padding: 30 }}>
                    {isDictionaryLoading ? (
                        <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
                    ) : dictionaryResult ? (
                        renderDefinitionContent(dictionaryResult, dictionaryCurrentWord, isWordSaved, toggleSaveWord, false, () => startQuiz(dictionaryCurrentWord, true, 'Dictionary'), () => refreshDefinition(dictionaryCurrentWord))
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                            <BookA size={64} color={theme.secondary} style={{ marginBottom: 20 }} />
                            <Text style={{ fontSize: 18, color: theme.secondary }}>Select a word or search to define</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {renderDictionarySearchBar()}
            {!dictionaryResult && !isDictionaryLoading && (
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.secondary, marginBottom: 15 }}>RECENT SEARCHES</Text>
                    <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
                        {recentSearches.slice(0, 50).map((item: any, index: number) => {
                            const w = typeof item === 'string' ? item : item.word;
                            return (
                                <TouchableOpacity key={index} onPress={() => handleDictionaryTabSearch(w)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: theme.border }}>
                                    <History size={18} color={theme.secondary} style={{ marginRight: 12, opacity: 0.7 }} />
                                    <Text style={{ color: theme.text, fontSize: 16, flex: 1 }}>{w}</Text>
                                    <TouchableOpacity onPress={() => deleteRecentSearch(item)} style={{ padding: 8 }}>
                                        <X size={16} color={theme.secondary} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}
            {isDictionaryLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={{ marginTop: 20, color: theme.secondary }}>Looking up definition...</Text>
                </View>
            ) : dictionaryResult && (
                renderDefinitionContent(dictionaryResult, dictionaryCurrentWord, isWordSaved, toggleSaveWord, false, () => startQuiz(dictionaryCurrentWord, true, 'Dictionary'), () => refreshDefinition(dictionaryCurrentWord))
            )}
        </View>
    );
};

export default Dictionary;
