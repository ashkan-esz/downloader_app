import React, {useEffect, useRef} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue, withDelay,
    withSpring
} from "react-native-reanimated";
import {Ionicons} from "@expo/vector-icons";
import PropTypes from 'prop-types';


const LikeIconWithAnimation = ({
                                   extraStyle,
                                   extraIconStyle,
                                   isActive,
                                   iconName,
                                   outlineIconName,
                                   onPress,
                                   activeIconOnly,
                                   activeAnimationOnly,
                                   firstViewAnimation = true,
                                   autoHideLike,
                                   disableOnPressActivation,
                                   iconSize,
                                   iconColor,
                               }) => {

    const mounted = useRef(false);
    const firstView = useRef(true);
    const liked = useSharedValue((isActive && !activeAnimationOnly) ? 1 : 0);

    useEffect(() => {
        setTimeout(() => {
            mounted.current = true
        }, 10);
    }, []);

    useEffect(() => {
        return () => {
            firstView.current = true;
        }
    });

    useEffect(() => {
        if (!mounted.current) {
            return;
        }
        if (firstView.current) {
            firstView.current = false;
            //do not show animation on first view
            if (!firstViewAnimation) {
                liked.value = isActive ? 1 : 0;
                return;
            }
        }

        if ((isActive || activeAnimationOnly) && autoHideLike) {
            if (liked.value !== 0) {
                return;
            }
            liked.value = withSpring(1, undefined, (isFinished) => {
                if (isFinished) {
                    liked.value = withDelay(300, withSpring(0));
                }
            });
        } else {
            liked.value = withSpring((isActive || activeAnimationOnly) ? 1 : 0);
        }
    }, [isActive]);

    const outlineStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
                },
            ],
        };
    });

    const fillStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: Math.max(liked.value, 0),
            },
        ],
        opacity: liked.value,
    }));

    const _onPress = () => {
        onPress && onPress();
        if (disableOnPressActivation) {
            return;
        }
        if (!liked.value && autoHideLike) {
            liked.value = withSpring(1, undefined, isFinished => {
                if (isFinished) {
                    liked.value = withDelay(300, withSpring(0));
                }
            });
        } else {
            liked.value = withSpring(liked.value ? 0 : 1);
        }
    };

    return (
        <Pressable
            style={extraStyle}
            onPress={_onPress}
        >
            {
                !activeIconOnly && <Animated.View style={[
                    StyleSheet.absoluteFillObject,
                    outlineStyle
                ]}>
                    <Ionicons
                        name={outlineIconName}
                        size={iconSize || 30}
                        color={iconColor || "red"}
                        style={[style.icon, extraIconStyle]}
                    />
                </Animated.View>
            }

            <Animated.View style={fillStyle}>
                <Ionicons
                    name={iconName}
                    size={iconSize || 30}
                    color={iconColor || "red"}
                    style={[style.icon, extraIconStyle]}
                />
            </Animated.View>
        </Pressable>
    )
};

const style = StyleSheet.create({
    icon: {
        marginTop: 3,
        paddingLeft: 3
    },
});

LikeIconWithAnimation.propTypes = {
    extraStyle: PropTypes.object,
    extraIconStyle: PropTypes.object,
    isActive: PropTypes.bool.isRequired,
    iconName: PropTypes.string.isRequired,
    outlineIconName: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    activeIconOnly: PropTypes.bool,
    activeAnimationOnly: PropTypes.bool,
    firstViewAnimation: PropTypes.bool,
    autoHideLike: PropTypes.bool,
    disableOnPressActivation: PropTypes.bool,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
}


export default LikeIconWithAnimation;
