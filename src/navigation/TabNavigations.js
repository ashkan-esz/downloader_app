import React from 'react';
import MovieStackNavigations from "./MovieStackNavigations";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Colors} from "../styles";
import {ProfileScreen} from "../screens";
import BottomTabs from "../components/molecules/BottomTabs";

const Tab = createBottomTabNavigator();

const TabNavigations = () => {
    return (
        <Tab.Navigator
            initialRouteName={"Movie-Stack"}
            tabBar={props => <BottomTabs {...props} />}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.PRIMARY,
                },
                headerTintColor: '#fff',
                headerHideShadow: true,
                headerTransparent: true,
                headerShadowVisible: false,
                headerShown: false,
                tabBarShowLabel: false,
                // animation: "fade",
                // orientation: 'portrait',
                lazy: true,
            }}
            detachInactiveScreens={false}
        >
            <Tab.Screen name="Movie-Stack" component={MovieStackNavigations}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
    );
};

export default TabNavigations;
