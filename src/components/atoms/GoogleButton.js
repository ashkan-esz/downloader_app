import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SocialIcon, Text} from "react-native-elements";
import {Typography} from "../../styles";
import PropsType from 'prop-types';


const GoogleButton = ({extraStyle, text, onPress}) => {
    return (
        <View style={extraStyle}>

            <Text style={style.text}>
                {text}
            </Text>

            <SocialIcon
                style={style.icon}
                fontStyle={style.font}
                type={'google'}
                title={'| Google'}
                button
                testID={'google-button'}
                onPress={onPress}
            />
        </View>
    );
}

const style = StyleSheet.create({
    text: {
        color: '#7b7b7d',
        fontSize: Typography.getFontSize(16),
        alignSelf: 'center'
    },
    icon: {
        marginTop: 10,
        width: '50%',
        height: 50,
        alignSelf: 'center',
    },
    font: {
        fontSize: Typography.getFontSize(20)
    }
});

GoogleButton.propTypes = {
    extraStyle: PropsType.object,
    text: PropsType.string.isRequired,
    onPress: PropsType.func.isRequired
}

export default GoogleButton;
