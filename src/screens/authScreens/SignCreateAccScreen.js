import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SignInCreateAcc} from "../../components/molecules";
import {ScreenLayout} from "../../components/layouts";
import {Colors, Mixins} from "../../styles";
import FastImage from "react-native-fast-image";


const SignCreateAccScreen = ({navigation}) => {
    return (
        <ScreenLayout backgroundColor={Colors.LOGO_BACKGROUND}>
            <FastImage
                source={require('../../assets/icons/logo.png')}
                style={style.logo}
            />
            <View style={style.container}>
                <SignInCreateAcc
                    onSignIn={() => {
                        navigation.navigate('SignIn')
                    }}
                    onCreatAcc={() => {
                        navigation.navigate('SignUp');
                    }}
                />
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    logo:{
        width: Mixins.WINDOW_WIDTH,
        height: 300,
        alignSelf: 'center',
        marginTop: Mixins.getWindowHeight(17),
    },
    container: {
        position: 'absolute',
        bottom: '9%',
        width: '85%',
        maxWidth: 350,
    },
});


export default SignCreateAccScreen;
