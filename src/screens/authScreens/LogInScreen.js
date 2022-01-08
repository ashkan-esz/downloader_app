import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Button, Text} from "react-native-elements";
import {Colors, Mixins} from "../../styles";
import {LogInForm} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useSelector} from "react-redux";
import FastImage from "react-native-fast-image";

//todo : forget password

const LogInScreen = ({navigation}) => {

    const internet = useSelector(state => state.user.internet);

    const paddingBottom = {
        paddingBottom: internet ? 0 : 38,
    }

    return (
        <ScreenLayout
            backgroundColor={Colors.LOGO_BACKGROUND}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <>

                    <FastImage
                        source={require('../../assets/icons/logo.png')}
                        style={style.logo}
                    />

                    <View style={[style.container, paddingBottom]}>
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
                </>
            </TouchableWithoutFeedback>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    logo:{
        width: Mixins.WINDOW_WIDTH,
        height: 300,
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
    loginForm: {
        marginTop: 10
    },
    googleButton: {
        marginTop: 25
    },
    divider: {
        marginTop: 50,
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
