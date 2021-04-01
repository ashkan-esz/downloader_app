import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {useRoute} from "@react-navigation/native";
import {Mixins} from "../../styles";

const OfflineStatusBar = () => {
    const route = useRoute();
    const topPosition = {
        top: route.name === 'Home' ? 25 : 16
    }

    const [isConnected, setISConnected] = useState(true);
    useEffect(() => {
        NetInfo.addEventListener((state) => {
            setISConnected(state.isConnected);
        });
    }, []);

    if (isConnected) {
        return null;
    }
    return (
        <View style={[style.container, topPosition]}>
            <Text style={style.text}>No Internet Connection</Text>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b52424',
        width: Mixins.WINDOW_WIDTH,
        height: 28,
        marginBottom: 10,
    },
    text: {
        color: '#fff'
    }
});

export default OfflineStatusBar;
