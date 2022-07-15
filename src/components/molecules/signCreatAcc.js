import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from "@rneui/themed";
import {useSelector} from "react-redux";
import {Colors, Typography} from '../../styles';
import PropsTypes from 'prop-types';


const SignCreateAcc = ({onSignIn, onCreatAcc}) => {
    const internet = useSelector(state => state.user.internet);

    const paddingBottom = {
        paddingBottom: internet ? 0 : 38,
    }

    return (
        <View style={paddingBottom}>
            <Button
                containerStyle={style.signInContainer}
                titleStyle={style.titleStyle}
                buttonStyle={style.signIn}
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
    signInContainer: {
        borderRadius: 25,
    },
    signIn: {
        backgroundColor: Colors.RED,
        borderRadius: 25,
        height: 50,
    },
    createAccountContainer: {
        marginTop: 15,
        borderRadius: 25,
    },
    createAccount: {
        backgroundColor: Colors.SECONDARY,
        borderRadius: 25,
        height: 50,
    },
    titleStyle: {
        fontSize: Typography.getFontSize(20),
    }
})

SignCreateAcc.propTypes = {
    onSignIn: PropsTypes.func.isRequired,
    onCreatAcc: PropsTypes.func.isRequired
};


export default SignCreateAcc;
