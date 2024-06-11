import React, {useState} from 'react';
import {LayoutAnimation, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {LinearGradient} from "expo-linear-gradient";
import CustomAccordion from "./CustomAccordion";
import MovieScreenEpisodeCollapsible from "./MovieScreenEpisodeCollapsible";
import {homeStackHelpers} from "../../helper";
import PropTypes from 'prop-types';

//todo : handle large number of episodes in titles like 'naruto' or 'one piece'

const MovieScreenSeasonCollapsible = ({seasons, latestData, rawTitle, scrollToDownload}) => {
    const [expandedIndex, setExpandedIndex] = useState(-1);

    const toggleExpand = (index) => {
        if (index === expandedIndex) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpandedIndex(-1);
        } else {
            scrollToDownload();
            setExpandedIndex(index);
        }
    }

    const _renderHeader = (item, index) => {
        const totalSeasonLinksNumber = item.episodes.map(item => item.links.concat(item.torrentLinks)).flat(1).length;
        const releasedEpisodesNumber = homeStackHelpers.getNumberOfReleasedEpisodes([item], latestData);
        const releasedEpisodesText = releasedEpisodesNumber !== item.episodes.length
            ? ` | released : ${releasedEpisodesNumber}`
            : '';
        const cyanGradient = ['rgba(34,193,195,1)', 'rgba(253,187,45,1)'];
        const gradientStyle = totalSeasonLinksNumber === 0
            ? [style.headerGradient, {opacity: 0.4}]
            : style.headerGradient;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => totalSeasonLinksNumber > 0 && toggleExpand(index)}
            >
                <LinearGradient
                    colors={cyanGradient}
                    start={[0, 0]}
                    end={[1, 1]}
                    locations={[0, 1]}
                    style={gradientStyle}
                >
                    <Text style={style.headerText}>
                        {'Season : ' + item.seasonNumber + ' | Episodes : ' + item.episodes.length + releasedEpisodesText}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    const _renderContent = (item) => {
        return (
            <MovieScreenEpisodeCollapsible
                episodes={item.episodes}
                rawTitle={rawTitle}
            />
        )
    }

    return (
        <CustomAccordion
            sections={seasons}
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
        fontSize: 18,
        color: '#fff',
    }
});

MovieScreenSeasonCollapsible.propTypes = {
    scrollToDownload: PropTypes.func.isRequired,
    latestData: PropTypes.object.isRequired,
    seasons: PropTypes.array.isRequired,
    rawTitle: PropTypes.string.isRequired,
}


export default MovieScreenSeasonCollapsible;
