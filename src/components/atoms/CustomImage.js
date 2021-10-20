import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';


const CustomImage = ({extraStyle, url, showLoadingImage, resizeModeStretch, onPress}) => {
    const [isError, setIsError] = useState(false);

    if (showLoadingImage) {
        return (
            <FastImage
                style={extraStyle}
                source={require('../../assets/images/loadingImage.png')}
            />
        );
    }

    const _resizeMode = resizeModeStretch ? FastImage.resizeMode.stretch : FastImage.resizeMode.cover;

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
        >
            <FastImage
                style={extraStyle}
                source={(!isError && url) ? {
                    uri: url,
                    priority: FastImage.priority.normal,
                } : require('../../assets/images/noImage.png')}
                onError={() => {
                    setIsError(true);
                }}
                resizeMode={_resizeMode}
            />
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({});

CustomImage.propTypes = {
    url: null,
};

CustomImage.propTypes = {
    extraStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    url: PropTypes.string,
    showLoadingImage: PropTypes.bool,
    resizeModeStretch: PropTypes.bool,
    onPress: PropTypes.func,
}


export default CustomImage;
