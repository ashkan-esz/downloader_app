import React, {useEffect, useState} from 'react';
import {StyleSheet, Platform, UIManager, LayoutAnimation, TouchableOpacity, View} from 'react-native';
import {Text} from "@rneui/themed";
import {LinearGradient} from "expo-linear-gradient";
import CustomAccordion from "./CustomAccordion";
import MovieScreenEpisode from "./MovieScreenEpisode";
import PropTypes from 'prop-types';


const MovieScreenQualityCollapsible = ({rawTitle, qualities, scrollToDownload}) => {
    const [expandedIndex, setExpandedIndex] = useState(-1);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

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
        const cyanGradient = ['rgba(34,193,195,1)', 'rgba(253,187,45,1)'];
        const gradientStyle = (item.links.length === 0 && item.torrentLinks.length === 0)
            ? [style.headerGradient, {opacity: 0.4}]
            : style.headerGradient;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (item.links.length > 0 || item.torrentLinks.length > 0) && toggleExpand(index)}
            >
                <LinearGradient
                    colors={cyanGradient}
                    start={[0, 0]}
                    end={[1, 1]}
                    locations={[0, 1]}
                    style={gradientStyle}
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
        fontSize: 18,
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

MovieScreenQualityCollapsible.propTypes = {
    scrollToDownload: PropTypes.func.isRequired,
    qualities: PropTypes.array.isRequired,
    rawTitle: PropTypes.string.isRequired,
}


export default MovieScreenQualityCollapsible;
