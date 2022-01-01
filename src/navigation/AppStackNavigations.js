import React from "react";
import {
    SearchScreen,
    HomeScreen,
    SectionScreen,
    TrailersScreen,
    MovieScreen,
    TimeLineScreen,
    ProfileScreen,
    ActiveSessionsScreen
} from '../screens';
import {Colors} from "../styles";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppStackNavigations = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.PRIMARY,
                },
                headerTintColor: '#fff',
                headerHideShadow: true,
                headerTransparent: true,
                animation: "fade",
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
                name={'Profile'}
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                }}
            />
            <Stack.Screen
                name={'ActiveSessions'}
                component={ActiveSessionsScreen}
                options={{
                    title: 'ActiveSessions',
                }}
            />
            <Stack.Screen
                name={'Search'}
                component={SearchScreen}
                options={{
                    title: 'Search',
                    headerStyle: {
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
                name={'TimeLine'}
                component={TimeLineScreen}
                options={{
                    title: 'TimeLine',
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


export default AppStackNavigations;
