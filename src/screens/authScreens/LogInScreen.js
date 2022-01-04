import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Button, Text} from "react-native-elements";
import {Colors} from "../../styles";
import {LogInForm} from "../../components/organisms";
import {GoogleButton} from "../../components/atoms";
import {ScreenLayout} from "../../components/layouts";
import {useSelector} from "react-redux";

//todo : forget password
//todo : google sign in

const LogInScreen = ({navigation}) => {

    const internet = useSelector(state => state.user.internet);

    const paddingBottom = {
        paddingBottom: internet ? 0 : 38,
    }

    const googleSignIn = () => {
        //todo : add google login
    };

    return (
        <ScreenLayout>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={[style.container, paddingBottom]}>

                    {/*//todo : add logo*/}
                    <Text h3 style={style.header}>
                        <Text h3 style={{color: Colors.RED}}>
                            Welcome!
                        </Text>
                        <Text> </Text>
                        Login with your account and enjoy
                    </Text>

                    <LogInForm
                        extraStyle={style.loginForm}
                    />

                    <GoogleButton
                        extraStyle={style.googleButton}
                        text={"Or Login With"}
                        onPress={googleSignIn}
                    />

                    <View style={style.divider}/>
                    <Button
                        containerStyle={style.signInContainer}
                        titleStyle={style.signInText}
                        title={'CREATE ACCOUNT'}
                        type={"clear"}
                        onPress={() => {
                            navigation.navigate('SignUp');
                        }}
                    />

                </View>
            </TouchableWithoutFeedback>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '2%',
        width: '85%',
        maxWidth: 350,
    },
    header: {
        color: '#b1aeae'
    },
    loginForm: {
        marginTop: 10
    },
    googleButton: {
        marginTop: 25
    },
    divider: {
        marginTop: 15,
        borderBottomColor: '#636161',
        borderBottomWidth: 0.9,
    },
    signInContainer: {
        marginTop: 12,
        alignSelf: 'center'
    },
    signInText: {
        color: Colors.RED
    }
})


export default LogInScreen;
