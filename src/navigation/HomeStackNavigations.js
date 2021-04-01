import React from "react";
import {SearchScreen, HomeScreen, SectionScreen, TrailersScreen, MovieScreen} from '../screens';
import {Colors} from "../styles";
import {createNativeStackNavigator} from "react-native-screens/native-stack";

const Stack = createNativeStackNavigator();

const HomeStackNavigations = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.PRIMARY,
                },
                headerHideShadow: true,
                headerTintColor: '#fff',
                headerTranslucent: true,
                stackAnimation: "fade",
            }}
        >
            <Stack.Screen
                name={'Home'}
                component={HomeScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={'Search'}
                component={SearchScreen}
                options={{
                    title: 'Search',
                    headerStyle:{
                        backgroundColor: '#000000',
                    },
                }}
            />
            <Stack.Screen
                name={'Section'}
                component={SectionScreen}
                options={{
                    title: 'Section',
                }}
            />
            <Stack.Screen
                name={'Trailers'}
                component={TrailersScreen}
                options={{
                    title: 'Trailers',
                }}
            />
            <Stack.Screen
                name={'Movie'}
                component={MovieScreen}
                options={({route}) => ({title: route.params.name})}
            />
        </Stack.Navigator>
    );
};


export default HomeStackNavigations;
