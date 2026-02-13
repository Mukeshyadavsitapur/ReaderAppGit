import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, View } from 'react-native';
import { Theme } from '../_types';

interface SeekSliderProps {
    value: number;
    min: number;
    max: number;
    onSeekEnd: (val: number) => void;
    theme: Theme;
    activeColor?: string;
}

const SeekSlider: React.FC<SeekSliderProps> = ({
    value,
    min,
    max,
    onSeekEnd,
    theme,
    activeColor = '#3b82f6'
}) => {
    const [dragValue, setDragValue] = useState(value);
    const [isPressed, setIsPressed] = useState(false);
    const widthRef = useRef(0);
    const isDragging = useRef(false);

    useEffect(() => {
        if (!isDragging.current) {
            setDragValue(value);
        }
    }, [value]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                isDragging.current = true;
                setIsPressed(true);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (widthRef.current > 0) {
                    const { locationX } = evt.nativeEvent;
                    const ratio = Math.max(0, Math.min(1, locationX / widthRef.current));
                    const newValue = min + (ratio * (max - min));
                    setDragValue(newValue);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (widthRef.current > 0) {
                    const { locationX } = evt.nativeEvent;
                    const ratio = Math.max(0, Math.min(1, locationX / widthRef.current));
                    const finalValue = min + (ratio * (max - min));
                    setDragValue(finalValue);
                    onSeekEnd(finalValue);
                }
                isDragging.current = false;
                setIsPressed(false);
            },
            onPanResponderTerminate: () => {
                isDragging.current = false;
                setIsPressed(false);
            }
        })
    ).current;

    const percentage = Math.min(100, Math.max(0, ((dragValue - min) / (max - min || 1)) * 100));

    // Dynamic visual styles for interactivity
    const thumbSize = isPressed ? 28 : 22;

    return (
        <View
            style={{ height: 40, justifyContent: 'center' }}
            onLayout={(e: LayoutChangeEvent) => widthRef.current = e.nativeEvent.layout.width}
            {...panResponder.panHandlers}
        >
            <View style={{ height: 6, backgroundColor: theme.border, borderRadius: 3, width: '100%', overflow: 'hidden' }}>
                <View style={{ width: `${percentage}%`, height: '100%', backgroundColor: activeColor }} />
            </View>

            <View style={{
                position: 'absolute',
                left: `${percentage}%`,
                marginLeft: -thumbSize / 2,
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                backgroundColor: 'white',
                borderWidth: isPressed ? 6 : 4,
                borderColor: activeColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
                transform: [{ scale: isPressed ? 1.1 : 1 }]
            }} />
        </View>
    );
};

export default SeekSlider;
