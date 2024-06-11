import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from "@rneui/themed";
import {LinearGradient} from "expo-linear-gradient";
import CustomAccordion from "./CustomAccordion";
import MovieScreenEpisode from "./MovieScreenEpisode";
import PropTypes from 'prop-types';


const MovieScreenEpisodeCollapsible = ({episodes, rawTitle}) => {
    const [expandedIndex, setExpandedIndex] = useState(-1);

    const toggleExpand = (index) => {
        if (index === expandedIndex) {
            setExpandedIndex(-1);
        } else {
            setExpandedIndex(index);
        }
    }

    const _renderHeader = (item, index) => {
        const blueGradient = ['rgba(63,94,251,1)', 'rgba(252,70,107,1)'];
        const episodeTitle = !item.title.match(/Episode \d/g) ? (' | ' + item.title) : '';
        const gradientStyle = (item.links.length === 0 && item.torrentLinks.length === 0)
            ? [style.headerGradient, {opacity: 0.4}]
            : style.headerGradient;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (item.links.length > 0 || item.torrentLinks.length > 0) && toggleExpand(index)}
            >
                <LinearGradient
                    colors={blueGradient}
                    locations={[0, 1]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={gradientStyle}
                >
                    <Text style={style.headerText} numberOfLines={1}>
                        {'Epi ' + item.episodeNumber + episodeTitle}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    const _renderContent = (item) => {
        return (
            <View style={style.contentContainer}>
                {
                    [...item.links, ...item.torrentLinks].map((value, index) => {
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
            sections={episodes}
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
        zIndex: 10,
    },
    headerText: {
        fontSize: 15,
        color: '#fff',
        zIndex: 10,
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
    episodes: PropTypes.array.isRequired,
    rawTitle: PropTypes.string.isRequired,
}


export default MovieScreenEpisodeCollapsible;
