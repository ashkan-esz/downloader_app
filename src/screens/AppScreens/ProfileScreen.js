import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {Button, Text} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import {logout_api, resetMessage, sendVerifyEmail_api} from "../../redux/slices/user.slice";
import {Colors, Typography} from "../../styles";
import Toast from 'react-native-toast-message';

//todo :

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.user.isLoading);
    const serverError = useSelector(state => state.user.serverError);
    const message = useSelector(state => state.user.message);
    const isLoggingOut = useSelector(state => state.user.isLoggingOut);
    const emailVerified = useSelector(state => state.user.profileData.emailVerified);

    useEffect(() => {
        if (message) {
            Toast.show({
                type: 'linkToClipboard',
                text1: message,
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                    dispatch(resetMessage());
                },
                visibilityTime: 1000
            });
            setTimeout(() => {
                dispatch(resetMessage());
            }, 1000);
        }
    }, [message]);

    return (
        <ScreenLayout paddingSides={5}>
            <View style={style.container}>

                <Text style={style.section}>
                    INFO
                </Text>


                <Text style={style.text}>
                    <Text style={style.statement}>EmailVerified :</Text> {emailVerified.toString()}
                </Text>

                {
                    !emailVerified && <Button
                        // containerStyle={style.buttonContainer}
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
                    onPress={() => {
                        dispatch(logout_api(true));
                    }}
                />

                <Text style={style.text}>
                    <Text style={style.statement}>serverError :</Text> {serverError}
                </Text>

            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 90,
        marginTop: 15,
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
