import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Mixins} from "../../styles";
import PropTypes from "prop-types";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";

const hideTabBarScreens = ["Notifications", "TimeLine", "Section", "Trailers", "MovieListScreen", "Movie", "Search"];

const BottomTabs = ({state, descriptors, navigation}) => {

    if (hideTabBarScreens.includes(getFocusedRouteNameFromRoute(state.routes[0]))) {
        return null;
    }

    return (
        <View
            // tint="dark"
            // tint="systemChromeMaterialDark"
            // intensity={80}
            // experimentalBlurMethod={"dimezisBlurView"}
            style={style.container}
        >
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    // console.log(route.name, route.params, state.index, index, event)
                    // if (state.index !== index && !event.defaultPrevented) {
                    if (state.index !== index) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={state.index === index ? {selected: true} : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={style.tabItemContainer}
                        activeOpacity={0.6}
                        key={route.key}
                    >
                        {
                            route.name === "Movie-Stack"
                                ? <Entypo style={style.tabItem} name={"home"} size={24}
                                          color={state.index === index ? Colors.THIRD : Colors.LIGHT}/>
                                : <FontAwesome5 style={style.tabItem} name={"user-alt"} size={20}
                                                color={state.index === index ? Colors.THIRD : Colors.LIGHT}/>
                        }
                        {
                            state.index === index && <View style={[style.tabItem, style.activeDot]}></View>
                        }
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 47,
        overflow: "hidden",
        position: "absolute",
        width: Mixins.WINDOW_WIDTH - 20,
        marginLeft: 10,
        marginRight: 10,
        // marginBottom: 5,
        // borderRadius: 24,
        backgroundColor: Colors.SECONDARY,
        bottom: 0,

        // width: Mixins.WINDOW_WIDTH,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    tabItemContainer: {
        flex: 1,
    },
    tabItem: {
        height: "100%",
        textAlignVertical: "center",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: 24,
        paddingBottom: 2,
    },
    activeTabItem: {
        color: Colors.THIRD,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 24,
        backgroundColor: Colors.THIRD,
        position: "absolute",
        // left: (Mixins.WINDOW_WIDTH - 60) / 4 + 2,
        left: (Mixins.WINDOW_WIDTH - 40) / 4 + 3,
        // left: (Mixins.WINDOW_WIDTH - 20) / 8 + 2,
        bottom: 2,
    },
});

BottomTabs.propTypes = {
    state: PropTypes.object.isRequired,
    descriptors: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default BottomTabs;
