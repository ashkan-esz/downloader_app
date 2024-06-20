import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {CustomVideo} from "../../../../components/atoms";
import MovieCardRating from "../MovieCardRating";
import {useNavigation} from "@react-navigation/native";
import {homeStackHelpers} from "../../../../helper";
import {Colors, Mixins} from "../../../../styles";
import PropTypes from 'prop-types';
import MovieCardFollow from "../MovieCardFollow";


const TrailerMovieCard = ({
                              extraStyle,
                              isOnScreenView,
                              posters,
                              widePoster,
                              trailers,
                              movieId,
                              title,
                              rating,
                              premiered,
                              type,
                              genres,
                              latestData,
                              nextEpisode,
                              follow,
                              watchList,
                          }) => {

    const navigation = useNavigation();

    const memorizedNavigation = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters, rating,
        });
    }, [movieId, title, type, posters, rating]);

    const partialQuality = homeStackHelpers.getPartialQuality(latestData.quality, 3);

    const typeColor = {
        color: type.includes('movie') ? Colors.RED2 : 'cyan',
    }

    return (
        <View style={[style.container, extraStyle]}>

            <CustomVideo
                extraStyle={style.video}
                bottomControlsStyle={style.videoControls}
                posterExtraStyle={style.videoPoster}
                isOnScreenView={isOnScreenView}
                trailers={trailers}
                poster={widePoster || posters[0]}
                movieId={movieId}
                follow={false}
                watchList={false}
            />

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={memorizedNavigation}
            >
                <View style={style.infoContainer}>
                    <Text style={style.title} numberOfLines={1}>
                        Title : {title}
                    </Text>

                    <View style={style.tagsContainer}>
                        <MovieCardFollow
                            type={type}
                            isFollow={follow}
                            isWatchList={watchList}
                        />
                        <MovieCardRating
                            extraStyle={style.rating}
                            ratingContainerStyle={style.ratingContainer}
                            rating={rating}
                        />
                    </View>

                    <View style={style.lineSeparator}/>

                    <View style={style.flexDirectionRow}>
                        <Text style={style.year}>
                            <Text style={style.statement}>Year :</Text> {premiered.split('-')[0]}
                        </Text>

                        <Text style={[style.year, style.paddingLeft]}>
                            |
                        </Text>

                        <Text style={[style.year, style.paddingLeft]}>
                            <Text style={style.statement}>Type : </Text>
                            <Text style={[style.year, typeColor]}>
                                {homeStackHelpers.capitalize(type)}
                            </Text>
                        </Text>
                    </View>

                    <Text style={style.year} numberOfLines={1}>
                        <Text style={style.statement}>Genres : </Text>
                        {genres.filter(g => !["animation"].includes(g)).map(g => g.split('-')
                            .map(value => value.charAt(0).toUpperCase() + value.slice(1))
                            .join('-')
                        ).join(', ') || '-'}
                    </Text>

                    <View style={style.flexDirectionRow}>
                        {
                            type.includes('serial') &&
                            <Text style={style.year}>
                                <Text style={style.statement}>Episode : </Text>
                                {homeStackHelpers.getSerialState(latestData, nextEpisode)}
                            </Text>
                        }
                        {
                            partialQuality &&
                            <Text style={[style.year, type.includes('serial') && style.paddingLeft]} numberOfLines={1}>
                                <Text style={style.statement}>Quality : </Text>
                                {partialQuality}
                            </Text>
                        }
                    </View>

                </View>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 1,
        width: '100%',
        backgroundColor: Colors.SECONDARY,
        borderRadius: 10,
        paddingBottom: 15,
        marginBottom: 30,
    },
    video: {
        width: '100%',
        // width: Mixins.WINDOW_WIDTH - 20,
        height: Mixins.WINDOW_WIDTH * (9 / 16),
        minHeight: 200,
        borderRadius: 5,
        marginTop: -5,
        alignSelf: "center",
    },
    videoControls: {
        paddingBottom: 10,
    },
    videoPoster: {
        marginTop: 0,
    },
    infoContainer: {
        paddingTop: 5,
        paddingLeft: 10,
        width: '100%',
        flexShrink: 1,
    },
    title: {
        fontSize: 18,
        color: '#ffffff',
    },
    tagsContainer: {
        flex: 1,
        flexDirection: "row",
        gap: 5,
    },
    rating: {
        position: "relative",
        width: 60,
        height: 29,
        top: 0,
        marginTop: 4,
        left: 0,
    },
    ratingContainer: {
        width: 60,
        height: 29,
        borderRadius: 6,
        gap: 2,
        paddingLeft: 2,
    },
    lineSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.NAVBAR,
        marginTop: 10,
        marginBottom: 6,
        width: '90%',
    },
    year: {
        fontSize: 13,
        color: '#ffffff',
        marginTop: 3
    },
    statement: {
        fontSize: 13,
        color: Colors.SemiCyan,
        marginTop: 2,
        zIndex: 10,
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
    isOnScreenView: PropTypes.bool.isRequired,
    posters: PropTypes.array.isRequired,
    widePoster: PropTypes.object,
    trailers: PropTypes.array.isRequired,
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.object.isRequired,
    follow: PropTypes.bool.isRequired,
    watchList: PropTypes.bool.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    latestData: PropTypes.object.isRequired,
    nextEpisode: PropTypes.object,
}


export default TrailerMovieCard;
