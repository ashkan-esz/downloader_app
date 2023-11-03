import React from 'react';
import {View, StyleSheet, Keyboard, TouchableOpacity} from 'react-native';
import {Button, Text} from "@rneui/themed";
import {Colors, Mixins} from "../../styles";
import {SignUpForm} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useSelector} from "react-redux";
import { Image } from 'expo-image';


const SignUpScreen = ({navigation}) => {
    const internet = useSelector(state => state.user.internet);

    const paddingBottom = {
        paddingBottom: internet ? 0 : 38,
    }

    return (
        <ScreenLayout backgroundColor={Colors.LOGO_BACKGROUND}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => Keyboard.dismiss()}
            >
                <Image
                    source={require('../../assets/icons/logo.png')}
                    style={style.logo}
                />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={1}
                style={[style.container, paddingBottom]}
                onPress={() => Keyboard.dismiss()}
            >
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
            </TouchableOpacity>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    logo: {
        width: 340,
        height: 200,
        alignSelf: 'center',
        marginTop: Mixins.getWindowHeight(12),
    },
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
