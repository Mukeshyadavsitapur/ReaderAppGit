import React, { useRef } from 'react';
import { LayoutChangeEvent, PanResponder, View } from 'react-native';
import { Theme } from '../_types';

interface ColumnResizeSliderProps {
    value: number;
    min: number;
    max: number;
    onValueChange: (value: number) => void;
    theme: Theme;
}

const ColumnResizeSlider: React.FC<ColumnResizeSliderProps> = ({ value, min, max, onValueChange, theme }) => {
    const widthRef = useRef(0);
    const activeColor = theme.id === 'day' ? '#2563eb' : theme.primary;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => { },
            onPanResponderMove: (evt, _) => {
                if (widthRef.current > 0) {
                    const { locationX } = evt.nativeEvent;
                    const clampedX = Math.max(0, Math.min(locationX, widthRef.current));
                    const ratio = clampedX / widthRef.current;
                    const newValue = min + (ratio * (max - min));
                    onValueChange(newValue);
                }
            },
            onPanResponderRelease: (evt, _) => {
                if (widthRef.current > 0) {
                    const { locationX } = evt.nativeEvent;
                    const clampedX = Math.max(0, Math.min(locationX, widthRef.current));
                    const ratio = clampedX / widthRef.current;
                    const newValue = min + (ratio * (max - min));
                    onValueChange(newValue);
                }
            }
        })
    ).current;

    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return (
        <View
            style={{ flex: 1, height: 40, justifyContent: 'center', marginHorizontal: 10 }}
            onLayout={(e: LayoutChangeEvent) => widthRef.current = e.nativeEvent.layout.width}
            {...panResponder.panHandlers}
        >
            <View style={{ height: 6, backgroundColor: theme.border, borderRadius: 3, width: '100%', overflow: 'hidden' }}>
                <View style={{ width: `${percentage}%`, height: '100%', backgroundColor: activeColor }} />
            </View>
            <View style={{
                position: 'absolute',
                left: `${percentage}%`,
                marginLeft: -12, // Thumb center
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: activeColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 3,
                zIndex: 10
            }} />
        </View>
    );
};

export default ColumnResizeSlider;
