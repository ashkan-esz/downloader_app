import React, {memo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "react-native-elements";
import {TrailerImageSwitch, SectionMovieCardRating} from "../../atoms";
import {useNavigation} from "@react-navigation/native";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const TrailerMovieCard = ({
                              extraStyle,
                              posters,
                              trailer,
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
            id, title, type, posters, rating
        })
    }

    const partialQuality = homeStackHelpers.getPartialQuality(latestData.quality, 4);

    const typeColor = {
        color: type === 'movie' ? Colors.RED2 : 'cyan',
    }

    return (
        <View style={[style.container, extraStyle]}>

            <TrailerImageSwitch
                videoStyle={style.video}
                trailer={trailer}
                poster={posters.length > 0 ? posters[0] : ''}
                onLongPress={navigateToMovieScreen}
            />

            <TouchableOpacity
                onPress={navigateToMovieScreen}
                activeOpacity={1}
            >
                <View style={style.infoContainer}>
                    <Text style={style.title} numberOfLines={1}>
                        Title : {title}
                    </Text>
                    <SectionMovieCardRating rating={rating} like={like}/>
                    <View style={style.lineSeparator}/>

                    <View style={style.flexDirectionRow}>
                        <Text style={style.year}>
                            <Text style={style.statement}>Year :</Text> {premiered.split('-')[0]}
                        </Text>

                        <Text style={[style.year, style.paddingLeft]}>
                            |
                        </Text>

                        <Text style={[style.year, style.paddingLeft]}>
                            <Text style={style.statement}>Type : </Text><Text
                            style={[style.year, typeColor]}> {type}</Text>
                        </Text>
                        {
                            type === 'serial' &&
                            <Text style={[style.year, style.paddingLeft]}>
                                <Text style={style.statement}>Status :</Text> {status.slice(0, 15)}
                            </Text>
                        }
                    </View>
                    <Text style={style.year} numberOfLines={1}>
                        <Text style={style.statement}>Genres : </Text> {genres.join(' ,') || 'unknown'}
                    </Text>

                    <View style={style.flexDirectionRow}>
                        {
                            type === 'serial' &&
                            <Text style={style.year}>
                                <Text style={style.statement}>Episode
                                    : </Text> {'S' + latestData.season + 'E' + latestData.episode}
                            </Text>
                        }
                        <Text style={[style.year, type === 'serial' && style.paddingLeft]} numberOfLines={1}>
                            <Text style={style.statement}>Quality : </Text> {partialQuality}
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: Mixins.WINDOW_WIDTH / 1.7 + 160,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 10,
        marginBottom: 30,
    },
    video: {
        height: Mixins.WINDOW_WIDTH / 1.7,
        minHeight: 200,
        borderRadius: 5,
        paddingTop: 30,
        resizeMode: 'stretch',
    },
    infoContainer: {
        paddingTop: 5,
        paddingLeft: 10,
        width: '100%',
        flexShrink: 1,
    },
    title: {
        fontSize: Typography.getFontSize(18),
        color: '#ffffff',
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
        color: '#ffffff',
        marginTop: 3
    },
    statement: {
        fontSize: Typography.getFontSize(14),
        color: Colors.SemiCyan,
        marginTop: 2,
    },
    flexDirectionRow: {
        flexDirection: 'row',
    },
    paddingLeft: {
        paddingLeft: 10,
    }
});

TrailerMovieCard.propTypes = {
    extraStyle: PropTypes.object,
    posters: PropTypes.array.isRequired,
    trailer: PropTypes.any.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    like: PropTypes.number.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    latestData: PropTypes.object.isRequired,
    nextEpisode: PropTypes.object,
    status: PropTypes.string.isRequired,
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.poster === nextProps.poster;
}

export default memo(TrailerMovieCard, areEqual);
