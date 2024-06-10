import React from 'react';
import {View, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Text} from "@rneui/themed";
import Slider from "@react-native-community/slider";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {Colors} from "../../styles";
import PropTypes from 'prop-types';
import Animated, {useAnimatedStyle, withTiming} from "react-native-reanimated";


const CustomVideoControls = ({
                                 bottomControlsStyle,
                                 onTogglePlayPause,
                                 onToggleMute,
                                 onTogglePlaybackSpeed,
                                 onSeek,
                                 onToggleFullscreen,
                                 duration,
                                 currentTime,
                                 rate,
                                 isMuted,
                                 isFullScreen,
                                 shouldPlay,
                                 isBuffering,
                                 showControls,
                             }) => {

    const formatTime = (timeInMillis) => {
        if (!isNaN(timeInMillis)) {
            const totalSeconds = Math.floor(timeInMillis / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            return `${minutes < 10 ? "0" : ""}${minutes}:${
                seconds < 10 ? "0" : ""
            }${seconds}`;
        }

        return "00:00";
    };

    const rStyle = useAnimatedStyle(() => {
        return {
            opacity: showControls ? withTiming(1) : withTiming(0),
        }
    }, [showControls]);

    return (
        <>
            <Animated.View style={[styles.container, bottomControlsStyle, rStyle]}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <TouchableOpacity
                    style={styles.volumeIcon}
                    onPress={onToggleMute}
                >
                    <Ionicons
                        name={isMuted ? "volume-mute" : "volume-high"}
                        size={20}
                        color="white"
                    />
                </TouchableOpacity>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={currentTime}
                    onSlidingComplete={onSeek}
                    minimumTrackTintColor={"#FFF"}
                    maximumTrackTintColor={"#AAA"}
                    thumbTintColor={"#FFF"}
                    thumbStyle={{height: 8, width: 8}}
                    // allowTouchTrack={true}
                    // tapToSeek={true}
                />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
                <TouchableOpacity
                    style={styles.rate}
                    onPress={onTogglePlaybackSpeed}
                >
                    <Text style={styles.playbackSpeedText}>{`${rate}x`}</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.fullscreenIcon, rStyle]}>
                <TouchableOpacity
                    // style={styles.fullscreenIcon}
                    onPress={onToggleFullscreen}
                >
                    <MaterialIcons
                        name={isFullScreen ? "fullscreen-exit" : "fullscreen"}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </Animated.View>

            <View style={styles.playIconContainer}>
                {
                    isBuffering && <ActivityIndicator
                        style={styles.playIcon}
                        size={45}
                        color={Colors.THIRD}
                        animating={true}
                    />
                }
                {
                    (!shouldPlay || !isBuffering) && <AntDesign
                        style={styles.playIcon}
                        name={!shouldPlay ? 'play' : 'pause'}
                        size={!shouldPlay ? 45 : 42}
                        color={'white'}
                        onPress={onTogglePlayPause}
                    />
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        alignSelf: "center",
        backgroundColor: "transparent",
        paddingTop: 5,
        paddingBottom: 4,
        paddingLeft: 10,
        position: "absolute",
        bottom: 0,
    },
    slider: {
        flex: 1,
        marginHorizontal: -2,
    },
    timeText: {
        color: "white",
        fontSize: 12,
    },
    volumeIcon: {
        marginLeft: 10,
    },
    rate: {
        marginHorizontal: 8,
    },
    playbackSpeedText: {
        color: "white",
        fontSize: 14,
        marginBottom: 1,
    },
    fullscreenIcon: {
        position: "absolute",
        // backgroundColor: "black",
        top: 8,
        right: 4,
        opacity: 0.8,
    },
    playIconContainer: {
        position: "absolute",
        justifyContent: "center",
        alignSelf: "center",
        bottom: 0,
        top: 0,
    },
    playIcon: {
        position: "absolute",
        justifyContent: "center",
        alignSelf: "center",
    },
});


CustomVideoControls.propTypes = {
    bottomControlsStyle: PropTypes.object,
    onTogglePlayPause: PropTypes.func.isRequired,
    onToggleMute: PropTypes.func.isRequired,
    onTogglePlaybackSpeed: PropTypes.func.isRequired,
    onSeek: PropTypes.func.isRequired,
    onToggleFullscreen: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    rate: PropTypes.number.isRequired,
    isMuted: PropTypes.bool.isRequired,
    isFullScreen: PropTypes.bool.isRequired,
    shouldPlay: PropTypes.bool.isRequired,
    isBuffering: PropTypes.bool.isRequired,
    showControls: PropTypes.bool.isRequired,
}


export default CustomVideoControls;
