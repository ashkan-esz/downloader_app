import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Button} from "@rneui/themed";
import {Colors, Mixins} from "../../../styles";
import PropTypes from 'prop-types';
import {homeStackHelpers} from "../../../helper";
import Animated, {
    withTiming,
    ReduceMotion,
    useAnimatedStyle, useFrameCallback,
} from "react-native-reanimated";
import {movieTypes} from "../../../utils";


const FilterType = ({expanded, setExpanded, types, setTypes, hidden}) => {

    useFrameCallback(() => {
        // This is an optimization which prevents stutter on slow momentum scrolling
    });

    const toggleExpand = () => {
        if (expanded) {
            setTimeout(() => {
                setExpanded(false);
            }, 200);
        } else {
            setExpanded(true);
        }
    }

    const toggleType = (t) => {
        if (types.includes(t)) {
            setTypes(types.filter(type => type !== t));
        } else {
            setTypes((prev) => [...prev, t].sort((a, b) => movieTypes.all.indexOf(a) - movieTypes.all.indexOf(b)));
        }
    }

    useEffect(() => {
        if (hidden) {
            setExpanded(false);
        }
    }, [hidden]);

    const heightRStyle = useAnimatedStyle(() => {
        let newHeight = hidden ? 0 : expanded ? 120 : 45;
        return {
            height: withTiming(newHeight, {
                duration: 800,
                reduceMotion: ReduceMotion.Never,
            }),
        }
    }, [hidden, expanded]);

    const expandAnimatedStyle = useAnimatedStyle(() => {
        let config = {
            duration: 200,
            reduceMotion: ReduceMotion.Never,
        }
        let closeConfig = {
            duration: 10,
            reduceMotion: ReduceMotion.Never,
        }
        let marginTop = expanded ? withTiming(-40, config) : withTiming(0, closeConfig);
        let paddingTop = expanded ? withTiming(43, config) : withTiming(0, closeConfig);
        return {
            marginTop: marginTop,
            paddingTop: paddingTop,
        }
    }, [expanded]);

    return (
        <Animated.View style={heightRStyle}>
            <Button
                containerStyle={[style.buttonContainer, expanded && style.expanded]}
                titleStyle={style.buttonTitle}
                title={'Filter'}
                type={"clear"}
                onPress={toggleExpand}
            />

            <Animated.View style={[style.typesContainer, expandAnimatedStyle]}>
                {
                    movieTypes.all.map(t => (
                        <Button
                            key={t}
                            containerStyle={[
                                style.typesButtonContainer,
                                types.includes(t) && style.selectedType
                            ]}
                            titleStyle={style.typesButtonTitle}
                            title={homeStackHelpers.capitalize(t)}
                            type={"clear"}
                            onPress={() => toggleType(t)}
                        />
                    ))
                }
            </Animated.View>

        </Animated.View>
    );
};

const style = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        flexShrink: 1,
        width: Mixins.WINDOW_WIDTH - 35,
        height: 30,
        marginTop: 10,
        marginBottom: 5,
        // backgroundColor: Colors.BLACK,
        backgroundColor: Colors.THIRD,
        borderRadius: 8,
        opacity: 1,
        zIndex: 2,
    },
    expanded: {
        // opacity: 0.8,
        opacity: 0.6,
    },
    buttonTitle: {
        fontSize: 20,
        color: '#ffffff',
        height: '100%',
        textAlign: "center",
        textAlignVertical: "center",
    },
    typesContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: "wrap",
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
        gap: 5,
        paddingLeft: 8,
        paddingRight: 8,
        // backgroundColor: "#E549824C",
        backgroundColor: "black",
        borderRadius: 8,
        overflow: "hidden",
    },
    typesButtonContainer: {
        // backgroundColor: Colors.RED2,
        // backgroundColor: Colors.BLUE_LIGHT,
        backgroundColor: "rgba(139,182,231,0.27)",
        width: (Mixins.WINDOW_WIDTH - 25 - 20) / 2,
        height: 30,
        justifyContent: 'center',
        opacity: 1,
        zIndex: 2,
    },
    typesButtonTitle: {
        fontSize: 16,
        color: '#ffffff',
        justifyContent: 'center',
        textAlign: "center",
        textAlignVertical: "center",
        height: "100%",
    },
    selectedType: {
        backgroundColor: Colors.THIRD,
    }
});

FilterType.propTypes = {
    expanded: PropTypes.bool.isRequired,
    setExpanded: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired,
    setTypes: PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired,
}


export default FilterType;
