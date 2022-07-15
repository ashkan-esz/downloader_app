import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {ProfileAvatar} from "../atoms";
import {useSelector} from "react-redux";
import {Typography} from "../../styles";

//todo : telegram like profile picture

const ProfileImage = () => {
    const profileImages = useSelector(state => state.user.profileImages);
    const profileImage = useSelector(state => state.user.profileImage);
    const username = useSelector(state => state.auth.username);

    return (
        <View>
            <ProfileAvatar
                size={'xlarge'}
                onPress={() => {
                }}
            />

            <Text style={style.username}>
                {username}
            </Text>
        </View>
    );
};

const style = StyleSheet.create({
    username: {
        fontSize: Typography.getFontSize(20),
        color: '#fff',
        alignSelf: 'center',
        marginTop: 5
    },
});


export default ProfileImage;

