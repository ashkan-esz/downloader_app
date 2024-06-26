import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import {Text} from "@rneui/themed";
import Toast from "react-native-toast-message";
import {ScreenLayout} from "../../components/layouts";
import {DeviceSession} from "../../components/molecules";
import {Colors} from "../../styles";
import {useSelector} from "react-redux";
import * as authApis from "../../api/authApis";

//just like telegram :)

const ActiveSessionsScreen = () => {
    const savedThisDevice = useSelector(state => state.auth.thisDevice);
    const [isMount, setIsMount] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [thisDevice, setThisDevice] = useState(null);
    const [activeSessions, setActiveSessions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const callApi = async () => {
            setIsFetching(true);
            let result = await authApis.getActiveSessionsApi();
            if (result.errorMessage) {
                setError(result.errorMessage);
            } else {
                setThisDevice(result.data.thisDevice);
                setActiveSessions(result.data.activeSessions);
            }
            setIsFetching(false);
            setIsMount(true);
        }
        callApi();
    }, []);

    useEffect(() => {
        if (error) {
            let temp = true;
            Toast.show({
                type: 'error',
                text1: error,
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                    setError('');
                },
                onHide: () => {
                    if (temp) {
                        setError('');
                    }
                    temp = false;
                },
                visibilityTime: 2000,
            });
        }
        return () => Toast.hide();
    }, [error]);

    const _onRefresh = async () => {
        setIsFetching(true);
        let result = await authApis.getActiveSessionsApi();
        if (result.errorMessage) {
            setError(result.errorMessage);
        } else {
            setThisDevice(result.data.thisDevice);
            setActiveSessions(result.data.activeSessions);
        }
        setIsFetching(false);
    }

    const _forceLogout = async (deviceId) => {
        setIsLoggingOut(true);
        let result = deviceId === 'all'
            ? await authApis.forceLogoutAllApi()
            : await authApis.forceLogoutApi(deviceId);
        if (result.errorMessage) {
            setError(result.errorMessage);
        } else {
            setActiveSessions(result.data.activeSessions);
        }
        setIsLoggingOut(false);
    }

    return (
        <ScreenLayout paddingSides={5}>
            <View style={style.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            onRefresh={_onRefresh}
                            refreshing={isMount && isFetching}
                            progressBackgroundColor={Colors.PRIMARY}
                            colors={[Colors.BLUE_LIGHT, Colors.THIRD]}
                        />
                    }
                >

                    <Text style={style.section}>
                        CURRENT SESSIONS
                    </Text>

                    {
                        (savedThisDevice || thisDevice) && <DeviceSession
                            session={(thisDevice || savedThisDevice)}
                            isCurrentDevice={true}
                            onRemove={_forceLogout}
                            noActiveSession={!isFetching && activeSessions.length === 0 || !isMount || isFetching}
                            isLoggingOut={isLoggingOut}
                            isFirst={true}
                            isLast={true}
                        />
                    }

                    <Text style={style.section}>
                        ACTIVE SESSIONS
                    </Text>

                    {
                        (!isMount && isFetching) && <ActivityIndicator
                            style={style.loading}
                            size={"large"}
                            color={Colors.THIRD}
                            animating={true}
                        />
                    }

                    {
                        !isFetching && activeSessions.length === 0 && <View style={style.notFoundContainer}>
                            <Text style={style.text}>
                                There is no active session!
                            </Text>
                        </View>
                    }

                    {
                        activeSessions.map((session, index) => (
                            <DeviceSession
                                key={session.DeviceId}
                                session={session}
                                onRemove={_forceLogout}
                                isLoggingOut={isLoggingOut}
                                isFirst={index === 0}
                                isLast={index === activeSessions.length - 1}
                            />
                        ))
                    }

                    <View style={{paddingBottom: 100}}/>

                </ScrollView>
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 70,
        paddingLeft: 8,
        paddingRight: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
        marginBottom: 20,
    },
    button: {
        width: '50%',
        minWidth: 100,
        maxWidth: 150,
        backgroundColor: Colors.RED2,
        marginTop: 10,
    },
    section: {
        fontSize: 18,
        color: Colors.NAVBAR,
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    notFoundContainer: {
        justifyContent: 'center',
        backgroundColor: Colors.SECONDARY,
        borderRadius: 15,
        height: 100,
        paddingTop: 0,
        paddingBottom: 0,
    },
    text: {
        alignSelf: 'center',
        fontSize: 16,
        color: '#fff',
    },
});


export default ActiveSessionsScreen;
