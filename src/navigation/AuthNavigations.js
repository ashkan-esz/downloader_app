import React from "react";
import {createStackNavigator} from '@react-navigation/stack';
import {SignCreateAccScreen, LogInScreen, SignUpScreen} from '../screens';
import {Colors} from "../styles";
import {Platform} from "react-native";

//todo: use native stack
const Stack = createStackNavigator();

export default function authNavigation() {
    return (
        <Stack.Navigator
            initialRouteName={'signCreateAcc'}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.PRIMARY,
                    borderBottomColor: 'red',
                    borderBottomWidth: 0,
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    paddingLeft: 0,
                    marginLeft: Platform.OS === 'ios' ? 0 : -15,
                },
                headerTransparent: 1
            }}
        >
            <Stack.Screen
                name={'signCreateAcc'}
                component={SignCreateAccScreen}
                options={{
                    title: '',
                }}
            />
            <Stack.Screen
                name={'SignUp'}
                component={SignUpScreen}
                options={{
                    title: 'Create Account',
                }}
            />
            <Stack.Screen
                name={'SignIn'}
                component={LogInScreen}
                options={{
                    title: 'Sign In',
                }}
            />
        </Stack.Navigator>
    )
}
