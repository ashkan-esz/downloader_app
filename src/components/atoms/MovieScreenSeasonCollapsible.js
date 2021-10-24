import React, {useEffect, useState} from 'react';
import {LayoutAnimation, Platform, StyleSheet, TouchableOpacity, UIManager} from 'react-native';
import {Text} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";
import CustomAccordion from "./CustomAccordion";
import MovieScreenEpisodeCollapsible from "./MovieScreenEpisodeCollapsible";
import {homeStackHelpers} from "../../helper";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenSeasonCollapsible = ({latestData, sources, seasons, episodes, rawTitle}) => {
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const [seasonsEpisodes, setSeasonsEpisodes] = useState([]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    useEffect(() => {
        let temp = homeStackHelpers.getSeasonsEpisodes(seasons, episodes, latestData);
        setSeasonsEpisodes(temp);
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
        const releasedEpisodesText = item.releasedEpisodesNumber !== item.episodesNumber
            ? ` | released : ${item.releasedEpisodesNumber}`
            : '';
        const cyanGradient = ['rgba(34,193,195,1)', 'rgba(253,187,45,1)'];
        const gradientStyle = item.releasedEpisodesNumber === 0
            ? [style.headerGradient, {opacity: 0.4}]
            : style.headerGradient;

        return (
            <TouchableOpacity onPress={() => toggleExpand(index)} activeOpacity={0.7}>
                <LinearGradient
                    colors={cyanGradient}
                    start={[0, 0]}
                    end={[1, 1]}
                    locations={[0, 1]}
                    style={gradientStyle}
                >
                    <Text style={style.headerText}>
                        {'Season : ' + item.seasonNumber + ' | Episodes : ' + item.episodesNumber + releasedEpisodesText}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    const _renderContent = (item) => {
        const filterEpisodes = episodes.filter(value => value.season === item.seasonNumber);
        return (
            <MovieScreenEpisodeCollapsible
                sources={sources}
                seasonNumber={item.seasonNumber}
                episodes={filterEpisodes}
                rawTitle={rawTitle}
            />
        )
    }

    return (
        <CustomAccordion
            sections={seasonsEpisodes}
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
    }
});

MovieScreenSeasonCollapsible.propTypes = {
    latestData: PropTypes.object.isRequired,
    sources: PropTypes.array.isRequired,
    seasons: PropTypes.array.isRequired,
    episodes: PropTypes.array.isRequired,
    rawTitle: PropTypes.string.isRequired,
}


export default MovieScreenSeasonCollapsible;
