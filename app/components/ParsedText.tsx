import React, { useMemo } from 'react';
import { Platform, Text, View } from 'react-native';
import { ParsedTextProps } from '../_types';
import SimpleTable from './SimpleTable';

interface ParsedPart {
    type: 'text' | 'table' | 'code' | 'header';
    content: string | string[];
}

const ParsedText: React.FC<ParsedTextProps> = ({ text, style, theme, onExpand }) => {
    const parts = useMemo<ParsedPart[]>(() => {
        if (!text || typeof text !== 'string') return [];
        const lines = text.split('\n');
        const result: ParsedPart[] = [];

        let buffer: string[] = [];
        let state: 'text' | 'table' | 'code' = 'text';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (state === 'text') {
                if (trimmed.startsWith('```')) {
                    if (buffer.length > 0) { result.push({ type: 'text', content: buffer.join('\n') }); buffer = []; }
                    state = 'code';
                } else if (trimmed.startsWith('|')) {
                    if (buffer.length > 0) { result.push({ type: 'text', content: buffer.join('\n') }); buffer = []; }
                    buffer.push(trimmed);
                    state = 'table';
                } else if (trimmed.startsWith('###')) {
                    if (buffer.length > 0) { result.push({ type: 'text', content: buffer.join('\n') }); buffer = []; }
                    result.push({ type: 'header', content: trimmed.replace(/^###\s*/, '') });
                } else {
                    buffer.push(line);
                }
            }
            else if (state === 'code') {
                if (trimmed.startsWith('```')) {
                    result.push({ type: 'code', content: buffer.join('\n') });
                    buffer = [];
                    state = 'text';
                } else {
                    buffer.push(line);
                }
            }
            else if (state === 'table') {
                if (trimmed.startsWith('|')) {
                    buffer.push(trimmed);
                } else {
                    result.push({ type: 'table', content: [...buffer] });
                    buffer = [];
                    state = 'text';
                    if (trimmed.startsWith('```')) state = 'code';
                    else buffer.push(line);
                }
            }
        }

        if (buffer.length > 0) {
            if (state === 'table') result.push({ type: 'table', content: buffer });
            else if (state === 'code') result.push({ type: 'code', content: buffer.join('\n') });
            else result.push({ type: 'text', content: buffer.join('\n') });
        }

        return result;
    }, [text]);

    const renderRichText = (content: string) => {
        const segments = content.split(/(\*\*.*?\*\*|\$.*?\$|\*[^*]+?\*)/g);

        return (
            <Text style={style}>
                {segments.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                        return (
                            <Text
                                key={index}
                                style={{
                                    fontWeight: 'bold',
                                    color: theme.id === 'day' ? '#2563eb' : theme.primary
                                }}
                            >
                                {part.slice(2, -2)}
                            </Text>
                        );
                    } else if (part.startsWith('$') && part.endsWith('$') && part.length >= 3) {
                        return (
                            <Text
                                key={index}
                                style={{
                                    fontWeight: 'bold',
                                    color: theme.id === 'day' ? '#ea580c' : '#fb923c'
                                }}
                            >
                                {part.slice(1, -1)}
                            </Text>
                        );
                    } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 3) {
                        return (
                            <Text
                                key={index}
                                style={{
                                    fontStyle: 'italic',
                                    color: theme.id === 'day' ? '#9333ea' : '#c084fc'
                                }}
                            >
                                {part.slice(1, -1)}
                            </Text>
                        );
                    }
                    return <Text key={index}>{part}</Text>;
                })}
            </Text>
        );
    };

    return (
        <View>
            {parts.map((part, index) => {
                if (part.type === 'text') {
                    const content = typeof part.content === 'string' ? part.content : part.content.join('\n');
                    return <View key={index}>{renderRichText(content)}</View>;
                } else if (part.type === 'header') {
                    const content = typeof part.content === 'string' ? part.content : part.content.join('\n');
                    return (
                        <Text
                            key={index}
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: theme.text,
                                marginTop: 15,
                                marginBottom: 10
                            }}
                        >
                            {content}
                        </Text>
                    );
                } else if (part.type === 'code') {
                    const content = typeof part.content === 'string' ? part.content : part.content.join('\n');
                    return (
                        <View
                            key={index}
                            style={{
                                backgroundColor: theme.id === 'day' ? '#f1f5f9' : theme.highlight,
                                padding: 12,
                                borderRadius: 8,
                                marginVertical: 10,
                                borderLeftWidth: 3,
                                borderLeftColor: theme.primary
                            }}
                        >
                            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 14, color: theme.text }}>
                                {content}
                            </Text>
                        </View>
                    );
                } else if (part.type === 'table') {
                    const rows = Array.isArray(part.content) ? part.content : [part.content];
                    return <SimpleTable key={index} rows={rows} theme={theme} onExpand={onExpand} />;
                }
                return null;
            })}
        </View>
    );
};

export default ParsedText;
