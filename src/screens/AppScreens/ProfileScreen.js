import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {Button, Text} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import {
    logout_api,
    resetMessage,
    sendVerifyEmail_api,
    profile_api, resetServerError,
} from "../../redux/slices/user.slice";
import Toast from 'react-native-toast-message';
import {ProfileImage} from "../../components/molecules";
import {useNavigation} from "@react-navigation/native";
import {Colors, Typography} from "../../styles";
import {MyOverlay} from "../../components/atoms";

//todo :

const ProfileScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.user.isLoading);
    const serverError = useSelector(state => state.user.serverError);
    const message = useSelector(state => state.user.message);
    const isLoggingOut = useSelector(state => state.user.isLoggingOut);
    const emailVerified = useSelector(state => state.user.profileData.emailVerified);
    const [logoutOverlay, setLogoutOverlay] = useState(false);

    const _navigateToActiveSession = () => {
        navigation.navigate('ActiveSessions');
    }

    useEffect(() => {
        if (serverError) {
            Toast.show({
                type: 'error',
                text1: serverError,
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                    dispatch(resetServerError());
                },
                onHide: () => dispatch(resetServerError()),
                visibilityTime: 2000,
            });
        }
        return () => Toast.hide();
    }, [serverError]);

    useEffect(() => {
        if (message) {
            Toast.show({
                type: 'error',
                text1: message,
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                    dispatch(resetMessage());
                },
                onHide: () => dispatch(resetMessage()),
                visibilityTime: 1000
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
                            refreshing={isLoading}
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
                            loading={isLoading}
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
                        title={'Logout'}
                        loading={isLoggingOut}
                        loadingProps={{
                            animating: true,
                        }}
                        onPress={() => setLogoutOverlay(true)}
                    />

                    <Text style={style.text}>
                        <Text style={style.statement}>serverError :</Text> {serverError}
                    </Text>

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
