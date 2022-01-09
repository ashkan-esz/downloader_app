import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from "react-native-elements";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";


const MovieError = ({containerStyle, buttonStyle, retry, hideRetry, errorMessage}) => {
    const internet = useSelector(state => state.user.internet);

    useEffect(() => {
        if (internet && retry) {
            retry();
        }
    }, [internet]);

    const message = errorMessage || (internet ? 'There is a problem!' : 'no internet connection!');

    const textMargin = {
        marginTop: (retry && !hideRetry) ? 15 : 0,
    }

    return (
        <View style={[style.container, containerStyle]}>
            <Text h4 style={[style.title, textMargin]}>{message}</Text>
            {
                retry && !hideRetry && <Button
                    containerStyle={[style.buttonContainer, buttonStyle]}
                    titleStyle={style.buttonTitle}
                    title={'Retry'}
                    type={"outline"}
                    buttonStyle={style.button}
                    onPress={retry}
                />
            }
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        backgroundColor: Colors.SECONDARY,
        height: 130,
        borderRadius: 15,
        marginTop: 20,
        paddingTop: 0,
        paddingBottom: 0,
    },
    buttonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
    button: {
        borderColor: Colors.RED2,
        borderWidth: 1,
    },
    buttonTitle: {
        color: Colors.RED2,
        fontSize: Typography.getFontSize(18),
    },
    title: {
        alignSelf: 'center',
        fontSize: Typography.getFontSize(16),
        color: '#ffffff',
        opacity: 0.9,
    }
});

MovieError.propTypes = {
    containerStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    retry: PropTypes.func,
    showRetry: PropTypes.bool,
    errorMessage: PropTypes.string,
};


export default MovieError;
