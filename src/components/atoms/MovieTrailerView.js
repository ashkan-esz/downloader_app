import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Video} from "expo-av";
import PropTypes from 'prop-types';
import {Overlay} from "react-native-elements";
import {Mixins} from "../../styles";


const MovieTrailerView = ({poster, trailer, overlay, setOverlay}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef(null);

    return (
        <Overlay
            overlayStyle={style.overlay}
            isVisible={overlay}
            onBackdropPress={() => setOverlay(false)}
            animationType={"slide"}
        >
            <Video
                style={style.video}
                ref={videoRef}
                source={{uri: trailer}}
                usePoster={true}
                posterSource={poster ? {uri: poster.url} : null}
                posterStyle={[style.video, {resizeMode: 'stretch'}]}
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
            />
        </Overlay>
    );
};

const style = StyleSheet.create({
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        ...Mixins.padding(0),
        borderRadius: 10
    },
    video: {
        width: '100%',
        height: '100%',
    },
});

MovieTrailerView.propTypes = {
    trailer: PropTypes.string.isRequired,
    overlay: PropTypes.bool.isRequired,
    setOverlay: PropTypes.func.isRequired,
    poster: PropTypes.object,
}


export default MovieTrailerView;
