import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Mixins} from "../../styles";
import {OfflineStatusBar} from "../molecules";
import * as Colors from "../../styles/colors";

//todo : add check update

const ScreenLayout = ({extraStyle, backgroundColor, paddingSides, children}) => {
    const style = StyleSheet.create({
        screenLayout: {
            flex: 1,
            position: 'absolute',
            backgroundColor: backgroundColor || Colors.PRIMARY,
            width: '100%',
            paddingLeft: paddingSides || null,
            paddingRight: paddingSides || null,
            height: '100%',
            minHeight: Math.round(Mixins.WINDOW_HEIGHT),
            alignItems: 'center',
            ...extraStyle
        }
    });

    return (
        <View style={style.screenLayout}>
            <OfflineStatusBar/>
            {children}
        </View>
    );
};


export default ScreenLayout;
