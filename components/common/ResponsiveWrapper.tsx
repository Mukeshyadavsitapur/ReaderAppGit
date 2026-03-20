// e:\ReaderAppGit\components\common\ResponsiveWrapper.tsx
import React from 'react';
import { View, Platform, useWindowDimensions, StyleSheet } from 'react-native';

interface ResponsiveWrapperProps {
    children: React.ReactNode;
    maxWidth?: number;
    style?: any;
    contentContainerStyle?: any;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ 
    children, 
    maxWidth = 1000, 
    style,
    contentContainerStyle 
}) => {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    
    // On web, if the screen is wider than the specified maxWidth, 
    // we center the content and limit its width.
    const shouldConstrain = isWeb && width > maxWidth;

    return (
        <View style={[styles.outerContainer, style]}>
            <View style={[
                styles.innerContainer, 
                shouldConstrain ? { maxWidth, alignSelf: 'center', width: '100%' } : { width: '100%' },
                contentContainerStyle
            ]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        width: '100%',
    },
    innerContainer: {
        flex: 1,
    },
});

export default ResponsiveWrapper;
