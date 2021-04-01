import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Video} from "expo-av";
import PropTypes from 'prop-types';


const CustomVideo = ({videoStyle, trailer, poster, setIsPlaying}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef(null);

    return (
        <Video
            style={videoStyle}
            source={{uri: trailer}}
            posterSource={{uri: poster}}
            posterStyle={style.video}
            ref={videoRef}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={isFullScreen ? "contain" : "cover"}
            shouldPlay={true}
            useNativeControls
            onFullscreenUpdate={(event) => {
                setIsFullScreen(event.fullscreenUpdate === 1);
                if (event.fullscreenUpdate === 3) {
                    videoRef.current.pauseAsync();
                }
            }}
            onPlaybackStatusUpdate={status =>
                setIsPlaying(status.isPlaying || isFullScreen)
            }
        />
    );
}

const style = StyleSheet.create({});

CustomVideo.propTypes = {
    videoStyle: PropTypes.object,
    trailer: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    setIsPlaying: PropTypes.func.isRequired,
}


export default CustomVideo;

