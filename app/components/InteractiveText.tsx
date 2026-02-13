import React, { useMemo, useRef } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text } from 'react-native';
import { InteractiveTextProps } from '../../src/types';

// Constants for Highlight Colors
const HIGHLIGHT_COLORS = {
    yellow: { day: '#fef08a', night: '#854d0e', code: '#facc15' }, // Yellow-200/800
    green: { day: '#bbf7d0', night: '#14532d', code: '#4ade80' }, // Green-200/800
    blue: { day: '#bfdbfe', night: '#1e3a8a', code: '#60a5fa' }, // Blue-200/800
    pink: { day: '#fbcfe8', night: '#831843', code: '#f472b6' }, // Pink-200/800
    purple: { day: '#ddd6fe', night: '#5b21b6', code: '#a78bfa' }, // Violet-200/800
    orange: { day: '#fed7aa', night: '#7c2d12', code: '#fb923c' }, // Orange-200/800
};

interface TextSegment {
    text: string;
    isBold: boolean;
    isItalic: boolean;
    isMath: boolean;
    isLink: boolean;
    linkUrl?: string | null;
    isGreen: boolean;
}

interface LineWord {
    word: string;
    start: number;
    end: number;
    isBold: boolean;
    isItalic: boolean;
    isMath: boolean;
    isLink: boolean;
    linkUrl?: string | null;
    isGreen: boolean;
}

