import React, {memo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Image, Text} from "react-native-elements";
import {SectionMovieCardRating} from "../../atoms";
import {useNavigation} from "@react-navigation/native";
import {getPartialQuality, getSerialState} from "../../../utils";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const SectionMovieCard = ({
                              extraStyle,
                              tab,
                              poster,
                              id,
                              title,
                              rating,
                              premiered,
                              type,
                              genres,
                              latestData,
                              nextEpisode,
                              status,
                              like
                          }) => {

    const navigation = useNavigation();

    const navigateToMovieScreen = () => {
        navigation.navigate('Movie', {
            name: title.slice(0, 25),
            id, title, type, poster, rating
        })
    }

    const serialState = getSerialState(latestData, nextEpisode, tab);
    const partialQuality = getPartialQuality(latestData.quality, 3);

    const typeColor = {
        color: type === 'movie' ? 'red' : 'cyan',
    }
    const titleFontSize = {
        fontSize: ((title.length - 4) * Typography.getFontSize(20) < Mixins.getWindowWidth(60))
            ? Typography.getFontSize(20)
            : Typography.getFontSize(18)
    }
    const yearTypeContainer = {
        flexDirection: type === 'serial' ? 'row' : 'column',
    }

    return (
        <TouchableOpacity
            onPress={navigateToMovieScreen}
            activeOpacity={1}
        >
            <View style={[style.container, extraStyle]}>
                <Image
                    containerStyle={style.image}
                    source={poster ? {uri: poster} : null}
                />
                <View style={style.infoContainer}>
                    <Text style={[style.title, titleFontSize]} numberOfLines={1}>
                        {title}
                    </Text>
                    <SectionMovieCardRating
                        rating={rating}
                        like={like}
                    />
                    <View style={style.lineSeparator}/>

                    <View style={yearTypeContainer}>
                        <Text style={style.year}>
                            <Text style={style.statement}>Year : </Text>{premiered.split('-')[0]}
                        </Text>
                        <Text style={[style.year, type === 'serial' && style.paddingLeft]}>
                            <Text style={style.statement}>Type : </Text><Text
                            style={[style.year, typeColor]}> {type}</Text>
                        </Text>
                    </View>
                    <Text style={style.year} numberOfLines={1}>
                        <Text style={style.statement}>Genres : </Text>{genres.join(' ,') || 'unknown'}
                    </Text>
                    {
                        type === 'serial' &&
                        <View>
                            <Text style={style.year}>
                                <Text style={style.statement}>Status : </Text>{status}
                            </Text>
                            <Text style={style.year}>
                                <Text style={style.statement}>Episode : </Text>{serialState}
                            </Text>
                            {
                                tab === 'todaySeries' &&
                                <Text style={style.year}>
                                    <Text style={style.statement}>Next Episode : </Text>
                                    {'S' + nextEpisode.season + 'E' + nextEpisode.episode}
                                </Text>
                            }
                        </View>
                    }

                    <Text style={style.year} numberOfLines={1}>
                        <Text style={style.statement}>Quality :</Text> {partialQuality}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: Mixins.getWindowHeight(33) < 240 ? 27 : 0,
        width: '100%',
        height: Mixins.getWindowHeight(33),
        maxHeight: 240,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 10
    },
    image: {
        width: Mixins.getWindowWidth(37),
        height: Mixins.getWindowHeight(33) + 8,
        maxHeight: 250,
        borderRadius: 8,
        marginTop: 10,
        paddingTop: 30,
        marginLeft: 10,
    },
    infoContainer: {
        paddingTop: 5,
        paddingLeft: 12,
        width: '100%',
        flexShrink: 1
    },
    title: {
        fontSize: Typography.getFontSize(20),
        color: '#fff',
    },
    lineSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.NAVBAR,
        marginTop: 4,
        marginBottom: 3,
        width: '90%'
    },
    year: {
        fontSize: Typography.getFontSize(14),
        color: '#fff',
        marginTop: 2
    },
    statement: {
        fontSize: Typography.getFontSize(14),
        color: Colors.SemiCyan,
        marginTop: 2,
    },
    paddingLeft: {
        paddingLeft: 10,
    }
});

SectionMovieCard.propTypes = {
    extraStyle: PropTypes.object,
    tab: PropTypes.string.isRequired,
    poster: PropTypes.any.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    like: PropTypes.number.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    latestData: PropTypes.object.isRequired,
    nextEpisode: PropTypes.any.isRequired,
    status: PropTypes.string.isRequired,
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.poster === nextProps.poster;
}

export default memo(SectionMovieCard, areEqual);
