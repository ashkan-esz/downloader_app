import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {Button, Text} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import {sendVerifyEmail_api, logout_api, resetMessage, resetAuthError} from "../../redux/slices/auth.slice";
import {profile_api, resetUserError, setShowUpdateOverlayFlag} from "../../redux/slices/user.slice";
import Toast from 'react-native-toast-message';
import {ProfileImage} from "../../components/molecules";
import {useNavigation} from "@react-navigation/native";
import {Colors, Typography} from "../../styles";
import {MyOverlay} from "../../components/atoms";

//todo :

const ProfileScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const updateExist = useSelector(state => state.user.updateExist);
    const isDownloadingUpdate = useSelector(state => state.user.isDownloadingUpdate);
    const authIsLoading = useSelector(state => state.auth.isLoading);
    const userIsLoading = useSelector(state => state.user.isLoading);
    const authError = useSelector(state => state.auth.authError);
    const userError = useSelector(state => state.user.userError);
    const message = useSelector(state => state.auth.message);
    const isLoggingOut = useSelector(state => state.auth.isLoggingOut);
    const emailVerified = useSelector(state => state.user.emailVerified);
    const [logoutOverlay, setLogoutOverlay] = useState(false);

    const _navigateToActiveSession = () => {
        navigation.navigate('ActiveSessions');
    }

    useEffect(() => {
        if (authError) {
            let temp = true;
            Toast.show({
                type: 'error',
                text1: authError,
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                    dispatch(resetAuthError());
                },
                onHide: () => {
                    if (temp) {
                        dispatch(resetAuthError());
                    }
                    temp = false;
                },
                visibilityTime: 2000,
            });
        }
        return () => Toast.hide();
    }, [authError]);

    useEffect(() => {
        if (userError) {
            let temp = true;
            Toast.show({
                type: 'error',
                text1: userError,
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                    dispatch(resetUserError());
                },
                onHide: () => {
                    if (temp) {
                        dispatch(resetUserError());
                    }
                    temp = false;
                },
                visibilityTime: 2000,
            });
        }
        return () => Toast.hide();
    }, [userError]);

    useEffect(() => {
        if (message) {
            let temp = true;
            Toast.show({
                type: 'error',
                text1: message,
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                    dispatch(resetMessage());
                },
                onHide: () => {
                    if (temp) {
                        dispatch(resetMessage());
                    }
                    temp = false;
                },
                visibilityTime: 1000,
            });
        }
        return () => Toast.hide();
    }, [message]);

    const _onRefresh = async () => {
        dispatch(profile_api());
    }

    return (
        <ScreenLayout paddingSides={5}>
            <View style={style.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            onRefresh={_onRefresh}
                            refreshing={userIsLoading}
                            colors={['blue', 'red']}
                        />
                    }
                >

                    <ProfileImage/>

                    <Text style={style.section}>
                        INFO
                    </Text>


                    <Text style={style.text}>
                        <Text style={style.statement}>EmailVerified :</Text> {emailVerified.toString()}
                    </Text>

                    {
                        !emailVerified && <Button
                            containerStyle={style.buttonContainer}
                            buttonStyle={style.button}
                            title={'verify email'}
                            loading={authIsLoading}
                            loadingProps={{
                                animating: true,
                            }}
                            onPress={() => {
                                dispatch(sendVerifyEmail_api());
                            }}
                        />
                    }

                    <Button
                        containerStyle={style.buttonContainer}
                        buttonStyle={style.button}
                        title={'UPDATE'}
                        disabled={!updateExist}
                        loading={isDownloadingUpdate}
                        loadingProps={{
                            animating: true,
                        }}
                        onPress={() => dispatch(setShowUpdateOverlayFlag(true))}
                    />

                    <Button
                        containerStyle={style.buttonContainer}
                        buttonStyle={style.button}
                        title={'Logout'}
                        loading={isLoggingOut}
                        loadingProps={{
                            animating: true,
                        }}
                        onPress={() => setLogoutOverlay(true)}
                    />

                    <Button
                        containerStyle={style.buttonContainer}
                        buttonStyle={style.button}
                        title={'ActiveSessions'}
                        onPress={_navigateToActiveSession}
                    />

                    <MyOverlay
                        overlay={logoutOverlay}
                        setOverlay={setLogoutOverlay}
                        message={'Are you sure you want to log out?'}
                        leftOption={'CANCEL'}
                        rightOption={'LOG OUT'}
                        isLoading={isLoggingOut}
                        onRightClick={() => dispatch(logout_api(true))}
                    />

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
        top: 80,
        paddingLeft: 8,
        paddingRight: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
    },
    button: {
        width: '50%',
        minWidth: 100,
        maxWidth: 150,
        backgroundColor: Colors.RED2,
        marginTop: 10,
    },
    section: {
        fontSize: Typography.getFontSize(24),
        color: Colors.SectionHeader,
        paddingLeft: 2,
        marginTop: 15,
        marginBottom: 10,
    },
    text: {
        fontSize: Typography.getFontSize(16),
        textTransform: 'capitalize',
        color: '#fff',
        marginTop: 5
    },
    statement: {
        fontSize: Typography.getFontSize(16),
        color: Colors.SemiCyan,
    },
});


export default ProfileScreen;
