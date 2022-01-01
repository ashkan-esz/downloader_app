import React from 'react';
import {StyleSheet} from "react-native";
import Toast, {BaseToast} from 'react-native-toast-message';
import FastImage from "react-native-fast-image";
import {MaterialIcons} from "@expo/vector-icons";
import {Colors} from "../../styles";


const RootToast = () => {
    const toastConfig = {
        linkToClipboard: ({text1, props, ...rest}) => (
            <BaseToast
                {...rest}
                style={style.linkToClipboardStyle}
                text1Style={style.text}
                text1={text1}
                renderLeadingIcon={() => <FastImage
                    style={style.linkIcon}
                    source={require('../../assets/icons/link.png')}
                />}
            />
        ),
        error: ({text1, props, ...rest}) => (
            <BaseToast
                {...rest}
                style={style.errorStyle}
                text1Style={style.text}
                text1={text1}
                renderLeadingIcon={() => <MaterialIcons
                    name="error-outline"
                    size={34}
                    color="black"
                    style={style.errorIcon}
                />}
            />
        ),
    };

    return (
        <Toast
            config={toastConfig}
        />
    );
};

const style = StyleSheet.create({
    linkToClipboardStyle: {
        borderLeftColor: 'red',
        height: 40,
        marginBottom: -20,
        width: '100%',
    },
    errorStyle: {
        borderLeftColor: Colors.NAVBAR,
        backgroundColor: Colors.NAVBAR,
        height: 40,
        marginBottom: -20,
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        marginLeft: -15,
        width: '100%',
    },
    errorIcon: {
        alignSelf: 'center',
    },
    linkIcon: {
        alignSelf: 'center',
        width: 30,
        height: 30,
    },
});


export default RootToast;
