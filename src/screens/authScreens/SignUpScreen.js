import React from 'react';
import {View, StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import {Button, Text} from "@rneui/themed";
import {Colors} from "../../styles";
import {SignUpForm} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useSelector} from "react-redux";
import {Image} from 'expo-image';


const SignUpScreen = ({navigation}) => {
    const internet = useSelector(state => state.user.internet);

    const paddingBottom = {
        paddingBottom: internet ? 0 : 53,
    }

    return (
        <ScreenLayout backgroundColor={Colors.LOGO_BACKGROUND}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={style.container}

            >
                <TouchableWithoutFeedback
                    style={[style.container, paddingBottom]}
                    onPress={Keyboard.dismiss}
                >
                    <View style={[style.inner, paddingBottom]}>
                        <Image
                            source={require('../../assets/icons/logo.png')}
                            style={style.logo}
                        />
                        <Text h3 style={style.header}>
                            <Text h3 style={{color: Colors.RED}}>
                                Hello!
                            </Text>
                            <Text> </Text>
                            Creat your account and enjoy
                        </Text>

                        <SignUpForm
                            extraStyle={style.signUpForm}
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
            </KeyboardAvoidingView>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        maxWidth: 400,
    },
    inner: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
    },
    logo: {
        width: 340,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        color: '#b1aeae'
    },
    signUpForm: {
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


export default SignUpScreen;
