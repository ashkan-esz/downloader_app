import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {CustomImage} from "../atoms";
import {useSelector} from "react-redux";
import {Typography} from "../../styles";

//todo : telegram like profile picture

const ProfileImage = () => {
    const profileImages = useSelector(state => state.user.profileImages);
    const defaultProfileImage = useSelector(state => state.user.defaultProfileImage);
    const username = useSelector(state => state.auth.username);

    return (
        <View>
            <CustomImage
                extraStyle={style.avatar}
                resizeModeStretch={false}
                posters={profileImages.length > 0 ? profileImages.map(p => ({url: p})) : [{url: defaultProfileImage}]}
            />

            <Text style={style.username}>
                {username}
            </Text>
        </View>
    );
};

const style = StyleSheet.create({
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 120,
        alignSelf: 'center',
    },
    username: {
        fontSize: Typography.getFontSize(20),
        color: '#fff',
        alignSelf: 'center',
        marginTop: 5
    },
});


export default ProfileImage;

