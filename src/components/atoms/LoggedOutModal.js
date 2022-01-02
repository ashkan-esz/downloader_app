import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Overlay, Text} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import {Colors, Typography} from "../../styles";
import {logout_api} from "../../redux/slices/auth.slice";

const LoggedOutModal = () => {
    const dispatch = useDispatch();
    const forceLoggedOut = useSelector(state => state.auth.forceLoggedOut);
    const [overlay, setOverlay] = useState(true);

    //todo : reset flags on mount

    return (
        <Overlay
            overlayStyle={style.overlay}
            isVisible={forceLoggedOut && overlay}
            onBackdropPress={() => {
                setOverlay(false);
                dispatch(logout_api(false));
            }}
            animationType={"slide"}
        >
            <View style={style.container}>

                <Text style={style.text}> You have been logged out </Text>

                <Button
                    containerStyle={style.buttonContainer}
                    buttonStyle={style.button}
                    title={'OK'}
                    onPress={() => {
                        setOverlay(false);
                        dispatch(logout_api(false));
                    }}
                />

            </View>
        </Overlay>
    );
};

const style = StyleSheet.create({
    overlay: {
        backgroundColor: Colors.PRIMARY,
        position: 'absolute',
        top: '35%',
        width: '70%',
        minWidth: 250,
        maxWidth: 400,
        height: '25%',
        minHeight: 150,
        maxHeight: 250,
        borderRadius: 10
    },
    container: {
        top: '12%',
    },
    text: {
        color: Colors.WARNING,
        fontSize: Typography.getFontSize(20),
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
    },
    button: {
        width: '50%',
        minWidth: 100,
        maxWidth: 150,
        backgroundColor: Colors.RED2
    }
});


export default LoggedOutModal;
