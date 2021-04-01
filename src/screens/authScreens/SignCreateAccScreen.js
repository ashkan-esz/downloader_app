import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SignInCreateAcc} from "../../components/molecules";
import {ScreenLayout} from "../../components/layouts";


const SignCreateAccScreen = ({navigation}) => {
    return (
        <ScreenLayout>
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
    container: {
        position: 'absolute',
        bottom: '9%',
        width: '85%',
        maxWidth: 350,
    },
});


export default SignCreateAccScreen;
