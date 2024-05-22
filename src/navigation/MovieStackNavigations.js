import React from "react";
import {
    SearchScreen,
    HomeScreen,
    SectionScreen,
    TrailersScreen,
    MovieScreen,
    TimeLineScreen,
    ProfileScreen,
    ActiveSessionsScreen,
    MovieListScreen,
    NotificationScreen
} from '../screens';
import {Colors} from "../styles";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";

// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

const MovieStackNavigations = () => {
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
                headerShadowVisible: false,
                //------- native stack -----
                // animation: "slide_from_right",
                // orientation: 'portrait',
                // presentation: "transparentModal",
                //------- stack -----------
                gestureEnabled: true,
                gestureDirection: "horizontal",
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                presentation: "transparentModal",
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
                options={({route}) => ({
                    title: route.params.name,
                    // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                    // cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                    // cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
                    // cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
                })}
            />
            <Stack.Screen
                name={'MovieListScreen'}
                component={MovieListScreen}
                options={({route}) => ({title: route.params.name})}
            />
            <Stack.Screen
                name={'Notifications'}
                component={NotificationScreen}
            />
        </Stack.Navigator>
    );
};


export default MovieStackNavigations;
