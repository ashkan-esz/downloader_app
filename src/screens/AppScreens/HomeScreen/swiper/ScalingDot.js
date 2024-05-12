import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
    interpolate,
    Extrapolation,
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated';
import PropTypes from "prop-types";
import {Colors} from "../../../../styles";
// import {CARD_LENGTH, SIDECARD_LENGTH} from "./SwiperItem";

const ScalingDot = ({
                        // scrollX,
                        activeIndex,
                        index,
                        inActiveDotOpacity,
                        inActiveDotColor,
                        activeDotScale,
                        activeDotColor,
                    }) => {

    const defaultProps = {
        inActiveDotColor: inActiveDotColor || Colors.SECONDARY,
        activeDotColor: activeDotColor || Colors.THIRD,
        animationType: 'scale',
        inActiveDotOpacity: inActiveDotOpacity || 0.5,
        activeDotScale: activeDotScale || 1.2,
    };

    // const inputRange = [
    //     (index - 1) * CARD_LENGTH + SIDECARD_LENGTH,
    //     index * CARD_LENGTH,
    //     (index + 1) * CARD_LENGTH - SIDECARD_LENGTH,
    // ];
    const inputRange = [index - 1, index, index + 1];
    const opacityOutputRange = [defaultProps.inActiveDotOpacity, 1, defaultProps.inActiveDotOpacity];
    const scaleOutputRange = [1, defaultProps.activeDotScale, 1];

    const colorOutputRange = [
        defaultProps.inActiveDotColor,
        defaultProps.activeDotColor,
        defaultProps.inActiveDotColor,
    ];

    const extrapolation = {
        extrapolateRight: Extrapolation.CLAMP,
        extrapolateLeft: Extrapolation.CLAMP,
    };

    // One shared value drives all three animations.
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            // scrollX.value,
            activeIndex,
            inputRange,
            opacityOutputRange,
            extrapolation,
        ),
        backgroundColor: interpolateColor(
            // scrollX.value,
            activeIndex,
            inputRange,
            colorOutputRange,
        ),
        transform: [
            {
                scale: interpolate(
                    // scrollX.value,
                    activeIndex,
                    inputRange,
                    scaleOutputRange,
                    extrapolation,
                ),
            },
        ],
    }));

    return (
        <Animated.View
            key={`dot-${index}`}
            style={[styles.dotStyle, animatedStyle]}
        />
    );
};

const styles = StyleSheet.create({
    dotStyle: {
        width: 9,
        height: 9,
        borderRadius: 25,
    },
});

ScalingDot.propTypes = {
    index: PropTypes.number.isRequired,
    activeIndex: PropTypes.number,
    // scrollX: PropTypes.object,
    inActiveDotOpacity: PropTypes.number,
    inActiveDotColor: PropTypes.string,
    activeDotScale: PropTypes.number,
    activeDotColor: PropTypes.string,
}

export default ScalingDot;
