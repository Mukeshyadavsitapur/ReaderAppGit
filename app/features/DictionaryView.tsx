import { AlertTriangle, ArrowRight, BookA, BrainCircuit, Camera, Globe, History, Layers, Mic, Quote, RefreshCcw, ScrollText, Search, Star, Volume2, X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Animated, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DisplaySettings, Theme } from '../../src/types';
import InteractiveText from '../components/InteractiveText';

// Mock helper if not found - ensuring basic font family support
const getTypographyStyle = (fontFamily: string, textStyles: any) => {
    return { fontFamily };
};

export interface DictionaryViewProps {
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
    startQuiz: (mode: string, data?: any) => void;
    refreshDefinition: (word: string) => void;
    speak: (text: string, rate?: number, forceLegacy?: boolean, forceGoogle?: boolean, purpose?: string) => void;
    setPlayingMeta: (meta: any) => void;
    primaryColor: string;
    handleVoiceToggle: (target: string) => void;
    isTranscribing: boolean;
    voiceTarget: string;
    isRecording: boolean;
    recordingOpacity: any; // Animated.Value or number
    setImagePickerMode: (mode: string) => void;
    setVisionDraft: (draft: any) => void;
    setShowImageSourceModal: (show: boolean) => void;
    appMode: string;
    activeTab: string;
    displaySettings: DisplaySettings;
    isLandscape: boolean;
}

const DictionaryView: React.FC<DictionaryViewProps> = ({
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
    console.log('🔍 DictionaryView render, recentSearches length:', recentSearches?.length);

    // Styles inferred from usage
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
    console.log('🔍 StyleSheet created');

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
                // FIX: Spread data first, then overwrite 'word' with the explicit argument.
                toggleSave({
                    ...data,
                    word: word
                });
            }
        };

        // REMOVED: isBeginner check. Always use 'advanced' data (which now has simple definitions).
        const definition = data?.advanced?.definition || data?.definition;

        // Use advanced examples if available, fallback to root examples
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
                                    // NEW: Clear playingMeta so this short audio doesn't trigger chapter highlighting
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

                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                >
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

                        {/* Always show Collocations if available */}
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

                        {/* Always show Nuances if available */}
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

                    {/* Always show Etymology/Origins */}
                    {(
                        <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 20 }}>
                            {(data?.synonyms?.length > 0 || data?.antonyms?.length > 0) && (
                                <View style={{ marginBottom: 25 }}>
                                    {data?.synonyms?.length > 0 && (
                                        <View style={{ marginBottom: 15 }}>
                                            <Text style={{ fontSize: 12, color: theme.secondary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 }}>Synonyms</Text>
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                                {data.synonyms.map((syn: any, i: number) => (
                                                    <TouchableOpacity
                                                        key={i}
                                                        onPress={() => onDefWordClick(syn)}
                                                        style={{ backgroundColor: theme.highlight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: theme.border }}
                                                    >
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
                                                    <TouchableOpacity
                                                        key={i}
                                                        onPress={() => onDefWordClick(ant)}
                                                        style={{ backgroundColor: theme.uiBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: theme.border, opacity: 0.8 }}
                                                    >
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
                    )}

                    {/* Always show Quiz Button if not loading */}
                    {onStartQuiz && (
                        <View style={{ marginTop: 30, marginBottom: 20 }}>
                            <TouchableOpacity
                                onPress={onStartQuiz}
                                style={{
                                    backgroundColor: primaryColor,
                                    padding: 16,
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 10
                                }}
                            >
                                <BrainCircuit size={20} color="white" />
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Practice This Word</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </View >
        );
    };

    console.log('🔍 About to render, isLandscape:', isLandscape);
    if (isLandscape) {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Left Panel: Search & History */}
                <View style={{ width: 350, borderRightWidth: 1, borderColor: theme.border, padding: 20 }}>
                    {renderDictionarySearchBar()}

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.secondary, marginBottom: 10 }}>RECENT</Text>
                        <ScrollView style={{ height: '100%' }}>
                            {recentSearches.slice(0, 50).map((item: any, index: number) => {
                                const w = typeof item === 'string' ? item : item.word;
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }}>
                                        <TouchableOpacity
                                            onPress={() => handleDictionaryTabSearch(w)}
                                            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                                        >
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

                {/* Right Panel: Content */}
                <View style={{ flex: 1, padding: 30 }}>
                    {isDictionaryLoading ? (
                        <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
                    ) : dictionaryResult ? (
                        renderDefinitionContent(
                            dictionaryResult,
                            dictionaryCurrentWord,
                            isWordSaved,
                            toggleSaveWord,
                            false,
                            () => startQuiz('word_quiz', { word: dictionaryCurrentWord }),
                            () => refreshDefinition(dictionaryCurrentWord)
                        )
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

            {/* Suggestions/History if no result yet */}
            {!dictionaryResult && !isDictionaryLoading && (
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.secondary, marginBottom: 15 }}>RECENT SEARCHES</Text>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        style={{ flex: 1 }}
                    >
                        {recentSearches.slice(0, 50).map((item: any, index: number) => {
                            const w = typeof item === 'string' ? item : item.word;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleDictionaryTabSearch(w)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 12,
                                        borderBottomWidth: 1,
                                        borderColor: theme.border
                                    }}
                                >
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
                renderDefinitionContent(
                    dictionaryResult,
                    dictionaryCurrentWord,
                    isWordSaved,
                    toggleSaveWord,
                    false, // Show Header
                    () => startQuiz('word_quiz', { word: dictionaryCurrentWord }),
                    () => refreshDefinition(dictionaryCurrentWord)
                )
            )}
        </View>
    );
};

export default DictionaryView;