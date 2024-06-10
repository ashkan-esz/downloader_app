import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {Colors, Mixins} from "../../styles";
import {Image} from 'expo-image';
import {Button} from "@rneui/themed";
import {useSelector} from "react-redux";


const SignCreateAccScreen = ({navigation}) => {
    const internet = useSelector(state => state.user.internet);

    const paddingBottom = {
        paddingBottom: internet ? 0 : 38,
    }

    return (
        <ScreenLayout backgroundColor={Colors.LOGO_BACKGROUND}>
            <Image
                source={require('../../assets/icons/logo.png')}
                style={style.logo}
            />
            <View style={[style.container, paddingBottom]}>
                <Button
                    containerStyle={style.signInContainer}
                    titleStyle={style.titleStyle}
                    buttonStyle={style.signIn}
                    title={'Sign In'}
                    onPress={() => {
                        navigation.navigate('SignIn')
                    }}
                />

                <Button
                    containerStyle={style.createAccountContainer}
                    titleStyle={style.titleStyle}
                    buttonStyle={style.createAccount}
                    title={'Create Account'}
                    onPress={() => {
                        navigation.navigate('SignUp');
                    }}
                />
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    logo: {
        width: Mixins.WINDOW_WIDTH,
        height: 300,
        alignSelf: 'center',
        marginTop: Mixins.getWindowHeight(17),
    },
    container: {
        position: 'absolute',
        bottom: 50,
        width: '85%',
        maxWidth: 350,
    },
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
        fontSize: 20,
    }
});


export default SignCreateAccScreen;
