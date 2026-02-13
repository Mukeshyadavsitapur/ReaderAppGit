import { ArrowRight, BookOpenText, Camera, Feather, Mic, ScrollText, Sparkles } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Theme } from '../_types';

export interface StudioViewProps {
    theme: Theme;
    storyTabMode: string;
    setStoryTabMode: (mode: string) => void;
    primaryColor: string;
    storyQuery: string;
    setStoryQuery: (query: string) => void;
    handleVoiceToggle: (target: string) => void;
    isTranscribing: boolean;
    voiceTarget: string;
    isRecording: boolean;
    recordingOpacity: any;
    setImagePickerMode: (mode: string) => void;
    setVisionDraft: (draft: any) => void;
    setShowImageSourceModal: (show: boolean) => void;
    handleGenerateBookChapter: () => void;
    bookParams: any;
    setBookParams: (params: any) => React.SetStateAction<any>; // Allow functional updates
    editorialParams: any;
    setEditorialParams: (params: any) => React.SetStateAction<any>;
    handleGenerateEditorial: () => void;
}

const StudioView: React.FC<StudioViewProps> = ({
    theme,
    storyTabMode,
    setStoryTabMode,
    primaryColor,
    storyQuery,
    setStoryQuery,
    handleVoiceToggle,
    isTranscribing,
    voiceTarget,
    isRecording,
    recordingOpacity,
    setImagePickerMode,
    setVisionDraft,
    setShowImageSourceModal,
    handleGenerateBookChapter,
    bookParams,
    setBookParams,
    editorialParams,
    setEditorialParams,
    handleGenerateEditorial
}) => {

    // Inline styles from index.tsx
    const styles = StyleSheet.create({
        input: {
            borderRadius: 12,
            borderWidth: 1,
            marginBottom: 15,
            padding: 15,
            fontSize: 16,
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <View style={{ flex: 1, backgroundColor: theme.bg }}>
                {/* Top Bar Toggle for Story vs Editorial */}
                <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: theme.buttonBg, padding: 4, borderRadius: 12 }}>
                        <TouchableOpacity
                            onPress={() => setStoryTabMode('story')}
                            style={{
                                flex: 1,
                                paddingVertical: 8,
                                alignItems: 'center',
                                borderRadius: 10,
                                backgroundColor: storyTabMode === 'story' ? theme.bg : 'transparent',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: storyTabMode === 'story' ? 0.1 : 0,
                                shadowRadius: 2,
                                elevation: storyTabMode === 'story' ? 2 : 0,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 6
                            }}
                        >
                            <BookOpenText size={16} color={storyTabMode === 'story' ? primaryColor : theme.secondary} />
                            <Text style={{ fontWeight: 'bold', color: storyTabMode === 'story' ? theme.text : theme.secondary, fontSize: 13 }}>Story Generator</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setStoryTabMode('editorial')}
                            style={{
                                flex: 1,
                                paddingVertical: 8,
                                alignItems: 'center',
                                borderRadius: 10,
                                backgroundColor: storyTabMode === 'editorial' ? theme.bg : 'transparent',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: storyTabMode === 'editorial' ? 0.1 : 0,
                                shadowRadius: 2,
                                elevation: storyTabMode === 'editorial' ? 2 : 0,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 6
                            }}
                        >
                            <ScrollText size={16} color={storyTabMode === 'editorial' ? primaryColor : theme.secondary} />
                            <Text style={{ fontWeight: 'bold', color: storyTabMode === 'editorial' ? theme.text : theme.secondary, fontSize: 13 }}>Editorial</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {storyTabMode === 'story' ? (
                    /* --- STORY GENERATOR UI --- */
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 0 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15, marginTop: 10 }}>
                            <View style={{ width: 50, height: 50, backgroundColor: theme.highlight, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <Feather size={24} color={primaryColor} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>Story Generator</Text>
                                <Text style={{ fontSize: 12, color: theme.secondary }}>Write Novels, Epics, & Biographies</Text>
                            </View>
                        </View>

                        <Text style={{ color: theme.secondary, fontWeight: '700', fontSize: 11, marginBottom: 8, textTransform: 'uppercase' }}>Story Details</Text>
                        <View style={{ marginBottom: 20 }}>
                            <View style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, flexDirection: 'row', alignItems: 'center', paddingRight: 5, minHeight: 60, paddingVertical: 5 }]}>
                                <TextInput
                                    style={{ flex: 1, color: theme.text, fontSize: 16, paddingLeft: 10, paddingRight: 5 }}
                                    placeholder="Enter Title: Description..."
                                    placeholderTextColor={theme.secondary}
                                    value={storyQuery}
                                    onChangeText={setStoryQuery}
                                    multiline={true}
                                />

                                <TouchableOpacity
                                    onPress={() => handleVoiceToggle('story_query')}
                                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {isTranscribing && voiceTarget === 'story_query' ? (
                                        <ActivityIndicator size="small" color={theme.text} />
                                    ) : (
                                        <Animated.View style={{ opacity: voiceTarget === 'story_query' ? recordingOpacity : 1 }}>
                                            <Mic size={20} color={(isRecording && voiceTarget === 'story_query') ? primaryColor : theme.text} />
                                        </Animated.View>
                                    )}
                                </TouchableOpacity>

                                {/* Vision Button inside Search Bar */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setImagePickerMode('story');
                                        setVisionDraft({ uris: [], prompt: "" }); // Reset draft
                                        setShowImageSourceModal(true);
                                    }}
                                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}
                                >
                                    <Camera size={20} color={theme.text} />
                                </TouchableOpacity>

                                {/* Generate Action Button inside Search Bar */}
                                <TouchableOpacity
                                    onPress={handleGenerateBookChapter}
                                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {storyQuery.trim().length > 0 ? (<ArrowRight size={20} color={primaryColor} />) : (<BookOpenText size={20} color={primaryColor} />)}
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 10, color: theme.secondary, marginTop: 5, fontStyle: 'italic' }}>
                                Tip: Enter "Title: Description" or just click the book icon for a story based on your profile.
                            </Text>
                        </View>

                        {/* Scrollable Genre Section */}
                        <Text style={{ color: theme.secondary, fontWeight: '700', fontSize: 11, marginBottom: 10, textTransform: 'uppercase' }}>Genre / Style</Text>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 }}
                        >

                            {/* Genre List */}
                            {['Adventure', 'Autobiography', 'Biography', 'Comedy', 'Fantasy', 'Fiction/Novel', 'History', 'Horror', 'Mystery/Thriller', 'Mythology/Epic', 'Philosophy', 'Poetry', 'Sci-Fi'].map((genre: string) => (
                                <TouchableOpacity
                                    key={genre}
                                    onPress={() => setBookParams((prev: any) => ({ ...prev, genre }))}
                                    style={{
                                        width: '48%',
                                        paddingVertical: 12,
                                        borderRadius: 16,
                                        backgroundColor: bookParams.genre === genre ? primaryColor : theme.buttonBg,
                                        borderWidth: 1,
                                        borderColor: bookParams.genre === genre ? primaryColor : theme.border,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{ color: bookParams.genre === genre ? 'white' : theme.text, fontWeight: '600', fontSize: 14, textAlign: 'center' }}
                                        numberOfLines={2}
                                    >
                                        {genre}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </ScrollView>
                ) : (
                    /* --- EDITORIAL GENERATOR UI --- */
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 0 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15, marginTop: 10 }}>
                            <View style={{ width: 50, height: 50, backgroundColor: theme.highlight, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <ScrollText size={24} color={primaryColor} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>Editorial Writer</Text>
                                <Text style={{ fontSize: 12, color: theme.secondary }}>Opinions, Articles & News Analysis</Text>
                            </View>
                        </View>

                        <Text style={{ color: theme.secondary, fontWeight: '700', fontSize: 11, marginBottom: 8, textTransform: 'uppercase' }}>Topic / Headline</Text>
                        <View style={{ marginBottom: 20 }}>
                            <View style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, flexDirection: 'row', alignItems: 'center', paddingRight: 5, minHeight: 60, paddingVertical: 5 }]}>
                                <TextInput
                                    style={{ flex: 1, color: theme.text, fontSize: 16, paddingLeft: 10, paddingRight: 5 }}
                                    placeholder="e.g. The Future of AI in Schools"
                                    placeholderTextColor={theme.secondary}
                                    value={editorialParams.topic}
                                    onChangeText={(t: string) => setEditorialParams((prev: any) => ({ ...prev, topic: t }))}
                                    multiline={true}
                                />

                                <TouchableOpacity
                                    onPress={() => handleVoiceToggle('editorial_topic')}
                                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {isTranscribing && voiceTarget === 'editorial_topic' ? (
                                        <ActivityIndicator size="small" color={theme.text} />
                                    ) : (
                                        <Animated.View style={{ opacity: voiceTarget === 'editorial_topic' ? recordingOpacity : 1 }}>
                                            <Mic size={20} color={(isRecording && voiceTarget === 'editorial_topic') ? primaryColor : theme.text} />
                                        </Animated.View>
                                    )}
                                </TouchableOpacity>

                                {/* Vision Button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setImagePickerMode('editorial');
                                        setVisionDraft({ uris: [], prompt: "" }); // Reset draft
                                        setShowImageSourceModal(true);
                                    }}
                                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}
                                >
                                    <Camera size={20} color={theme.text} />
                                </TouchableOpacity>

                                {/* Write/Brainstorm Action Button */}
                                <TouchableOpacity
                                    onPress={handleGenerateEditorial}
                                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {editorialParams.topic.trim().length > 0 ? (
                                        <ArrowRight size={20} color={primaryColor} />
                                    ) : (
                                        <Sparkles size={20} color={primaryColor} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 10, color: theme.secondary, marginTop: 5, fontStyle: 'italic' }}>
                                Tip: Enter a topic or just click the sparkles icon to brainstorm and write automatically.
                            </Text>
                        </View>

                        {/* Stance Selection */}
                        <Text style={{ color: theme.secondary, fontWeight: '700', fontSize: 11, marginBottom: 10, textTransform: 'uppercase' }}>Stance / Perspective</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 }}>

                            {['Balanced', 'Opinionated', 'Critical', 'Supportive', 'Satirical', 'Analytical', 'Persuasive'].map((stance: string) => (
                                <TouchableOpacity
                                    key={stance}
                                    onPress={() => setEditorialParams((prev: any) => ({ ...prev, stance }))}
                                    style={{
                                        width: '48%',
                                        paddingVertical: 12,
                                        borderRadius: 16,
                                        backgroundColor: editorialParams.stance === stance ? primaryColor : theme.buttonBg,
                                        borderWidth: 1,
                                        borderColor: editorialParams.stance === stance ? primaryColor : theme.border,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{ color: editorialParams.stance === stance ? 'white' : theme.text, fontWeight: '600', fontSize: 13, textAlign: 'center' }} numberOfLines={1}>{stance}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Tone Selection */}
                        <Text style={{ color: theme.secondary, fontWeight: '700', fontSize: 11, marginBottom: 10, textTransform: 'uppercase' }}>Tone of Voice</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 }}>
                            {['Professional', 'Casual', 'Academic', 'Urgent', 'Inspirational', 'Witty', 'Direct'].map((tone: string) => (
                                <TouchableOpacity
                                    key={tone}
                                    onPress={() => setEditorialParams((prev: any) => ({ ...prev, tone }))}
                                    style={{
                                        width: '48%',
                                        paddingVertical: 12,
                                        borderRadius: 16,
                                        backgroundColor: editorialParams.tone === tone ? primaryColor : theme.buttonBg,
                                        borderWidth: 1,
                                        borderColor: editorialParams.tone === tone ? primaryColor : theme.border,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{ color: editorialParams.tone === tone ? 'white' : theme.text, fontWeight: '600', fontSize: 13, textAlign: 'center' }} numberOfLines={1}>{tone}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default StudioView;
