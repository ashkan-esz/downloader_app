import React, {useEffect, useRef, useState} from 'react';
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

    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (startFullscreen) {
                videoRef.current.presentFullscreenPlayer();
            }
            videoRef.current.setOnPlaybackStatusUpdate(status => {
                setIsPlaying(status.isPlaying || isFullScreen);
            });
        }
    }, []);

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
            posterSource={poster ? {uri: poster} : null}
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
    poster: PropTypes.string,
    setIsPlaying: PropTypes.func.isRequired,
    startFullscreen: PropTypes.bool,
}


export default CustomVideo;

