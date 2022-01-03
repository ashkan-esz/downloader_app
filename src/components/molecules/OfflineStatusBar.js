import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {Mixins} from "../../styles";
import {useDispatch, useSelector} from "react-redux";
import {setInternet} from '../../redux/slices/user.slice';


const OfflineStatusBar = () => {
    const dispatch = useDispatch();
    const internet = useSelector(state => state.user.internet);

    useEffect(() => {
        let unsubscribe = NetInfo.addEventListener((netState) => {
            dispatch(setInternet({
                internet: netState.isConnected && netState.isInternetReachable,
                connectionType: netState.type,
            }));
        });
        return () => unsubscribe();
    }, []);

    if (internet) {
        return null;
    }

    return (
        <View style={style.container}>
            <Text style={style.text}>No Internet Connection</Text>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        top: 25,
        zIndex: 1,
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
