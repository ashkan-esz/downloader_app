import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import PropTypes from "prop-types";
import {Colors} from "../../../../styles";

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

    const animatedStyle = useAnimatedStyle(() => {
        let opacity = activeIndex === index ? 1 : defaultProps.inActiveDotOpacity;
        let bgColor = activeIndex === index ? defaultProps.activeDotColor : defaultProps.inActiveDotColor;
        let scale = activeIndex === index ? defaultProps.activeDotScale : 1;

        return {
            opacity: withTiming(opacity),
            backgroundColor: withTiming(bgColor),
            transform: [
                {
                    scale: withTiming(scale),
                },
            ],
        }
    }, [activeIndex]);

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
