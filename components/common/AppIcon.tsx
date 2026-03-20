import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface AppIconProps {
    size?: number;
    style?: StyleProp<ImageStyle>;
    tintColor?: string;
    monochrome?: boolean;
}

const AppIcon: React.FC<AppIconProps> = ({ size = 24, style, tintColor, monochrome = false }) => {
    return (
        <Image 
            source={monochrome 
                ? require('../../assets/images/android-icon-monochrome.png')
                : require('../../assets/images/icon.png')}
            style={[
                { width: size, height: size },
                style,
                tintColor ? { tintColor } : null
            ]}
            resizeMode="contain"
        />
    );
};

export default AppIcon;
