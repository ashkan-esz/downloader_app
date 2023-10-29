import React, {memo, useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import DropShadow from "react-native-drop-shadow";
import {SectionMovieCardRating, CustomImage, LikeIconWithAnimation, DoubleTap} from "../../atoms";
import {useNavigation} from "@react-navigation/native";
import {homeStackHelpers} from "../../../helper";
import {useLikeOrDislike, useFollow} from "../../../hooks";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const SectionMovieCard = ({
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
                              likesCount,
                              dislikesCount,
                              followsCount,
                              like,
                              dislike,
                              follow,
                          }) => {

    const navigation = useNavigation();

    const _navigateToMovieScreen = useCallback(() => {
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

    const {
        isFollowed,
        _onFollow,
    } = useFollow(movieId, followsCount, follow);

    const [likeAnimation, setLikeAnimation] = useState(false);
    const _handleDoubleTap = () => {
        !isLike && _onLike();
        setLikeAnimation(prevState => !prevState);
    }

    const serialState = homeStackHelpers.getSerialState(latestData, nextEpisode, tab);
    const partialQuality = homeStackHelpers.getPartialQuality(latestData.quality, 3);

    const typeColor = {
        color: type.includes('movie') ? 'red' : 'cyan',
    }

    //todo : remove shadow to make it lighter

    return (
        <DoubleTap
            extraStyle={[style.container, extraStyle]}
            activeOpacity={0.8}
            onTap={_navigateToMovieScreen}
            onDoubleTap={_handleDoubleTap}
            doublePressDelay={180}
        >

            <CustomImage
                extraStyle={[style.image, style.imageShadow]}
                url={posters[0]}
                onPress={_navigateToMovieScreen}
            >
                <LikeIconWithAnimation
                    extraStyle={style.likeIcon}
                    isActive={likeAnimation}
                    iconName={"heart"}
                    outlineIconName={"heart-outline"}
                    activeIconOnly={true}
                    activeAnimationOnly={true}
                    autoHideLike={true}
                    iconSize={70}
                    onPress={_navigateToMovieScreen}
                    disableOnPressActivation={true}
                />
            </CustomImage>

            <View style={style.infoContainer}>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                <SectionMovieCardRating
                    rating={rating}
                    likesCount={likesCount}
                    dislikesCount={dislikesCount}
                    followsCount={followsCount}
                    isLike={isLike}
                    isDisLike={isDisLike}
                    isFollow={isFollowed}
                    onLike={_onLike}
                    onDisLike={_onDisLike}
                    onFollow={_onFollow}
                />
                <View style={style.lineSeparator}/>


                <Text style={style.year}>
                    <Text style={style.statement}>Year : </Text>{premiered.split('-')[0]}
                </Text>
                <Text style={style.year}>
                    <Text style={style.statement}>Type : </Text><Text
                    style={[style.year, typeColor]}> {
                    type.split('_').map(item => item[0].toUpperCase() + item.slice(1)).join(' ')
                }</Text>
                </Text>

                <Text style={style.year} numberOfLines={1}>
                    <Text style={style.statement}>Genres : </Text>{genres.join(' ,') || 'unknown'}
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
        </DoubleTap>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: Mixins.getWindowHeight(33) < 240 ? 27 : 0,
        width: '100%',
        height: Mixins.getWindowHeight(33),
        maxHeight: 255,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 10
    },
    imageShadow: {
        shadowColor: Colors.GRAY_MEDIUM,
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        zIndex: 10,
        marginTop: 10,
        marginLeft: 10,
    },
    image: {
        width: Mixins.getWindowWidth(37),
        height: Mixins.getWindowHeight(33) + 8,
        maxHeight: 250,
        borderRadius: 8,
    },
    likeIcon: {
        paddingBottom: 10,
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

SectionMovieCard.propTypes = {
    extraStyle: PropTypes.object,
    tab: PropTypes.string.isRequired,
    posters: PropTypes.array.isRequired,
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.object.isRequired,
    likesCount: PropTypes.number.isRequired,
    dislikesCount: PropTypes.number.isRequired,
    followsCount: PropTypes.number.isRequired,
    like: PropTypes.bool.isRequired,
    dislike: PropTypes.bool.isRequired,
    follow: PropTypes.bool.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    latestData: PropTypes.object.isRequired,
    nextEpisode: PropTypes.object,
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.posters[0] && nextProps.posters[0] &&
        prevProps.posters[0].url === nextProps.posters[0].url &&
        prevProps.likesCount === nextProps.likesCount &&
        prevProps.dislikesCount === nextProps.dislikesCount &&
        prevProps.followsCount === nextProps.followsCount &&
        prevProps.like === nextProps.like &&
        prevProps.dislike === nextProps.dislike &&
        prevProps.follow === nextProps.follow;
}

export default memo(SectionMovieCard, areEqual);
