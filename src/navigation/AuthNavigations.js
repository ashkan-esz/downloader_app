import React from "react";
import {SignCreateAccScreen, LogInScreen, SignUpScreen} from '../screens';
import {Colors} from "../styles";
import {createStackNavigator} from "@react-navigation/stack";

// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

export default function authNavigation() {
    return (
        <Stack.Navigator
            initialRouteName={'signCreateAcc'}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.LOGO_BACKGROUND,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    paddingLeft: 0,
                    // marginLeft: Platform.OS === 'ios' ? 0 : -15,
                },
                headerHideShadow: true,
                headerTransparent: true,
                headerShadowVisible: false,
                //----- native stack ------
                // animation: "fade",
                // orientation: 'portrait',
                //----- stack ------
                gestureEnabled: false,
                // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                // presentation: "transparentModal",
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
