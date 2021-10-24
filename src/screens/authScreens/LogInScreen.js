import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Button, Text} from "react-native-elements";
import {Colors} from "../../styles";
import {LogInForm} from "../../components/organisms";
import {GoogleButton} from "../../components/atoms";
import {ScreenLayout} from "../../components/layouts";

const LogInScreen = ({navigation}) => {
    const googleSignIn = () => {

    };

    return (
        <ScreenLayout>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={style.container}>

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
                        onSubmit={(data) => {
                            // console.log(data) //todo : do something with form data
                            navigation.navigate('Home');
                        }}
                    />

                    <GoogleButton
                        extraStyle={style.googleButton}
                        text={"Or Login With"}
                        onPress={() => {
                            //todo : add google login
                            googleSignIn();
                        }}
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