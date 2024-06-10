import React, {memo, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Video} from "expo-av";
import {useNavigation} from "@react-navigation/native";
import PropTypes from 'prop-types';
import {Colors, Mixins} from "../../styles";
import CustomImage from "./CustomImage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomVideoControls from "./CustomVideoControls";
import {GestureHandlerRootView, TapGestureHandler, State} from "react-native-gesture-handler";


const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

const CustomVideo = ({
                         extraStyle,
                         bottomControlsStyle,
                         posterExtraStyle,
                         isOnScreenView,
                         trailers,
                         poster,
                         // startFullscreen,
                         movieId,
                         follow,
                         watchList,
                         width,
                     }) => {

    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [showImage, setShowImage] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [shouldPlay, setShouldPlay] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const videoRef = useRef(null);
    const doubleTapRef = useRef();

    useEffect(() => {
        setIndex(0);
        setShowImage(true);
        setShouldPlay(false);
        setShowControls(false);
    }, [movieId]);

    // useEffect(() => {
    //     if (videoRef.current) {
    //         console.log(startFullscreen, isFullScreen)
    //         // if (startFullscreen && isFullScreen) {
    //         //     videoRef.current.presentFullscreenPlayer();
    //         // }
    //     }
    // }, [videoRef.current]);

    useEffect(() => {
        if (!isOnScreenView) {
            videoRef.current?.pauseAsync();
        }
    }, [isOnScreenView]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            videoRef.current?.pauseAsync();
        });
        return unsubscribe;
    }, [navigation]);

    const _onPlaybackStatusUpdate = (status) => {
        if (status.error) {
            if (currentTime === 0 && index < trailers.length - 2) {
                setIndex(index + 1);
            }
        }
        setShouldPlay(!!status.shouldPlay);
        setIsBuffering(!!(status.isBuffering && status.shouldPlay && !status.isPlaying));
        setCurrentTime(status.positionMillis || 0);
        setDuration(status.durationMillis || 0);
    }

    const _onTogglePlayPause = () => {
        if (shouldPlay) {
            videoRef.current?.pauseAsync();
        } else {
            setShowImage(false);
            setShouldPlay(true);
            setShowControls(true);
            videoRef.current?.playAsync();
        }
    }

    //--------------------------------
    //--------------------------------

    const _onToggleMute = () => {
        setIsMuted(prev => !prev);
    }

    const _onTogglePlaybackSpeed = () => {
        const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
        if (nextSpeedIndex < playbackSpeedOptions.length) {
            setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
        } else {
            setPlaybackSpeed(playbackSpeedOptions[0]);
        }
    }

    const _onFullscreenUpdate = (event) => {
        setIsFullScreen(event.fullscreenUpdate === 1);
        if (event.fullscreenUpdate === 3) {
            videoRef.current.pauseAsync();
        }
    }

    const _onToggleFullscreen = () => {
        if (!isFullScreen) {
            videoRef.current?.presentFullscreenPlayer();
            setIsFullScreen(true);
        } else {
            setIsFullScreen(false);
        }
    }

    //--------------------------------
    //--------------------------------
    const _onDoubleTap = (e) => {
        if (e.nativeEvent.state !== State.ACTIVE) {
            return
        }

        const touchX = e.nativeEvent.x;
        let mid = (width || Mixins.WINDOW_WIDTH) / 2;

        if (touchX < mid) {
            const newPosition = Math.max(currentTime - 10000, 0);
            videoRef.current.setPositionAsync(newPosition);
        } else {
            const newPosition = Math.min(currentTime + 10000, duration);
            videoRef.current.setPositionAsync(newPosition);
        }
    }

    const _onSingleTap = (e) => {
        if (e.nativeEvent.state === State.ACTIVE) {
            setShowControls(!showControls);
        }
    }

    //--------------------------------
    //--------------------------------

    return (
        <GestureHandlerRootView>

            {
                showImage
                    ? <><CustomImage
                        extraStyle={[extraStyle, posterExtraStyle]}
                        posters={[poster]}
                        resizeModeStretch={true}
                        movieId={movieId}
                    />
                        {
                            follow && <View style={style.likeContainer}>
                                <MaterialCommunityIcons
                                    name={"book-play"}
                                    size={22}
                                    color={Colors.FOLLOW_ICON}
                                />
                            </View>
                        }

                        {
                            watchList && <View style={style.likeContainer}>
                                <Ionicons
                                    name={'bookmark'}
                                    size={22}
                                    color={Colors.BLUE_LIGHT}
                                />
                            </View>
                        }
                    </>
                    :
                    <TapGestureHandler
                        onHandlerStateChange={_onSingleTap}
                        waitFor={doubleTapRef}>
                        <TapGestureHandler
                            onHandlerStateChange={_onDoubleTap}
                            numberOfTaps={2}
                            ref={doubleTapRef}>
                            <Video
                                style={extraStyle}
                                source={{uri: trailers[index]?.url || ""}}
                                usePoster={!!poster}
                                posterSource={{uri: poster?.url}}
                                posterStyle={[style.video, {resizeMode: 'stretch'}]}
                                ref={videoRef}
                                volume={1.0}
                                rate={playbackSpeed}
                                isMuted={isMuted}
                                resizeMode={"contain"}
                                shouldPlay={shouldPlay}
                                progressUpdateIntervalMillis={1000}
                                onFullscreenUpdate={_onFullscreenUpdate}
                                onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
                            />
                        </TapGestureHandler>
                    </TapGestureHandler>
            }

            <CustomVideoControls
                bottomControlsStyle={bottomControlsStyle}
                onTogglePlayPause={_onTogglePlayPause}
                onToggleMute={_onToggleMute}
                onTogglePlaybackSpeed={_onTogglePlaybackSpeed}
                onSeek={(value) => {
                    videoRef?.current.setPositionAsync(+value);
                }}
                onToggleFullscreen={_onToggleFullscreen}
                duration={duration}
                currentTime={currentTime}
                rate={playbackSpeed}
                isMuted={isMuted}
                isFullScreen={isFullScreen}
                shouldPlay={shouldPlay}
                isBuffering={isBuffering}
                showControls={showControls}
            />

        </GestureHandlerRootView>
    );
}

const style = StyleSheet.create({
    likeContainer: {
        backgroundColor: Colors.SECONDARY,
        borderRadius: 8,
        paddingLeft: 4,
        paddingRight: 2,
        paddingTop: 5,
        paddingBottom: 6,
        position: 'absolute',
        top: 0,
        right: 0,
    },
});

CustomVideo.propTypes = {
    extraStyle: PropTypes.object,
    bottomControlsStyle: PropTypes.object,
    posterExtraStyle: PropTypes.object,
    isOnScreenView: PropTypes.bool,
    trailers: PropTypes.array.isRequired,
    poster: PropTypes.object,
    startFullscreen: PropTypes.bool,
    movieId: PropTypes.string,
    follow: PropTypes.bool.isRequired,
    watchList: PropTypes.bool.isRequired,
    width: PropTypes.number,
}


export default memo(CustomVideo);
