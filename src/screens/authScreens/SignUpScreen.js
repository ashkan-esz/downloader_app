import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Button, Text} from "react-native-elements";
import {Colors} from "../../styles";
import {SignUpForm} from "../../components/organisms";
import {GoogleButton} from "../../components/atoms";
import {ScreenLayout} from "../../components/layouts";

const SignUpScreen = ({navigation}) => {
    const googleSignUp = () => {

    };

    return (
        <ScreenLayout>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={style.container}>

                    {/*//todo : add logo*/}
                    <Text h3 style={style.header}>
                        <Text h3 style={{color: Colors.RED}}>
                            Hello!
                        </Text>
                        <Text> </Text>
                        Creat your account and enjoy
                    </Text>

                    <SignUpForm
                        extraStyle={style.signUpForm}
                        onSubmit={(data) => {
                            console.log(data);//todo : do something with form data
                            navigation.navigate('Home'); //todo : home page
                        }}
                    />

                    <GoogleButton
                        extraStyle={style.googleButton}
                        text={"Or Create Account With"}
                        onPress={() => {
                            //todo : add google signup
                            googleSignUp();
                        }}
                    />

                    <View style={style.divider}/>
                    <Button
                        containerStyle={style.signInContainer}
                        titleStyle={style.signInText}
                        title={'SIGN IN'}
                        type={"clear"}
                        onPress={() => {
                            navigation.navigate('SignIn');
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
    signUpForm: {
        marginTop: 10
    },
    googleButton: {
        marginTop: 20
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


export default SignUpScreen;
