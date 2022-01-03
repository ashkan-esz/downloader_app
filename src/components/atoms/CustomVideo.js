import React, {memo, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Video} from "expo-av";
import {useNavigation} from "@react-navigation/native";
import PropTypes from 'prop-types';


const CustomVideo = ({
                         videoStyle,
                         isOnScreenView,
                         trailer,
                         poster,
                         setIsPlaying,
                         startFullscreen
                     }) => {
    const navigation = useNavigation();

    const [isFullScreen, setIsFullScreen] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (startFullscreen && isFullScreen) {
                videoRef.current.presentFullscreenPlayer();
            }
            videoRef.current.setOnPlaybackStatusUpdate(status => {
                setIsPlaying(status.isPlaying || isFullScreen);
            });
        }
    }, [isFullScreen]);

    useEffect(() => {
        if (!isOnScreenView && videoRef.current) {
            videoRef.current.pauseAsync();
        }
    }, [isOnScreenView]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if (videoRef.current) {
                videoRef.current.pauseAsync();
            }
        });
        return unsubscribe;
    }, [navigation]);

    const _onFullscreenUpdate = (event) => {
        setIsFullScreen(event.fullscreenUpdate === 1);
        if (event.fullscreenUpdate === 3) {
            videoRef.current.pauseAsync();
        }
    }

    return (
        <Video
            style={videoStyle}
            source={{uri: trailer}}
            usePoster={true}
            posterSource={poster ? {uri: poster.url} : null}
            posterStyle={[style.video, {resizeMode: 'stretch'}]}
            ref={videoRef}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={"contain"}
            shouldPlay={true}
            useNativeControls
            progressUpdateIntervalMillis={1000}
            onFullscreenUpdate={_onFullscreenUpdate}
        />
    );
}

const style = StyleSheet.create({});

CustomVideo.propTypes = {
    poster: null,
};

CustomVideo.propTypes = {
    videoStyle: PropTypes.object,
    isOnScreenView: PropTypes.bool,
    trailer: PropTypes.string.isRequired,
    poster: PropTypes.object,
    setIsPlaying: PropTypes.func.isRequired,
    startFullscreen: PropTypes.bool,
}


export default memo(CustomVideo);
