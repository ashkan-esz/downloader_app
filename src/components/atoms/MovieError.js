import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from "react-native-elements";
import NetInfo from "@react-native-community/netinfo";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieError = ({containerStyle, buttonStyle, retry}) => {
    const [network, setNetwork] = useState(true);

    useEffect(() => {
        NetInfo.addEventListener(state => {
            if (retry && !network && state.isConnected) {
                retry();
            }
            setNetwork(state.isConnected);
        });
    }, []);


    return (
        <View style={[style.container, containerStyle]}>
            <Text h4 style={style.title}>{
                network ? 'There is a problem' : 'no internet connection'
            }</Text>
            {retry && <Button
                containerStyle={[style.buttonContainer, buttonStyle]}
                titleStyle={style.buttonTitle}
                title={'retry'}
                type={"outline"}
                buttonStyle={style.button}
                onPress={retry}
            />}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        marginTop: 20
    },
    buttonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
    button: {
        borderColor: Colors.RED2,
        borderWidth: 1
    },
    buttonTitle: {
        color: Colors.RED2,
        fontSize: Typography.getFontSize(20)
    },
    title: {
        alignSelf: 'center',
        color: Colors.RED2
    }
});

MovieError.propTypes = {
    containerStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    retry: PropTypes.func,
};


export default MovieError;
