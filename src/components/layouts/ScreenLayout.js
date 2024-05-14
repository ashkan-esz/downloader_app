import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Mixins} from "../../styles";
import * as Colors from "../../styles/colors";


const ScreenLayout = ({extraStyle, backgroundColor, paddingSides, children}) => {
    const propBasedStyles = useMemo(() => ({
        backgroundColor: backgroundColor || Colors.PRIMARY,
        paddingLeft: paddingSides || null,
        paddingRight: paddingSides || null,
    }), [backgroundColor, paddingSides]);

    return (
        <View style={[style.screenLayout, propBasedStyles, extraStyle]}>
            {children}
        </View>
    );
};

const style = StyleSheet.create({
    screenLayout: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        minHeight: Math.round(Mixins.WINDOW_HEIGHT),
        alignItems: 'center',
    }
});

export default ScreenLayout;
