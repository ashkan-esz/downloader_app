import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import PropTypes from 'prop-types';
import {Colors} from "../../styles";


const CustomImage = ({
                         extraStyle,
                         url,
                         showLoadingImage,
                         resizeModeStretch,
                         onPress,
                         progressSize,
                         progressThickness,
                         noProgress,
                         children,
                     }) => {
    const [isError, setIsError] = useState(false);
    const [loadPercent, setLoadPercent] = useState(-1);

    useEffect(() => {
        if (url && url.url && isError) {
            setIsError(false);
        }
    }, [url]);

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
            {
                (!isError && loadPercent !== 1 && loadPercent !== -1 && !noProgress) && <Progress.Circle
                    style={[extraStyle, style.progressCircle]}
                    size={progressSize || 50}
                    progress={loadPercent}
                    color={Colors.RED2}
                    borderWidth={1}
                    thickness={progressThickness || 2}
                />
            }
            <FastImage
                style={[style.image, extraStyle]}
                source={(!isError && url) ? {
                    uri: (url.link || url.url),
                    priority: FastImage.priority.normal,
                } : require('../../assets/images/noImage.png')}
                onError={() => setIsError(true)}
                resizeMode={_resizeMode}
                onProgress={e => setLoadPercent(e.nativeEvent.loaded / e.nativeEvent.total)}
                onLoadEnd={() => setLoadPercent(1)}
            >
                {children}
            </FastImage>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    progressCircle: {
        position: 'absolute',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 10,
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

CustomImage.propTypes = {
    url: null,
};

CustomImage.propTypes = {
    extraStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    url: PropTypes.object,
    showLoadingImage: PropTypes.bool,
    resizeModeStretch: PropTypes.bool,
    onPress: PropTypes.func,
    progressSize: PropTypes.number,
    progressThickness: PropTypes.number,
    noProgress: PropTypes.bool,
}


export default CustomImage;
