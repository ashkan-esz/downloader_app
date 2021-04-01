import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from "react-native-elements";
import {Colors, Typography} from '../../styles';
import PropsTypes from 'prop-types';


const SignCreateAcc = ({onSignIn, onCreatAcc}) => {
    return (
        <View>
            <Button
                titleStyle={style.titleStyle}
                buttonStyle={style.signup}
                title={'Sign In'}
                onPress={onSignIn}
            />

            <Button
                containerStyle={style.createAccountContainer}
                titleStyle={style.titleStyle}
                buttonStyle={style.createAccount}
                title={'Create Account'}
                onPress={onCreatAcc}
            />
        </View>
    );
};

const style = StyleSheet.create({
    signup: {
        backgroundColor: Colors.RED,
        borderRadius: 25,
        height: 50
    },
    createAccountContainer: {
        marginTop: 15,
    },
    createAccount: {
        backgroundColor: Colors.SECONDARY,
        borderRadius: 25,
        height: 50,
    },
    titleStyle: {
        fontSize: Typography.getFontSize(20)
    }
})

SignCreateAcc.propTypes = {
    onSignIn: PropsTypes.func.isRequired,
    onCreatAcc: PropsTypes.func.isRequired
};


export default SignCreateAcc;
