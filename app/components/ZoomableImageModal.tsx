import { Minus, Plus, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Modal, PanResponder, Text, TouchableOpacity, View } from 'react-native';

interface ZoomableImageModalProps {
    visible: boolean;
    uri: string | null;
    onClose: () => void;
}

const ZoomableImageModal: React.FC<ZoomableImageModalProps> = ({ visible, uri, onClose }) => {
    const [scale, setScale] = useState(1);
    const scaleRef = useRef(1); // To access in PanResponder

    const [pan, setPan] = useState({ x: 0, y: 0 });
    const panRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (visible) {
            setScale(1);
            scaleRef.current = 1;
            setPan({ x: 0, y: 0 });
            panRef.current = { x: 0, y: 0 };
        }
    }, [visible]);

    const updateScale = (newScale: number) => {
        const s = Math.max(1, Math.min(newScale, 4));
        setScale(s);
        scaleRef.current = s;
        if (s === 1) {
            setPan({ x: 0, y: 0 });
            panRef.current = { x: 0, y: 0 };
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => scaleRef.current > 1,
            onMoveShouldSetPanResponder: () => scaleRef.current > 1,
            onPanResponderGrant: () => { },
            onPanResponderMove: (evt, gestureState) => {
                if (scaleRef.current > 1) {
                    // Update state less frequently or use Animated for better performance,
                    // but for this simple modal, setting state on move is okay.
                    // Ideally we should accumulate delta to previous offset, but here we reset on grant?
                    // The original code used direct state updates from move.
                    // To handle continuous dragging, we need to track accumulated offset.
                    // The simpler version from index.tsx:
                    // setPan({ x: panRef.current.x + gestureState.dx, y: panRef.current.y + gestureState.dy });
                    // This creates a smoother drag.

                    // Note: Original code logic:
                    /*
                    onPanResponderMove: (evt, gestureState) => {
                        if (scaleRef.current > 1) {
                            setPan({
                                x: panRef.current.x + gestureState.dx,
                                y: panRef.current.y + gestureState.dy
                            });
                        }
                    },
                    onPanResponderRelease: (evt, gestureState) => {
                        if (scaleRef.current > 1) {
                            panRef.current = {
                                x: panRef.current.x + gestureState.dx,
                                y: panRef.current.y + gestureState.dy
                            };
                        }
                    }
                    */

                    // We replicate the exact logic to maintain behavior.
                    if (scaleRef.current > 1) {
                        setPan({
                            x: panRef.current.x + gestureState.dx,
                            y: panRef.current.y + gestureState.dy
                        });
                    }
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (scaleRef.current > 1) {
                    panRef.current = {
                        x: panRef.current.x + gestureState.dx,
                        y: panRef.current.y + gestureState.dy
                    };
                }
            }
        })
    ).current;

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <View
                    {...panResponder.panHandlers}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    {uri && (
                        <Image
                            source={{ uri }}
                            style={{
                                width: '100%',
                                height: '100%',
                                transform: [
                                    { scale: scale },
                                    { translateX: pan.x / scale },
                                    { translateY: pan.y / scale }
                                ]
                            }}
                            resizeMode="contain"
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={{ position: 'absolute', top: 50, right: 30, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 }}
                    onPress={onClose}
                >
                    <X size={30} color="white" />
                </TouchableOpacity>

                <View style={{ position: 'absolute', bottom: 50, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, zIndex: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 30, padding: 12 }} onPress={() => updateScale(scale - 0.5)}>
                        <Minus size={24} color="white" />
                    </TouchableOpacity>

                    <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{Math.round(scale * 100)}%</Text>
                    </View>

                    <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 30, padding: 12 }} onPress={() => updateScale(scale + 0.5)}>
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ZoomableImageModal;
