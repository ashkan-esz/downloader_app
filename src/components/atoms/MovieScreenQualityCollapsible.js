import React, {useEffect, useState} from 'react';
import {StyleSheet, Platform, UIManager, LayoutAnimation, TouchableOpacity, View} from 'react-native';
import {Text} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";
import CustomAccordion from "./CustomAccordion";
import MovieScreenEpisode from "./MovieScreenEpisode";
import {homeStackHelpers} from "../../helper";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenQualityCollapsible = ({sources}) => {
    const [qualities, setQualities] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(-1);

    useEffect(() => {
        let temp = homeStackHelpers.getMovieQualitiesSorted(sources);
        setQualities(temp);
    }, []);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (index === expandedIndex) {
            setExpandedIndex(-1);
        } else {
            setExpandedIndex(index);
        }
    }

    const _renderHeader = (item, index) => {
        const cyanGradient = ['rgba(34,193,195,1)', 'rgba(253,187,45,1)'];

        return (
            <TouchableOpacity onPress={() => toggleExpand(index)} activeOpacity={0.7}>
                <LinearGradient
                    colors={cyanGradient}
                    start={[0, 0]}
                    end={[1, 1]}
                    locations={[0, 1]}
                    style={style.headerGradient}
                >
                    <Text style={style.headerText}>
                        {'Quality : ' + item.quality}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    const _renderContent = (item) => {
        return (
            <View style={style.contentContainer}>
                {
                    item.links.map((value, index) => {
                        return (
                            <MovieScreenEpisode
                                key={index}
                                extraStyle={style.contentGradient}
                                episode={value}
                            />
                        )
                    })
                }
            </View>
        )
    }

    return (
        <CustomAccordion
            sections={qualities}
            expandedIndex={expandedIndex}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
        />
    );
};

const style = StyleSheet.create({
    headerGradient: {
        height: 45,
        borderRadius: 7,
        paddingLeft: 5,
        paddingTop: 8,
        marginBottom: 10,
    },
    headerText: {
        fontSize: Typography.getFontSize(18),
        color: '#fff',
    },
    contentContainer: {
        marginLeft: 7,
        marginBottom: 3,
    },
    contentGradient: {
        borderRadius: 7,
        marginBottom: 7,
    }
});

MovieScreenQualityCollapsible.propTypes = {
    sources: PropTypes.array.isRequired,
}


export default MovieScreenQualityCollapsible;
