import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Overlay, Text} from "react-native-elements";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MyOverlay = ({message, overlay, setOverlay, leftOption, rightOption, onLeftClick, onRightClick, isLoading}) => {

    return (
        <Overlay
            overlayStyle={style.overlay}
            isVisible={overlay}
            onBackdropPress={() => {
                setOverlay(false);
                onLeftClick && onLeftClick();
            }}
            animationType={"slide"}
        >
            <View style={style.container}>

                <Text style={style.text}> {message} </Text>

                <View style={style.buttonsContainer}>
                    <Button
                        buttonStyle={style.button}
                        titleStyle={style.leftButtonTitle}
                        type={"clear"}
                        title={leftOption}
                        onPress={() => {
                            setOverlay(false);
                            onLeftClick && onLeftClick();
                        }}
                    />

                    <Button
                        buttonStyle={style.button}
                        titleStyle={style.rightButtonTitle}
                        type={"clear"}
                        title={rightOption}
                        loading={isLoading}
                        onPress={() => {
                            setOverlay(false);
                            onRightClick && onRightClick();
                        }}
                    />
                </View>

            </View>
        </Overlay>
    );
};

const style = StyleSheet.create({
    overlay: {
        backgroundColor: Colors.PRIMARY,
        position: 'absolute',
        top: '35%',
        width: '85%',
        minWidth: 250,
        maxWidth: 400,
        height: '25%',
        minHeight: 100,
        maxHeight: 150,
        borderRadius: 10
    },
    container: {
        top: '12%',
    },
    text: {
        color: Colors.GRAY_LIGHT,
        fontSize: Typography.getFontSize(20),
        textAlign: 'center',
        opacity: 0.9,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    button: {
        width: '100%',
        minWidth: 110,
        maxWidth: 140,
    },
    leftButtonTitle: {
        color: 'blue',
    },
    rightButtonTitle: {
        color: 'red',
    }
});

MyOverlay.propTypes = {
    overlay: PropTypes.bool.isRequired,
    setOverlay: PropTypes.func.isRequired,
    message: PropTypes.string,
    leftOption: PropTypes.string.isRequired,
    rightOption: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func,
    onRightClick: PropTypes.func,
}


export default MyOverlay;
