import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {Button, Text} from "react-native-elements";
import {useDispatch, useSelector} from "react-redux";
import {logout_api} from "../../redux/slices/user.slice";
import {Colors, Typography} from "../../styles";

//todo :

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const isLoggingOut = useSelector(state => state.user.isLoggingOut);

    return (
        <ScreenLayout paddingSides={5}>
            <View style={style.container}>


                <Text style={style.text}> Logout </Text>

                <Button
                    containerStyle={style.buttonContainer}
                    buttonStyle={style.button}
                    title={'Logout'}
                    loading={isLoggingOut}
                    loadingProps={{
                        size: "large",
                        animating: true,
                    }}
                    onPress={() => {
                        dispatch(logout_api(true));
                    }}
                />


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
    },
    text: {
        color: Colors.WARNING,
        fontSize: Typography.getFontSize(20),
        textAlign: 'center'
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
        backgroundColor: Colors.RED2
    }
});


export default ProfileScreen;