const InteractiveText = React.memo(({ rawText, onWordPress, onLinkPress, style, activeSentence, paragraphOffset = 0, theme, isHighlightMode, highlights = [], onHighlightPress, tapToDefineEnabled = true }: InteractiveTextProps) => {
    // Flatten style array to object to access properties safely
    const flatStyle: any = useMemo(() => StyleSheet.flatten(style) || {}, [style]);

    // UPDATED: Destructure processed data and total length for paragraph-level operations
    const { lines: processedLines, totalLength } = useMemo(() => {
        if (typeof rawText !== 'string') return { lines: [], totalLength: 0 };
        // Split by newline but keep the delimiter to detect empty lines
        const lines = rawText.split(/(\n)/g);
        let charIndex = 0;

        const mappedLines = lines.map((line, lineIdx) => {
            const rawLine = line; // Don't trim immediately, checking for \n
            if (rawLine === '\n') {
                // It's a newline separator
                return { isNewline: true, key: lineIdx };
            }

            const trimmed = rawLine.trim();
            let type = 'normal';
            let cleanLine = line;

            if (trimmed.length === 0) {
                // Empty line (double newline case)
                return { isNewline: false, isEmpty: true, key: lineIdx };
            }

            if (trimmed.startsWith('#')) {
                type = 'header';
                cleanLine = line.replace(/#{1,6}\s*/, '');
            } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 50) {
                type = 'menu';
                cleanLine = line.replace(/^\*\*/, '').replace(/\*\*$/, '');
            } else if ((trimmed.startsWith('* ') || trimmed.startsWith('- ')) && trimmed.length < 60) {
                type = 'submenu';
                cleanLine = line.replace(/^[\*\-]\s*/, '');
            } else if (trimmed.startsWith('>')) { // Added quote detection
                type = 'quote';
                cleanLine = line.replace(/^>\s*/, '');
            } else {
                // NEW: Detect Formula Lines
                const mathSymbols = /[=≈∝><≥≤∫∑√±×÷]/;
                const isShort = trimmed.length < 80;
                if (isShort && mathSymbols.test(trimmed) && !trimmed.endsWith('.')) {
                    type = 'formula';
                }
            }

            // 1. Initial segment (whole line)
            let mixedSegments: TextSegment[] = [{ text: cleanLine, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false }];

            // ... (existing segmentation logic unchanged) ...
            // 2. Process Markdown Links [Text](URL) - Process FIRST to protect URLs
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isItalic || seg.isMath) return [seg];
                const parts = seg.text.split(/(\[[^\]]+\]\([^)]+\))/g);
                return parts.map(part => {
                    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                    if (linkMatch) {
                        return {
                            text: linkMatch[1].replace(/\s+/g, ' ').trim(),
                            isBold: false, isItalic: false, isMath: false,
                            isLink: true, linkUrl: linkMatch[2],
                            isGreen: false
                        };
                    }
                    return {
                        text: part,
                        isBold: false, isItalic: false, isMath: false,
                        isLink: false, linkUrl: null,
                        isGreen: false
                    };
                });
            });

            // 3. Process Bold
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isItalic || seg.isMath || seg.isLink) return [seg];
                return seg.text.split(/(\*\*.*?\*\*)/g).map(part => {
                    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                        return { text: part.slice(2, -2), isBold: true, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            // 4. Process Math
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isItalic || seg.isMath || seg.isLink) return [seg];
                return seg.text.split(/(\$.*?\$)/g).map(part => {
                    if (part.startsWith('$') && part.endsWith('$') && part.length >= 3) {
                        return { text: part.slice(1, -1), isBold: false, isItalic: false, isMath: true, isLink: false, linkUrl: null, isGreen: false };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            // 5. Process Italic
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isMath || seg.isLink) return [seg];
                return seg.text.split(/(\*[^*]+?\*)/g).map(part => {
                    if (part.startsWith('*') && part.endsWith('*') && part.length >= 3) {
                        return { text: part.slice(1, -1), isBold: false, isItalic: true, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            // 6. Process Green Blank
            mixedSegments = mixedSegments.flatMap(seg => {
                if (seg.isBold || seg.isMath || seg.isLink || seg.isItalic) return [seg];
                return seg.text.split(/(\[\[Blank\]\])/g).map(part => {
                    if (part === '[[Blank]]') {
                        return { text: 'Blank', isBold: true, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: true };
                    }
                    return { text: part, isBold: false, isItalic: false, isMath: false, isLink: false, linkUrl: null, isGreen: false };
                });
            });

            const lineWords: LineWord[] = [];

            mixedSegments.forEach(seg => {
                let cleanSeg = seg.text;
                if (!seg.isMath && !seg.isLink && !seg.isGreen) {
                    cleanSeg = cleanSeg.replace(/\|/g, ' ');
                    cleanSeg = cleanSeg.replace(/(\*\*|__|\*|_|`|~|\\|\[|\]|#)/g, '');
                    cleanSeg = cleanSeg.replace(/[\u2022\u25CF\u25CB\u25A0\u25A1\u25B6\u25C0\u26AB\u26AA\uD83D\uDD34\uD83D\uDD35\u2705\u274C\u2728\u2B50]/g, '');
                    cleanSeg = cleanSeg.replace(/\s+/g, ' ');
                }

                const words = cleanSeg.split(/(\s+)/);
                words.forEach(word => {
                    if (!word) return;
                    lineWords.push({
                        word,
                        start: charIndex,
                        end: charIndex + word.length,
                        isBold: seg.isBold,
                        isItalic: seg.isItalic,
                        isMath: seg.isMath,
                        isLink: seg.isLink,
                        linkUrl: seg.linkUrl,
                        isGreen: seg.isGreen
                    });
                    charIndex += word.length;
                });
            });

            return { lineWords, type, key: lineIdx };
        });

        return { lines: mappedLines, totalLength: charIndex };
    }, [rawText]);

    // NEW: Track press duration and movement to differentiate Tap (Define) vs Selection/Scroll
    const pressTrackerRef = useRef({ time: 0, x: 0, y: 0 });

    return (
        // UPDATED: Enable text selection even if Tap to Define is ON. (Only disable in HighlightMode to prevent conflict)
        <Text style={flatStyle} selectable={!isHighlightMode}>
            {processedLines.map((lineData) => {
                if (lineData.isNewline) {
                    return <Text key={lineData.key}>{"\n"}</Text>;
                }
                if (lineData.isEmpty) {
                    return null; // Don't render empty strings, newline handles spacing
                }

                const { lineWords, type, key } = lineData;

                let dynamicColor = flatStyle.color || theme.text;
                let dynamicWeight = flatStyle.fontWeight || 'normal';
                let dynamicSize = flatStyle.fontSize;
                let dynamicMargin = 0;
                let dynamicStyle = flatStyle.fontStyle || 'normal';
                let dynamicTextAlign = 'left';

                if (type === 'header') {
                    dynamicColor = theme.id === 'night' ? '#60a5fa' : (theme.id === 'sepia' ? '#8c7b66' : '#2563eb');
                    dynamicWeight = flatStyle.fontWeight || 'bold';
                    dynamicSize = flatStyle.fontSize * 1.3;
                    dynamicMargin = 10;
                } else if (type === 'menu') {
                    dynamicColor = theme.id === 'night' ? '#c084fc' : (theme.id === 'sepia' ? '#8c7b66' : '#9333ea');
                    dynamicWeight = flatStyle.fontWeight || '700';
                } else if (type === 'submenu') {
                    dynamicColor = theme.id === 'night' ? '#34d399' : (theme.id === 'sepia' ? '#5b4636' : '#059669');
                    dynamicWeight = flatStyle.fontWeight || '600';
                } else if (type === 'quote') {
                    dynamicColor = theme.secondary;
                    dynamicStyle = 'italic';
                    dynamicMargin = 4;
                } else if (type === 'formula') {
                    dynamicTextAlign = 'center';
                    dynamicStyle = 'italic';
                    dynamicColor = theme.text;
                    dynamicSize = flatStyle.fontSize * 1.15;
                    dynamicMargin = 8;
                    dynamicWeight = '600';
                }

                return (
                    <Text key={key} style={{ marginTop: dynamicMargin, textAlign: dynamicTextAlign as any }}>
                        {lineWords && (lineWords as any[]).map(({ word, start, end, isBold, isItalic, isMath, isLink, linkUrl, isGreen }, index) => {
                            if (!word) return null;

                            const globalStart = paragraphOffset + start;
                            const globalEnd = globalStart + word.length;

                            let isHighlighted = false;

                            if (activeSentence) {
                                if (globalStart >= activeSentence.start && globalStart < activeSentence.end) {
                                    isHighlighted = true;
                                }
                            }

                            // CHECK MANUAL HIGHLIGHT
                            const manualHighlight = highlights.find(h =>
                                (globalStart < h.end && globalEnd > h.start) // Overlap check
                            );

                            const isUrl = word.match(/^https?:\/\//i);
                            const isSpace = !word.trim();

                            let wordColor = dynamicColor;
                            let wordWeight = dynamicWeight;
                            let wordStyleProp = dynamicStyle;
                            let wordDecor = flatStyle.textDecorationLine || 'none';

                            if (isUrl) {
                                wordColor = '#2563eb';
                                wordDecor = 'underline';
                            } else if (isLink) {
                                wordColor = '#2563eb';
                                wordDecor = 'underline';
                                wordWeight = 'bold';
                            } else if (isGreen) {
                                wordColor = '#22c55e';
                                wordWeight = 'bold';
                            } else if (isBold && type === 'normal') {
                                wordColor = theme.id === 'day' ? '#2563eb' : theme.primary;
                                wordWeight = 'bold';
                            } else if (isMath && type === 'normal') {
                                wordColor = theme.id === 'day' ? '#ea580c' : '#fb923c';
                                wordWeight = '500';
                            } else if (isItalic && type === 'normal') {
                                wordColor = theme.id === 'day' ? '#9333ea' : '#c084fc';
                                wordStyleProp = 'italic';
                            } else if (type === 'formula') {
                                wordColor = dynamicColor;
                                wordWeight = dynamicWeight;
                                var fontFamily = 'serif';
                                if (Platform.OS === 'ios') fontFamily = 'Georgia';
                            }

                            let backgroundColor = 'transparent';
                            if (manualHighlight) {
                                const hColor = manualHighlight.color || 'yellow';
                                const colorDef = (HIGHLIGHT_COLORS as any)[hColor] || HIGHLIGHT_COLORS.yellow;
                                backgroundColor = theme.id === 'day' ? colorDef.day : colorDef.night;
                            } else if (isHighlighted) {
                                backgroundColor = theme.activeWord;
                            }

                            const wordStyle = {
                                color: manualHighlight && theme.id !== 'day' ? '#fefce8' : wordColor,
                                fontWeight: wordWeight,
                                backgroundColor: backgroundColor,
                                fontSize: dynamicSize,
                                fontFamily: type === 'formula' ? (Platform.OS === 'ios' ? 'Georgia' : 'serif') : flatStyle.fontFamily,
                                fontStyle: wordStyleProp,
                                lineHeight: flatStyle.lineHeight,
                                textDecorationLine: wordDecor,
                                letterSpacing: flatStyle.letterSpacing,
                                includeFontPadding: false,
                                textAlignVertical: 'center' as any
                            };

                            if (isSpace) {
                                return (
                                    <Text key={`${key}-${index}`} style={wordStyle}>
                                        {word}
                                    </Text>
                                );
                            }

                            const isInteractive = isHighlightMode || (isLink && linkUrl) || isUrl || tapToDefineEnabled;

                            return (
                                <Text
                                    key={`${key}-${index}`}
                                    style={wordStyle}
                                    onPressIn={(e) => {
                                        const { pageX, pageY } = e.nativeEvent;
                                        pressTrackerRef.current = { time: Date.now(), x: pageX, y: pageY };
                                    }}
                                    onPress={isInteractive ? (e) => {
                                        const { pageX, pageY } = e.nativeEvent;
                                        const { time, x, y } = pressTrackerRef.current;

                                        const duration = Date.now() - time;
                                        const dist = Math.sqrt(Math.pow(pageX - x, 2) + Math.pow(pageY - y, 2));

                                        // Ignore if long press (>350ms) OR moved significantly (>10px) (Drag/Selection)
                                        if (duration > 350 || dist > 10) {
                                            return;
                                        }

                                        if (isHighlightMode) {
                                            onHighlightPress && onHighlightPress({
                                                start: paragraphOffset,
                                                end: paragraphOffset + totalLength,
                                                text: "Paragraph Highlight"
                                            });
                                        } else if (isLink && linkUrl) {
                                            const handled = onLinkPress && onLinkPress(linkUrl);
                                            if (handled) return;
                                            Linking.openURL(linkUrl).catch(err => Alert.alert("Error", "Cannot open this link."));
                                        } else if (isUrl) {
                                            const cleanUrl = word.replace(/[.,;)]$/, '');
                                            Linking.openURL(cleanUrl).catch(err => Alert.alert("Error", "Cannot open this link."));
                                        } else if (tapToDefineEnabled) {
                                            onWordPress?.(word.replace(/[.,/#!$%^&*;:{}=\-_`~()"'?]/g, ""));
                                        }
                                    } : undefined}
                                >
                                    {word}
                                </Text>
                            );
                        })}
                    </Text>
                );
            })}
        </Text>
    );
}, (prev, next) => {
    // Flatten styles to compare properties correctly (handles array styles)
    const prevStyle = StyleSheet.flatten(prev.style) || {};
    const nextStyle = StyleSheet.flatten(next.style) || {};

    // 1. Check standard props (Primitive & References)
    if (prev.rawText !== next.rawText ||
        prev.paragraphOffset !== next.paragraphOffset ||
        prev.theme.id !== next.theme.id ||
        prev.theme.text !== next.theme.text || // NEW: Explicitly check for theme text color change
        prev.theme.bg !== next.theme.bg ||     // NEW: Check for background changes
        prev.isHighlightMode !== next.isHighlightMode ||
        prev.tapToDefineEnabled !== next.tapToDefineEnabled ||
        prevStyle.fontSize !== nextStyle.fontSize ||
        prevStyle.fontFamily !== nextStyle.fontFamily ||
        prevStyle.fontWeight !== nextStyle.fontWeight ||
        prevStyle.color !== nextStyle.color || // NEW: Explicitly check style prop color
        prevStyle.fontStyle !== nextStyle.fontStyle ||
        prevStyle.textDecorationLine !== nextStyle.textDecorationLine ||
        prevStyle.letterSpacing !== nextStyle.letterSpacing
    ) {
        return false; // Re-render needed
    }

    // 2. Optimization: Active Sentence Check
    // Only re-render if the active sentence INTERSECTS this paragraph.
    const pStart = next.paragraphOffset || 0;
    // Use raw length as a safe upper bound
    const pEnd = pStart + next.rawText.length + 50;

    // Helper to check intersection for Sentence
    const sentenceIntersects = (range: any) => {
        if (!range) return false;
        return (range.start < pEnd && range.end > pStart);
    };

    const prevActive = prev.activeSentence;
    const nextActive = next.activeSentence;

    const wasHighlighted = sentenceIntersects(prevActive);
    const isHighlighted = sentenceIntersects(nextActive);

    // If highlight status changed (e.g., entered or left this paragraph), re-render
    if (wasHighlighted !== isHighlighted) return false;
    // If still highlighted, check if bounds changed
    if (wasHighlighted && isHighlighted && prevActive && nextActive) {
        if ((prevActive as any).start !== (nextActive as any).start || (prevActive as any).end !== (nextActive as any).end) return false;
    }

    // 3. Smart Manual Highlight Check
    // If global highlights array reference changed, check if it actually affects THIS paragraph
    if (prev.highlights !== next.highlights) {
        const getRelevant = (list: any[] | undefined) => (list || []).filter(h => h.start < pEnd && h.end > pStart);

        const prevRelevant = getRelevant(prev.highlights || []);
        const nextRelevant = getRelevant(next.highlights || []);

        // Fast length check first
        if (prevRelevant.length !== nextRelevant.length) return false;

        // Deep check items without JSON.stringify for speed
        for (let i = 0; i < prevRelevant.length; i++) {
            const p = prevRelevant[i];
            const n = nextRelevant[i];
            if (p.id !== n.id || p.start !== n.start || p.end !== n.end || p.color !== n.color) {
                return false;
            }
        }
    }

    return true; // Props are effectively equal
});

export default InteractiveText;
