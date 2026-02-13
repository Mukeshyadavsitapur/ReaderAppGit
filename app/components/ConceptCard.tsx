import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, DeviceEventEmitter, Pressable, Text, View } from 'react-native';
import { Theme } from '../_types';
import { cleanTextForDisplay } from '../utils/_textUtils';
import InteractiveText from './InteractiveText';

interface ConceptCardProps {
    title: string;
    subtitle?: string;
    content: string;
    theme: Theme;
    fontSize?: number;
    chapterName?: string;
    onSave?: (card: any) => void;
    // Interaction & TTS
    onWordPress?: (word: string) => void;
    activeSentence?: { start: number; end: number };
    offset?: number;
    tapToDefineEnabled?: boolean;
    isHighlightMode?: boolean;
    highlights?: any[];
    onHighlightPress?: (highlight: any) => void;
    onLinkPress?: (url: string) => boolean;
}

const ConceptCard: React.FC<ConceptCardProps> = ({
    title,
    subtitle,
    content,
    theme,
    fontSize = 1.0,
    chapterName,
    onSave,
    onWordPress,
    activeSentence,
    offset = 0,
    tapToDefineEnabled = true,
    isHighlightMode = false,
    highlights = [],
    onHighlightPress,
    onLinkPress
}) => {
    const handleLongPress = async () => {
        try {
            // Clean content for TTS playback (remove markdown formatting)
            const cleanedContent = cleanTextForDisplay(content);

            const existingData = await AsyncStorage.getItem('savedQuestions');
            const savedQuestions = existingData ? JSON.parse(existingData) : [];

            // Check against cleanedContent, because that is what is stored in 'back'
            const isDuplicate = savedQuestions.some((q: any) => q.back === cleanedContent);
            if (isDuplicate) {
                Alert.alert("Already Saved", "This concept card is already in your flashcards.");
                return;
            }

            let displayFront = "";
            let cleanTitle = title || 'KEY CONCEPT';
            const isAbstactSummary = cleanTitle.toLowerCase().includes('chapter summary');

            if (isAbstactSummary) {
                const effectiveChapter = chapterName || "Chapter";
                displayFront = `${effectiveChapter} Summary`;
            } else {
                displayFront = `${chapterName ? chapterName + '\n\n' : ''}${cleanTitle}${subtitle ? '\n' + subtitle : ''}`;
            }

            const flashcard = {
                id: Date.now().toString(),
                front: displayFront,
                back: cleanedContent,
                timestamp: Date.now(),
                source: 'concept_card',
                question: displayFront,
                explanation: cleanedContent,
                options: []
            };

            const updatedQuestions = [...savedQuestions, flashcard];
            await AsyncStorage.setItem('savedQuestions', JSON.stringify(updatedQuestions));
            DeviceEventEmitter.emit('refreshFlashcards');
            if (onSave) onSave(flashcard);
            Alert.alert("Saved!", "Find it in Library -> Test -> Cards.");
        } catch (error) {
            Alert.alert("Error", "Failed to save flashcard.");
        }
    };

    // Prepare offsets for Title vs Content
    // Parser adds ". " (length 2) after title
    const titleLength = title ? title.length + 2 : 0;
    const contentOffset = offset + titleLength;

    return (
        <Pressable onLongPress={handleLongPress} delayLongPress={500}>
            <View style={{ marginVertical: 12, backgroundColor: theme.bg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, overflow: 'hidden', elevation: 2 }}>
                <View style={{ backgroundColor: theme.headerBg, paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: theme.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <InteractiveText
                            rawText={title || 'KEY CONCEPT'}
                            onWordPress={onWordPress}
                            onLinkPress={onLinkPress}
                            activeSentence={activeSentence}
                            paragraphOffset={offset} // Title starts at base offset
                            theme={theme}
                            isHighlightMode={isHighlightMode}
                            highlights={highlights}
                            onHighlightPress={onHighlightPress}
                            tapToDefineEnabled={tapToDefineEnabled}
                            style={{
                                fontSize: 14 * fontSize,
                                fontWeight: '700',
                                color: theme.text,
                                marginBottom: 2
                            }}
                        />
                        {subtitle && <Text style={{ fontSize: 11 * fontSize, color: theme.text, opacity: 0.8, fontStyle: 'italic' }}>{subtitle}</Text>}
                    </View>
                    <View style={{ backgroundColor: theme.badgeBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginLeft: 8 }}>
                        <Text style={{ fontSize: 10 * fontSize, fontWeight: 'bold', color: theme.badgeText }}>{chapterName ? chapterName.toUpperCase() : 'CONCEPT'}</Text>
                    </View>
                </View>
                <View style={{ padding: 12 }}>
                    <InteractiveText
                        rawText={content}
                        onWordPress={onWordPress}
                        onLinkPress={onLinkPress}
                        activeSentence={activeSentence}
                        paragraphOffset={contentOffset} // Content shifted by title length
                        theme={theme}
                        isHighlightMode={isHighlightMode}
                        highlights={highlights}
                        onHighlightPress={onHighlightPress}
                        tapToDefineEnabled={tapToDefineEnabled}
                        style={{
                            fontSize: 15 * fontSize,
                            color: theme.text,
                            lineHeight: 22 * fontSize,
                            textAlign: 'justify'
                        }}
                    />
                    <Text style={{ fontSize: 10, color: theme.secondary, textAlign: 'center', marginTop: 8, fontStyle: 'italic', opacity: 0.7 }}>
                        (Long press to save as flashcard)
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ConceptCard;
