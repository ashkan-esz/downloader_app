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
                style={[style.toast, style.linkToClipboardStyle]}
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
                style={[style.toast, style.errorStyle]}
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
        message: ({text1, props, ...rest}) => (
            <BaseToast
                {...rest}
                style={[style.toast, style.messageStyle]}
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
    toast: {
        height: 45,
        marginBottom: -20,
        width: '94%',
    },
    linkToClipboardStyle: {
        borderLeftColor: 'red',
    },
    errorStyle: {
        borderLeftColor: Colors.NAVBAR,
        backgroundColor: Colors.NAVBAR,
    },
    messageStyle: {
        borderLeftColor: Colors.GRAY_MEDIUM,
        backgroundColor: Colors.GRAY_MEDIUM,
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
