import { Sparkles } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, Text, TouchableOpacity } from 'react-native';
import { Theme } from '../_types';

interface DraggableFABProps {
    onPress: () => void;
    theme: Theme;
    primaryColor: string;
    initialPosition?: { x: number; y: number };
    onPositionChange?: (pos: { x: number; y: number }) => void;
    label?: string;
}

const DraggableFAB: React.FC<DraggableFABProps> = ({
    onPress,
    theme,
    primaryColor,
    initialPosition,
    onPositionChange,
    label
}) => {
    const pan = useRef(new Animated.ValueXY(initialPosition || { x: 0, y: 0 })).current;
    const val = useRef(initialPosition || { x: 0, y: 0 });

    useEffect(() => {
        const id = pan.addListener((value) => (val.current = value));
        return () => pan.removeListener(id);
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: val.current.x,
                    y: val.current.y
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset();
                if (onPositionChange) {
                    onPositionChange(val.current);
                }
            }
        })
    ).current;

    return (
        <Animated.View
            style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
                position: 'absolute',
                bottom: 100,
                right: 30,
                zIndex: 9999,
            }}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={{
                    backgroundColor: primaryColor,
                    height: 56,
                    borderRadius: 28,
                    flexDirection: 'row', // Added for label
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: label ? 20 : 0, // Padding for label
                    minWidth: 56,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 6
                }}
            >
                <Sparkles size={24} color="white" />
                {label && (
                    <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }}>
                        {label}
                    </Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

export default DraggableFAB;
