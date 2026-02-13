import { ArrowLeftRight, Eye, LayoutGrid, List, Maximize2, Minus, Plus } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { SimpleTableProps } from '../../src/types';
import ColumnResizeSlider from './ColumnResizeSlider';

const SimpleTable: React.FC<SimpleTableProps> = ({
    rows = [],
    theme,
    onExpand,
    isFullScreen = false,
    initiallyHidden = false,
    toggleLabel = "Show Answers",
    fontSize = 1.0,
    initialCustomWidths = {},
    onSaveWidths
}) => {
    const { width: windowWidth } = useWindowDimensions();
    const [customWidths, setCustomWidths] = useState<Record<number, number>>(initialCustomWidths);
    const [resizingCol, setResizingCol] = useState<{ index: number; width: number } | null>(null);
    const [isVisible, setIsVisible] = useState(!initiallyHidden);
    const [isTextMode, setIsTextMode] = useState(false);

    const BASE_FONT_SIZE = 16;
    const scaledFontSize = BASE_FONT_SIZE * fontSize;
    const headerFontSize = 11 * fontSize;

    if (!rows || rows.length === 0) return null;

    if (!isVisible) {
        return (
            <TouchableOpacity
                onPress={() => setIsVisible(true)}
                style={{
                    marginVertical: 15,
                    backgroundColor: theme.uiBg,
                    padding: 15,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    borderStyle: 'dashed'
                }}
            >
                <Eye size={20} color={theme.id === 'day' ? '#2563eb' : theme.primary} />
                <Text style={{ color: theme.id === 'day' ? '#2563eb' : theme.primary, fontWeight: 'bold', fontSize: 14 * fontSize }}>{toggleLabel}</Text>
            </TouchableOpacity>
        );
    }

    const parsedRows = rows.map(row => {
        const content = row.trim().replace(/^\||\|$/g, '');
        return content.split('|').map(cell => cell.trim());
    });

    const dataRows = parsedRows.filter(rowCells => {
        const str = rowCells.join('');
        return !/^[\s\-:]+$/.test(str);
    });

    if (dataRows.length === 0) return null;

    let headers: string[] = [];
    let body: string[][] = [];

    if (dataRows.length === 1) {
        headers = dataRows[0].map((_, i) => `Column ${i + 1}`);
        body = dataRows;
    } else {
        headers = dataRows[0];
        body = dataRows.slice(1);
    }

    const colWidths = useMemo(() => {
        if (!Array.isArray(headers) || !Array.isArray(body)) return [];
        const contentWidths = headers.map(() => 0);
        const charPixelWidth = scaledFontSize * 0.6;

        body.forEach(row => {
            row.forEach((cell, idx) => {
                if (idx < contentWidths.length) {
                    const cellWidth = (cell.length * charPixelWidth) + 24;
                    if (cellWidth > contentWidths[idx]) {
                        contentWidths[idx] = cellWidth;
                    }
                }
            });
        });

        const headerWidths = headers.map(h => (h.length * charPixelWidth) + 24);
        const calculatedWidths = contentWidths.map((cWidth, i) => {
            const hWidth = headerWidths[i];
            const maxHeaderInfluence = 110 * fontSize;
            let finalWidth = cWidth;

            if (cWidth < hWidth) {
                finalWidth = Math.max(cWidth, Math.min(hWidth, maxHeaderInfluence));
            }

            const min = isFullScreen ? 80 * fontSize : 70 * fontSize;
            const max = isFullScreen ? 500 * fontSize : 300 * fontSize;
            return Math.max(min, Math.min(finalWidth, max));
        });

        const availableWidth = windowWidth - 40;
        const totalCalculatedWidth = calculatedWidths.reduce((sum, w) => sum + w, 0);
        let finalWidths = calculatedWidths;

        if (totalCalculatedWidth < availableWidth) {
            const extraSpace = availableWidth - totalCalculatedWidth;
            const extraPerCol = extraSpace / calculatedWidths.length;
            finalWidths = calculatedWidths.map(w => w + extraPerCol);
        }

        return finalWidths.map((w, i) => customWidths[i] !== undefined ? customWidths[i] : w);
    }, [headers, body, isFullScreen, windowWidth, customWidths, scaledFontSize, fontSize]);

    const renderCellText = (text: string, isHeader: boolean) => {
        const parts = text.split(/(\*\*.*?\*\*|\$.*?\$|\*[^*]+?\*)/g);
        return (
            <Text style={{ fontSize: scaledFontSize, textAlign: isHeader ? 'center' : 'left', lineHeight: scaledFontSize * 1.4 }}>
                {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                        return <Text key={index} style={{ fontWeight: 'bold', color: theme.id === 'day' ? '#2563eb' : theme.primary }}>{part.slice(2, -2)}</Text>;
                    } else if (part.startsWith('$') && part.endsWith('$') && part.length >= 3) {
                        return <Text key={index} style={{ fontWeight: 'bold', color: theme.id === 'day' ? '#ea580c' : '#fb923c' }}>{part.slice(1, -1)}</Text>;
                    } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 3) {
                        return <Text key={index} style={{ fontStyle: 'italic', color: theme.id === 'day' ? '#9333ea' : '#c084fc' }}>{part.slice(1, -1)}</Text>;
                    }
                    return <Text key={index} style={{ fontWeight: isHeader ? 'bold' : 'normal', color: theme.text }}>{part}</Text>;
                })}
            </Text>
        );
    };

    const handleColumnResize = (delta: number) => {
        if (!resizingCol) return;
        setResizingCol(prev => {
            if (!prev) return null;
            const newWidth = Math.max(50, Math.min(600, prev.width + delta));
            setCustomWidths(cw => {
                const next = { ...cw, [prev.index]: newWidth };
                if (onSaveWidths) onSaveWidths(prev.index, newWidth);
                return next;
            });
            return { ...prev, width: newWidth };
        });
    };

    const handleSliderResize = (val: number) => {
        if (!resizingCol) return;
        const newWidth = Math.round(Math.max(50, Math.min(600, val)));
        setResizingCol(prev => {
            if (!prev || prev.width === newWidth) return prev;
            setCustomWidths(cw => {
                const next = { ...cw, [prev.index]: newWidth };
                if (onSaveWidths) onSaveWidths(prev.index, newWidth);
                return next;
            });
            return { ...prev, width: newWidth };
        });
    };

    const resetColumnWidth = () => {
        if (!resizingCol) return;
        setCustomWidths(cw => {
            const newCw = { ...cw };
            delete newCw[resizingCol.index];
            if (onSaveWidths) onSaveWidths(resizingCol.index, null);
            return newCw;
        });
        setResizingCol(null);
    };

    return (
        <View style={{ marginVertical: isFullScreen ? 0 : 15, flex: isFullScreen ? 1 : 0 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.7, flex: 1 }}>
                    {!isTextMode && !isFullScreen && (
                        <>
                            <ArrowLeftRight size={12} color={theme.secondary} style={{ marginRight: 4 }} />
                            <Text style={{ fontSize: 10, color: theme.secondary, fontStyle: 'italic' }}>Long press column to resize</Text>
                        </>
                    )}
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        onPress={() => setIsTextMode(!isTextMode)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            backgroundColor: theme.uiBg,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: theme.border,
                        }}
                    >
                        {isTextMode ? (
                            <LayoutGrid size={12} color={theme.secondary} style={{ marginRight: 4 }} />
                        ) : (
                            <List size={12} color={theme.secondary} style={{ marginRight: 4 }} />
                        )}
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: theme.secondary, textTransform: 'uppercase' }}>
                            {isTextMode ? "Grid" : "Cards"}
                        </Text>
                    </TouchableOpacity>
                    {!isFullScreen && (
                        <TouchableOpacity
                            onPress={() => onExpand && onExpand(rows)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 6,
                                paddingHorizontal: 10,
                                backgroundColor: theme.uiBg,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: theme.border,
                            }}
                        >
                            <Maximize2 size={12} color={theme.secondary} style={{ marginRight: 4 }} />
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: theme.secondary, textTransform: 'uppercase' }}>Expand</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isTextMode ? (
                <View>
                    {body.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: theme.secondary, fontStyle: 'italic' }}>No data rows to display.</Text>
                        </View>
                    ) : (
                        body.map((row, rowIndex) => (
                            <View key={rowIndex} style={{ backgroundColor: theme.uiBg, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.border, marginBottom: 12 }}>
                                {row.map((cell, cellIndex) => {
                                    const headerText = headers[cellIndex] || "";
                                    const cleanHeader = headerText.replace(/\*\*/g, '').trim();
                                    return (
                                        <View key={cellIndex} style={{ marginBottom: 8 }}>
                                            <Text style={{ fontSize: headerFontSize, color: theme.secondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 }}>
                                                {cleanHeader}
                                            </Text>
                                            {renderCellText(cell, false)}
                                        </View>
                                    );
                                })}
                            </View>
                        ))
                    )}
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{
                        borderWidth: 1,
                        borderColor: theme.border,
                        borderRadius: 8,
                        overflow: 'hidden',
                        backgroundColor: theme.bg
                    }}>
                        <View style={{ flexDirection: 'row', backgroundColor: theme.id === 'day' ? '#f1f5f9' : theme.highlight }}>
                            {headers.map((cell, i) => (
                                <TouchableOpacity
                                    key={i}
                                    activeOpacity={0.8}
                                    onLongPress={() => setResizingCol({ index: i, width: colWidths[i] })}
                                    delayLongPress={300}
                                    style={{
                                        padding: 12,
                                        width: colWidths[i],
                                        borderRightWidth: 1,
                                        borderRightColor: theme.border,
                                        borderBottomWidth: 2,
                                        borderBottomColor: theme.border,
                                        justifyContent: 'center',
                                        backgroundColor: theme.id === 'day' ? '#e2e8f0' : theme.highlight
                                    }}
                                >
                                    {renderCellText(cell, true)}
                                </TouchableOpacity>
                            ))}
                        </View>
                        {body.map((row, rowIndex) => (
                            <View key={rowIndex} style={{ flexDirection: 'row', backgroundColor: rowIndex % 2 === 0 ? theme.bg : theme.uiBg }}>
                                {row.map((cell, cellIndex) => (
                                    <TouchableOpacity
                                        key={cellIndex}
                                        activeOpacity={1}
                                        onLongPress={() => setResizingCol({ index: cellIndex, width: colWidths[cellIndex] })}
                                        delayLongPress={300}
                                        style={{
                                            padding: 12,
                                            width: colWidths[cellIndex] || 60,
                                            borderRightWidth: 1,
                                            borderRightColor: theme.border,
                                            borderBottomWidth: 1,
                                            borderBottomColor: theme.border,
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        {renderCellText(cell, false)}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}

            <Modal visible={!!resizingCol} transparent animationType="fade" onRequestClose={() => setResizingCol(null)}>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={1}
                    onPress={() => setResizingCol(null)}
                >
                    <TouchableWithoutFeedback>
                        <View style={{ backgroundColor: theme.bg, padding: 20, borderRadius: 16, width: '85%', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 5 }}>Adjust Column Width</Text>
                            <Text style={{ fontSize: 12, color: theme.secondary, marginBottom: 20 }}>Column {resizingCol ? resizingCol.index + 1 : ''}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25, width: '100%' }}>
                                <TouchableOpacity onPress={() => handleColumnResize(-10)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.buttonBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.border }}>
                                    <Minus size={20} color={theme.text} />
                                </TouchableOpacity>
                                <ColumnResizeSlider
                                    value={resizingCol?.width || 100}
                                    min={50}
                                    max={600}
                                    onValueChange={handleSliderResize}
                                    theme={theme}
                                />
                                <TouchableOpacity onPress={() => handleColumnResize(10)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.buttonBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.border }}>
                                    <Plus size={20} color={theme.text} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                                <TouchableOpacity onPress={resetColumnWidth} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: theme.buttonBg, alignItems: 'center' }}>
                                    <Text style={{ color: theme.text, fontWeight: 'bold' }}>Reset Auto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setResizingCol(null)} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: theme.id === 'day' ? theme.primary : '#22c55e', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default SimpleTable;
