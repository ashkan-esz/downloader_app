import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, Typography} from "../../../../styles";
import PropTypes from 'prop-types';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";

const SectionNavBar = ({extraStyle, sections, tab, onTabChange}) => {

    return (
        <View style={[style.container, extraStyle]}>
            {sections.map((value, index) => {

                const color = useSharedValue(Colors.NAVBAR);
                const size = useSharedValue(15);
                const sectionIndex= sections.findIndex(s => s.name === tab);

                useEffect(() => {
                    color.value = interpolateColor(
                        sectionIndex,
                        [index - 1, index, index + 1,],
                        [Colors.NAVBAR, "#fff", Colors.NAVBAR],
                        // [Colors.NAVBAR, Colors.THIRD, Colors.NAVBAR],
                        "RGB",
                    );

                    if (sectionIndex === index) {
                        size.value = withTiming(Typography.getFontSize(18), {
                            duration: 20,
                            // easing: Easing.quad,
                            easing: Easing.circle,
                        })
                        // color.value = withTiming("#fff",{
                        //     duration: 20,
                        //     // easing: Easing.quad,
                        //     easing: Easing.circle,
                        // })
                    } else {
                        size.value = withTiming(Typography.getFontSize(15), {
                            duration: 20,
                            easing: Easing.circle,
                        })
                        // color.value = withTiming(Colors.NAVBAR,{
                        //     duration: 20,
                        //     // easing: Easing.quad,
                        //     easing: Easing.circle,
                        // })
                    }
                }, [tab]);

                const translateFontAnim = useAnimatedStyle(() => ({
                    fontSize: size.value,
                    color: color.value,
                    marginTop: 10,
                    marginBottom: 15,
                }), [size, color]);

                return (
                    <Animated.Text
                        style={translateFontAnim}
                        type={"clear"}
                        key={value.name}
                        onPress={() => onTabChange(value.name)}
                    >
                        {value.label}
                    </Animated.Text>
                )
            })}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
        marginTop: 5,
        marginLeft: -5,
        marginRight: -5,
        marginBottom: -5,
    },
    // buttonTitle: {
    //     color: Colors.NAVBAR,
    //     fontSize: Typography.getFontSize(15),
    //     marginTop: 10,
    //     marginBottom: 15,
    // },
    // activeButtonTitle: {
    //     color: '#ffffff',
    //     fontSize: Typography.getFontSize(18),
    // }
});

SectionNavBar.propTypes = {
    extraStyle: PropTypes.object,
    sections: PropTypes.array.isRequired,
    tab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired
};


export default SectionNavBar;

