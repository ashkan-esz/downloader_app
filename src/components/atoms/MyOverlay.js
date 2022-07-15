import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Overlay, Text} from "@rneui/themed";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MyOverlay = ({
                       message,
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
                   }) => {

    const titleStyle = {
        color: titleColor || Colors.GRAY_LIGHT,
        fontSize: Typography.getFontSize(titleFontSize || 20),
    };

    const leftButtonTitle = {
        color: leftColor || 'blue',
        fontSize: Typography.getFontSize(rightOption ? 16 : 18),
    };

    const rightButtonTitle = {
        color: rightColor || 'red',
        fontSize: Typography.getFontSize(16),
    };

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

                <Text style={[style.text, titleStyle]}> {message} </Text>

                <View style={style.buttonsContainer}>
                    <Button
                        buttonStyle={style.button}
                        titleStyle={leftButtonTitle}
                        type={buttonType || "clear"}
                        title={leftOption}
                        onPress={() => {
                            setOverlay(false);
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
                                setOverlay(false);
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
        minHeight: 100,
        maxHeight: 150,
        borderRadius: 10
    },
    container: {
        top: '12%',
    },
    text: {
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
});

MyOverlay.propTypes = {
    overlay: PropTypes.bool.isRequired,
    setOverlay: PropTypes.func.isRequired,
    message: PropTypes.string,
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
}


export default MyOverlay;
