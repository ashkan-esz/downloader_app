import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from "../../../../styles";
import PropTypes from 'prop-types';
import Animated, {
    Easing,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";

const SectionNavBar = ({extraStyle, sections, tab, onTabChange}) => {

    return (
        <View style={[style.container, extraStyle]}>
            {sections.map((value, index) => {

                const sectionIndex = sections.findIndex(s => s.name === tab);

                const translateFontAnim = useAnimatedStyle(() => {
                    return {
                        fontSize: withTiming(sectionIndex === index ? 18 : 15, {
                            duration: 20,
                            // easing: Easing.quad,
                            easing: Easing.circle,
                        }),
                        color: interpolateColor(
                            sectionIndex,
                            [index - 1, index, index + 1,],
                            [Colors.NAVBAR, "#fff", Colors.NAVBAR],
                            // [Colors.NAVBAR, Colors.THIRD, Colors.NAVBAR],
                            "RGB",
                        ),
                        marginTop: 10,
                        marginBottom: 15,
                    }
                }, [tab]);

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
    //     fontSize: 15,
    //     marginTop: 10,
    //     marginBottom: 15,
    // },
    // activeButtonTitle: {
    //     color: '#ffffff',
    //     fontSize: 18,
    // }
});

SectionNavBar.propTypes = {
    extraStyle: PropTypes.object,
    sections: PropTypes.array.isRequired,
    tab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired
};


export default SectionNavBar;

