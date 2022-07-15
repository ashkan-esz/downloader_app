import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar} from "@rneui/themed";
import {useSelector} from "react-redux";
import CustomImage from "./CustomImage";
import PropTypes from 'prop-types';

//todo :

const ProfileAvatar = ({size, onPress}) => {
    const profileImages = useSelector(state => state.user.profileImages);
    const profileImage = useSelector(state => state.user.profileImage);

    return (
        <Avatar
            containerStyle={style.container}
            activeOpacity={1}
            size={size || "medium"}
            ImageComponent={CustomImage}
            imageProps={{
                extraStyle: style.image,
                url: profileImages.length > 0 ? profileImages[0] : profileImage ? {url: profileImage} : null,
                onPress: onPress,
                resizeModeStretch: false,
                isProfile: true,
                noProgress: true,
            }}
            onPress={onPress}
            rounded
            testID={'home-avatar'}
        />
    );
}

const style = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

ProfileAvatar.propTypes = {
    onPress: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
}

export default ProfileAvatar;
