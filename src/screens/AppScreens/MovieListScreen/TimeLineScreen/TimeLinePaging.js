import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import PropTypes from 'prop-types';
import {Typography, Colors} from "../../../../styles";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";


const TimeLinePaging = ({extraStyle, spacing, setSpacing}) => {
    const [innerValue, setInnerValue] = useState(spacing);
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withTiming(
            0,
            {
                duration: 150,
                easing: Easing.sin
            },
        )
        setInnerValue(getDay(spacing));
        let id = setTimeout(() => {
            opacity.value = withTiming(
                1,
                {
                    duration: 150,
                    easing: Easing.sin
                },
            )
        }, 150);
        return () => clearTimeout(id);
    }, [spacing]);

    const animatedOpacity = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        }
    })

    const getDay = (number) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayNumber = new Date().getDay();
        if (number === todayNumber) {
            return daysOfWeek[number] + ' - Today';
        } else if (number === todayNumber + 1) {
            return daysOfWeek[number] + ' - Tomorrow';
        }
        return daysOfWeek[number];
    }

    return (
        <View style={[style.container, extraStyle]}>
            <TouchableOpacity
                style={style.leftIcon}
                onPress={() => setSpacing((sp) => (sp + 6) % 7)}
                activeOpacity={0.5}
            >
                <AntDesign
                    name="caretleft"
                    size={32}
                    color={Colors.THIRD}
                />
            </TouchableOpacity>

            <Animated.Text style={[style.title, animatedOpacity]}>{innerValue}</Animated.Text>

            <TouchableOpacity
                style={style.rightIcon}
                onPress={() => setSpacing((sp) => (sp + 1) % 7)}
                activeOpacity={0.5}
            >
                <AntDesign
                    name="caretright"
                    size={32}
                    color={Colors.THIRD}
                />
            </TouchableOpacity>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 15,
        paddingBottom: 20,
    },
    title: {
        color: '#ffffff',
        fontSize: 22,
        position: 'absolute',
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        // marginTop: 2,
        zIndex: 1,
    },
    leftIcon: {
        position: 'absolute',
        left: 3,
        zIndex: 2,
    },
    rightIcon: {
        position: 'absolute',
        right: 3,
        zIndex: 2,
    }
});

TimeLinePaging.propTypes = {
    extraStyle: PropTypes.object,
    spacing: PropTypes.number.isRequired,
    setSpacing: PropTypes.func.isRequired,
}


export default TimeLinePaging;
