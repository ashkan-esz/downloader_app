import React from 'react';
import {View, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView} from 'react-native';
import {Button, Text} from "@rneui/themed";
import {Colors, Mixins} from "../../styles";
import {LogInForm} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {Image} from 'expo-image';

//todo : forget password

const LogInScreen = ({navigation}) => {

    return (
        <ScreenLayout backgroundColor={Colors.LOGO_BACKGROUND} extraStyle={style.screen}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={style.container}
                enabled={false}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={style.inner}>
                        <Image
                            source={require('../../assets/icons/logo.png')}
                            style={style.logo}
                        />

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
            </KeyboardAvoidingView>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    screen: {
        minHeight: 0,
    },
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        maxWidth: 400,
    },
    inner: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
    },
    logo: {
        width: Mixins.WINDOW_WIDTH,
        height: 300,
        alignSelf: 'center',
        marginBottom: 50,
    },
    header: {
        color: '#b1aeae'
    },
    loginForm: {
        marginTop: 10
    },
    divider: {
        marginTop: 30,
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
