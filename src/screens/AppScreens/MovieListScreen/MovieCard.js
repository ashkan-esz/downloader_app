import React, {memo, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {CustomImage} from "../../../components/atoms";
import MovieCardRating from "./MovieCardRating";
import MovieCardFollow from "./MovieCardFollow";
import {useNavigation} from "@react-navigation/native";
import {homeStackHelpers} from "../../../helper";
import {useFollow, useWatchList} from "../../../hooks";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const MovieCard = ({
                              extraStyle,
                              tab,
                              posters,
                              movieId,
                              title,
                              rating,
                              premiered,
                              type,
                              genres,
                              latestData,
                              nextEpisode,
                              followsCount,
                              watchListCount,
                              follow,
                              watchList,
                          }) => {

    // todo : better cards

    const navigation = useNavigation();

    const _navigateToMovieScreen = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters, rating,
        });
    }, [movieId, title, type, posters, rating]);

    const {
        // isFollowLoading,
        _onFollow,
    } = useFollow(movieId, followsCount, follow, watchListCount, watchList);

    const {
        // isWatchListLoading,
        _onWatchList,
    } = useWatchList(movieId, watchListCount, watchList);

    const serialState = homeStackHelpers.getSerialState(latestData, nextEpisode);
    const partialQuality = homeStackHelpers.getPartialQuality(latestData.quality, 3);

    const typeColor = {
        color: type.includes('movie') ? 'red' : 'cyan',
    }
    const imageBorder = {
        borderWidth: 0.5,
        borderColor: type.includes('movie') ? 'red' : 'cyan',
    }

    return (
        <TouchableOpacity
            style={[style.container, extraStyle]}
            onPress={_navigateToMovieScreen}
            activeOpacity={0.8}
        >
            <CustomImage
                extraStyle={[style.image, imageBorder]}
                posters={posters}
                onPress={_navigateToMovieScreen}
                movieId={movieId}
            />
            <MovieCardRating rating={rating}/>

            <View style={style.infoContainer}>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                    <MovieCardFollow
                        type={type}
                        followsCount={followsCount}
                        watchListCount={watchListCount}
                        isFollow={follow}
                        isWatchList={watchList}
                        onFollow={_onFollow}
                        onWatchList={_onWatchList}
                    />
                </Text>

                <View style={style.lineSeparator}/>


                <Text style={style.year}>
                    <Text style={style.statement}>Year : </Text>{premiered.split('-')[0]}
                </Text>
                {/*<Text style={style.year}>*/}
                {/*    <Text style={style.statement}>Type : </Text><Text*/}
                {/*    style={[style.year, typeColor]}> {*/}
                {/*    type.split('_').map(item => item[0].toUpperCase() + item.slice(1)).join(' ')*/}
                {/*}</Text>*/}
                {/*</Text>*/}

                <Text style={style.year} numberOfLines={1}>
                    <Text style={style.statement}>Genres : </Text>{genres.join(', ') || '-'}
                </Text>
                {
                    type.includes('serial') &&
                    <Text style={style.year}>
                        <Text style={style.statement}>Episode : </Text>{serialState}
                    </Text>
                }

                <Text style={style.year} numberOfLines={1}>
                    <Text style={style.statement}>Quality :</Text> {partialQuality}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 265 - Math.min(Mixins.getWindowHeight(33), 255),
        width: '100%',
        height: Mixins.getWindowHeight(33),
        maxHeight: 255,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 10
    },
    image: {
        width: Mixins.getWindowWidth(37),
        height: Math.min(Mixins.getWindowHeight(33), 255),
        maxHeight: 255,
        borderRadius: 8,
        zIndex: 10,
        marginTop: 10,
        marginLeft: 10,
    },
    infoContainer: {
        paddingTop: 5,
        paddingLeft: 10,
        width: '100%',
        flexShrink: 1
    },
    title: {
        fontSize: Typography.getFontSize(18),
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

MovieCard.propTypes = {
    extraStyle: PropTypes.object,
    tab: PropTypes.string.isRequired,
    posters: PropTypes.array.isRequired,
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.object.isRequired,
    followsCount: PropTypes.number.isRequired,
    watchListCount: PropTypes.number.isRequired,
    follow: PropTypes.bool.isRequired,
    watchList: PropTypes.bool.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    latestData: PropTypes.object.isRequired,
    nextEpisode: PropTypes.object,
}

const areEqual = (prevProps, nextProps) => {
    // todo : check
    return prevProps.posters[0] && nextProps.posters[0] &&
        prevProps.posters[0].url === nextProps.posters[0].url &&
        prevProps.followsCount === nextProps.followsCount &&
        prevProps.watchListCount === nextProps.watchListCount &&
        prevProps.follow === nextProps.follow &&
        prevProps.watchList === nextProps.watchList;
}

export default memo(MovieCard, areEqual);
