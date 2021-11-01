import React, {useEffect, useState} from 'react';
import {LayoutAnimation, Platform, StyleSheet, TouchableOpacity, UIManager, View} from 'react-native';
import {Text} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";
import CustomAccordion from "./CustomAccordion";
import MovieScreenEpisode from "./MovieScreenEpisode";
import {homeStackHelpers} from "../../helper";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenEpisodeCollapsible = ({sources, seasonNumber, episodes, rawTitle}) => {
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const [episodesLinks, setEpisodesLinks] = useState([]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    useEffect(() => {
        let temp = homeStackHelpers.getEpisodesLinks(sources, seasonNumber, episodes);
        setEpisodesLinks(temp);
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
        const blueGradient = ['rgba(63,94,251,1)', 'rgba(252,70,107,1)'];
        const episodeTitle = !item.title.match(/Episode \d/g) ? (' | ' + item.title) : '';
        const gradientStyle = item.links.length === 0
            ? [style.headerGradient, {opacity: 0.4}]
            : style.headerGradient;

        return (
            <TouchableOpacity onPress={() => toggleExpand(index)} activeOpacity={0.7}>
                <LinearGradient
                    colors={blueGradient}
                    locations={[0, 1]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={gradientStyle}
                >
                    <Text style={style.headerText} numberOfLines={1}>
                        {'Episode : ' + item.episode + episodeTitle}
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
                                linkData={value}
                                rawTitle={rawTitle}
                            />
                        )
                    })
                }
            </View>
        )
    }

    return (
        <CustomAccordion
            extraStyle={style.container}
            sections={episodesLinks}
            expandedIndex={expandedIndex}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
        />
    );
};

const style = StyleSheet.create({
    container: {
        paddingLeft: 7,
    },
    headerGradient: {
        height: 45,
        paddingTop: 9,
        borderRadius: 7,
        paddingLeft: 5,
        marginBottom: 10,
    },
    headerText: {
        fontSize: Typography.getFontSize(16),
        color: '#fff',
    },
    contentContainer: {
        marginLeft: 7,
        marginBottom: 3,
        zIndex: -1,
    },
    contentGradient: {
        borderRadius: 7,
        marginBottom: 7,
    }
});

MovieScreenEpisodeCollapsible.propTypes = {
    sources: PropTypes.array.isRequired,
    seasonNumber: PropTypes.number.isRequired,
    episodes: PropTypes.array.isRequired,
    rawTitle: PropTypes.string.isRequired,
}


export default MovieScreenEpisodeCollapsible;
