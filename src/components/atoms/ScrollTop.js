import React from 'react';
import {StyleSheet} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import {Colors} from '../../styles';
import PropTypes from 'prop-types';
import Animated, {useAnimatedStyle, withTiming} from "react-native-reanimated";

const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);

const ScrollTop = ({extraStyle, show, flatListRef, extraMarginBottom}) => {

    const _scrollToTop = () => {
        if (flatListRef && flatListRef.current) {
            flatListRef.current.scrollToOffset({animated: true, offset: 0});
        }
    }

    const rStyle = useAnimatedStyle(() => {
        return {
            bottom: 20 + (extraMarginBottom | 0),
            opacity: withTiming(show ? 1 : 0),
            transform: [
                {
                    scale: withTiming(show ? 1 : 0),
                },
            ]
        }
    }, [show]);

    return (
        <AnimatedIcon
            style={[style.icon, extraStyle, rStyle]}
            name="upcircle"
            size={50}
            color={Colors.GRAY_DARK}
            onPress={_scrollToTop}
            delayPressIn={0}
            onPressIn={_scrollToTop}
            hitSlop={5}
        />
    );
}

const style = StyleSheet.create({
    icon: {
        position: 'absolute',
        bottom: 20,
        right: 5,
        zIndex: 10,
    }
});

ScrollTop.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    extraStyle: PropTypes.object,
    extraMarginBottom: PropTypes.number,
}


export default ScrollTop;
