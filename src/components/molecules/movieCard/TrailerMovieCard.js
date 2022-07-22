import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {TrailerImageSwitch, SectionMovieCardRating, DoubleTap} from "../../atoms";
import {useNavigation} from "@react-navigation/native";
import {useLikeOrDislike} from "../../../hooks";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const TrailerMovieCard = ({
                              extraStyle,
                              isOnScreenView,
                              posters,
                              trailer,
                              movieId,
                              title,
                              rating,
                              premiered,
                              type,
                              genres,
                              latestData,
                              likesCount,
                              dislikesCount,
                              like,
                              dislike,
                          }) => {

    const navigation = useNavigation();

    const memorizedNavigation = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters,
            rating: (rating.imdb || rating.myAnimeList)
        });
    }, [movieId, title, type, posters, rating]);

    const {
        isLike,
        isDisLike,
        _onLike,
        _onDisLike
    } = useLikeOrDislike(movieId, likesCount, dislikesCount, like, dislike);

    const _handleDoubleTap = useCallback(() => {
        !isLike && _onLike();
    }, [isLike]);

    const partialQuality = homeStackHelpers.getPartialQuality(latestData.quality, 4);

    const typeColor = {
        color: type.includes('movie') ? Colors.RED2 : 'cyan',
    }

    return (
        <View style={[style.container, extraStyle]}>

            <TrailerImageSwitch
                videoStyle={style.video}
                isOnScreenView={isOnScreenView}
                trailer={trailer}
                poster={posters[0]}
                onLongPress={memorizedNavigation}
                like={like}
                dislike={dislike}
                hideLikeIcon={true}
                startFullscreen={false}
            />

            <DoubleTap
                activeOpacity={0.8}
                onTap={memorizedNavigation}
                onDoubleTap={_handleDoubleTap}
                doublePressDelay={180}
            >
                <View style={style.infoContainer}>
                    <Text style={style.title} numberOfLines={1}>
                        Title : {title}
                    </Text>

                    <SectionMovieCardRating
                        likeContainerStyle={style.likeContainer}
                        rating={rating}
                        likesCount={likesCount}
                        dislikesCount={dislikesCount}
                        isLike={isLike}
                        isDisLike={isDisLike}
                        onLike={_onLike}
                        onDisLike={_onDisLike}
                    />

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
                            style={[style.year, typeColor]}> {
                            type.split('_').map(item => item[0].toUpperCase() + item.slice(1)).join(' ')
                        }</Text>
                        </Text>
                    </View>

                    <Text style={style.year} numberOfLines={1}>
                        <Text style={style.statement}>Genres : </Text> {genres.join(', ') || 'unknown'}
                    </Text>

                    <View style={style.flexDirectionRow}>
                        {
                            type.includes('serial') &&
                            <Text style={style.year}>
                                <Text style={style.statement}>Episode
                                    : </Text> {'S' + latestData.season + 'E' + latestData.episode}
                            </Text>
                        }
                        <Text style={[style.year, type.includes('serial') && style.paddingLeft]} numberOfLines={1}>
                            <Text style={style.statement}>Quality : </Text> {partialQuality}
                        </Text>
                    </View>

                </View>
            </DoubleTap>
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
        height: Mixins.WINDOW_WIDTH / 1.6,
        minHeight: 200,
        borderRadius: 5,
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
    likeContainer: {
        paddingTop: 0,
        paddingBottom: 0,
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
    trailer: PropTypes.any.isRequired,
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.object.isRequired,
    likesCount: PropTypes.number.isRequired,
    dislikesCount: PropTypes.number.isRequired,
    like: PropTypes.bool.isRequired,
    dislike: PropTypes.bool.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    latestData: PropTypes.object.isRequired,
}


export default TrailerMovieCard;
