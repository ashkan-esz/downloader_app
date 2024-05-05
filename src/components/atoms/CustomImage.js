import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import PropTypes from 'prop-types';

const noImage = require('../../assets/images/noImage.png');

const CustomImage = ({
                         extraStyle,
                         posters,
                         resizeModeStretch,
                         onPress,
                         movieId,
                     }) => {

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
        >
            <Image
                style={[style.image, extraStyle]}
                source={(posters?.length > 0 && posters[0] && posters.map(p => p?.url).filter(Boolean)) || noImage}
                placeholder={posters?.[0]?.blurHash || posters?.[0]?.thumbnail}
                transition={100}
                cachePolicy={"disk"}
                recyclingKey={movieId}
                priority={"normal"}
                contentFit={resizeModeStretch ? "fill" : "cover"}
                contentPosition={"center"}
                placeholderContentFit={"fill"}
            />
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    image: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

CustomImage.propTypes = {
    extraStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    posters: PropTypes.arrayOf(PropTypes.object),
    movieId: PropTypes.string,
    resizeModeStretch: PropTypes.bool,
    onPress: PropTypes.func,
}


export default CustomImage;
