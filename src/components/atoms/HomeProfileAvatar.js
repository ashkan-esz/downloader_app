import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar} from "react-native-elements";
import {useSelector} from "react-redux";
import CustomImage from "./CustomImage";
import PropTypes from 'prop-types';


const HomeProfileAvatar = ({onPress}) => {
    const profileImages = useSelector(state => state.user.profileImages);
    const profileImage = useSelector(state => state.user.profileImage);

    return (
        <Avatar
            size={"medium"}
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
    image: {
        width: '100%',
        height: '100%',
    }
});

HomeProfileAvatar.propTypes = {
    onPress: PropTypes.func.isRequired,
}

export default HomeProfileAvatar;
