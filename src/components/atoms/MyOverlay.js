import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Overlay, Text} from "@rneui/themed";
import {Colors} from "../../styles";
import PropTypes from 'prop-types';


const MyOverlay = ({
                       message,
                       secondMessage,
                       overlay,
                       setOverlay,
                       leftOption,
                       rightOption,
                       onLeftClick,
                       onRightClick,
                       isLoading,
                       leftColor,
                       rightColor,
                       buttonType,
                       titleColor,
                       titleFontSize,
                       secondTitleFontSize,
                       backDropDisable,
                       persistentOnClick,
                   }) => {

    const titleStyle = {
        color: titleColor || Colors.GRAY_LIGHT,
        fontSize: titleFontSize || 20,
    };
    const secondTitleStyle = {
        color: titleColor || Colors.GRAY_LIGHT,
        fontSize: secondTitleFontSize || 20,
    };

    const leftButtonTitle = {
        color: leftColor || 'blue',
        fontSize: rightOption ? 16 : 18,
    };

    const rightButtonTitle = {
        color: rightColor || 'red',
        fontSize: 16,
    };

    return (
        <Overlay
            overlayStyle={style.overlay}
            isVisible={overlay}
            onBackdropPress={() => {
                if (!backDropDisable) {
                    setOverlay?.(false);
                    onLeftClick && onLeftClick();
                }
            }}
            animationType={"slide"}
        >
            <View style={style.container}>

                <Text style={[style.text, titleStyle]}> {message} </Text>
                {secondMessage && <Text style={[style.secondText, secondTitleStyle]}> {secondMessage} </Text>}

                <View style={style.buttonsContainer}>
                    <Button
                        buttonStyle={style.button}
                        titleStyle={leftButtonTitle}
                        type={buttonType || "clear"}
                        title={leftOption}
                        onPress={() => {
                            !persistentOnClick && setOverlay?.(false);
                            onLeftClick && onLeftClick();
                        }}
                    />

                    {
                        rightOption && <Button
                            buttonStyle={style.button}
                            titleStyle={rightButtonTitle}
                            type={buttonType || "clear"}
                            title={rightOption}
                            loading={isLoading}
                            onPress={() => {
                                !persistentOnClick && setOverlay?.(false);
                                onRightClick && onRightClick();
                            }}
                        />
                    }

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
        minHeight: 120,
        maxHeight: 150,
        borderRadius: 10
    },
    container: {
        top: 20,
    },
    text: {
        textAlign: 'center',
        opacity: 0.9,
    },
    secondText: {
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
        maxWidth: 160,
    },
});

MyOverlay.propTypes = {
    overlay: PropTypes.bool.isRequired,
    setOverlay: PropTypes.func,
    message: PropTypes.string,
    secondMessage: PropTypes.string,
    leftOption: PropTypes.string.isRequired,
    rightOption: PropTypes.string,
    onLeftClick: PropTypes.func,
    onRightClick: PropTypes.func,
    isLoading: PropTypes.bool,
    leftColor: PropTypes.string,
    rightColor: PropTypes.string,
    buttonType: PropTypes.string,
    titleColor: PropTypes.string,
    titleFontSize: PropTypes.number,
    secondTitleFontSize: PropTypes.number,
    backDropDisable: PropTypes.bool,
    persistentOnClick: PropTypes.bool,
}


export default MyOverlay;
