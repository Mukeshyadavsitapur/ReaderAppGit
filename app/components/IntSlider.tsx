import { Minus, Plus } from 'lucide-react-native';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../_types';

interface IntSliderProps {
    value: number;
    min: number;
    max: number;
    onValueChange: (val: number) => void;
    label: string;
    theme: Theme;
    step?: number;
    usageText?: string;
    formatValue?: (val: number) => string;
}

const IntSlider: React.FC<IntSliderProps> = ({
    value,
    min,
    max,
    onValueChange,
    label,
    theme,
    step = 50,
    usageText,
    formatValue
}) => {
    const percentage: number = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    const activeColor: string = theme.id === 'day' ? '#2563eb' : theme.primary;

    const handleDecrease = (): void => {
        const newValue: number = Math.max(min, value - step);
        onValueChange(newValue);
    };

    const handleIncrease = (): void => {
        const newValue: number = Math.min(max, value + step);
        onValueChange(newValue);
    };

    return (
        <View style={{ marginBottom: 25 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={[styles.appearanceLabel, { color: theme ? theme.secondary : '#64748b', marginBottom: 4, paddingBottom: 0 }]}>{label}</Text>
                    {usageText && (
                        <Text style={{ fontSize: 11, color: theme.secondary, fontWeight: '500' }}>{usageText}</Text>
                    )}
                </View>
                <Text style={{ color: theme ? theme.text : '#64748b', fontWeight: '600' }}>
                    {formatValue ? formatValue(value) : `${value} Limit`}
                </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                    onPress={handleDecrease}
                    style={{
                        width: 36, height: 36,
                        borderRadius: 18,
                        backgroundColor: theme ? theme.buttonBg : '#f1f5f9',
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 1, borderColor: theme ? theme.border : '#e2e8f0'
                    }}
                >
                    <Minus size={20} color={theme ? theme.text : '#0f172a'} />
                </TouchableOpacity>

                <View
                    style={{ flex: 1, height: 30, justifyContent: 'center' }}
                    onTouchEnd={(e: GestureResponderEvent) => {
                        const { locationX } = e.nativeEvent;
                        const width: number = 200; // Approximate width of track
                        const ratio: number = Math.max(0, Math.min(1, locationX / width));
                        const rawValue: number = min + (ratio * (max - min));
                        // Snap to step
                        const steppedValue: number = Math.round(rawValue / step) * step;
                        onValueChange(Math.min(max, Math.max(min, steppedValue)));
                    }}
                >
                    <View style={{ height: 8, backgroundColor: theme ? theme.border : '#e2e8f0', borderRadius: 4, width: '100%', overflow: 'hidden' }}>
                        <View style={{ width: `${percentage}%`, height: '100%', backgroundColor: activeColor }} />
                    </View>
                    <View style={{
                        position: 'absolute',
                        left: `${percentage}%`,
                        marginLeft: -16,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: activeColor,
                        borderWidth: 2,
                        borderColor: theme ? theme.bg : 'white',
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleIncrease}
                    style={{
                        width: 36, height: 36,
                        borderRadius: 18,
                        backgroundColor: theme ? theme.buttonBg : '#f1f5f9',
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 1, borderColor: theme ? theme.border : '#e2e8f0'
                    }}
                >
                    <Plus size={20} color={theme ? theme.text : '#0f172a'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    appearanceLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
});

export default IntSlider;
