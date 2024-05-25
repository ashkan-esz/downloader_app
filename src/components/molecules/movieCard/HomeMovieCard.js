import React, {memo, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {CustomImage} from "../../atoms";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';
import {Image} from "expo-image";


const HomeMovieCard = ({
                           extraStyle,
                           posters,
                           movieId,
                           title,
                           type,
                           latestData,
                           nextEpisode,
                           rating,
                           noRating,
                           follow,
                       }) => {
    const navigation = useNavigation();

    const _navigateToMovieScreen = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters, rating,
        });
    }, [movieId, title, type, posters, rating]);

    const MemoImdbIcon = memo(() => <Image
        source={require('../../../assets/icons/imdb_round.png')}
        style={style.ratingIcon}
    />);
    const MemoMalIcon = memo(() => <Image
        source={require('../../../assets/icons/mal_round.png')}
        style={style.ratingIcon}
    />);

    return (
        <TouchableOpacity
            onPress={_navigateToMovieScreen}
            activeOpacity={1}
        >
            <View style={[style.container, extraStyle]}>

                <CustomImage
                    extraStyle={style.image}
                    posters={posters}
                    onPress={_navigateToMovieScreen}
                    resizeModeStretch={true}
                    movieId={movieId}
                />

                {
                    follow && <View style={style.likeContainer}>

                        <Ionicons
                            name={'bookmark'}
                            size={22}
                            color={Colors.BOOKMARK_ICON}
                        />
                    </View>
                }

                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>

                {
                    latestData && <Text style={style.latestData} numberOfLines={1}>
                        {type.includes('serial')
                            ? homeStackHelpers.getSerialState(latestData, nextEpisode)
                            : homeStackHelpers.getPartialQuality(latestData.quality, 2)}
                    </Text>
                }
                {
                    !noRating && (!!rating.imdb || !!rating.myAnimeList) && <View style={style.ratingContainer}>
                        {rating.imdb ? <MemoImdbIcon/> : <MemoMalIcon/>}
                        <Text style={style.rating}>{(rating.imdb || rating.myAnimeList).toFixed(1)}</Text>
                    </View>
                }

            </View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: "flex-start",
        width: Mixins.getWindowWidth(31),
    },
    image: {
        width: Mixins.getWindowWidth(31),
        height: Mixins.getWindowHeight(25),
        minHeight: 190,
        borderRadius: 5,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    likeContainer: {
        backgroundColor: Colors.SECONDARY,
        borderRadius: 5,
        paddingLeft: 3,
        paddingRight: 1,
        paddingTop: 3,
        paddingBottom: 5,
        position: 'absolute',
        top: 0,
        right: -1,
    },
    bookmarkIcon: {
        marginBottom: 10,
    },
    title: {
        fontSize: Typography.getFontSize(18),
        color: Colors.TextColor,
        textAlign: 'center',
        marginTop: 3,
        marginBottom: 2
    },
    latestData: {
        color: Colors.TextColor,
        textAlign: 'center',
        fontSize: Typography.getFontSize(14),
        marginTop: -2,
        marginBottom: 0,
    },
    ratingContainer: {
        backgroundColor: Colors.BLACK,
        position: "absolute",
        top: 2,
        left: 2,
        flexDirection: "row",
        borderRadius: 8,
        alignItems: "center",
        height: 20,
    },
    ratingIcon: {
        width: 16,
        height: 16,
        alignSelf: 'center',
        borderRadius: 16,
        marginLeft: 3,
    },
    rating: {
        fontSize: Typography.getFontSize(12),
        color: "#fff",
        marginLeft: 3,
        marginRight: 5,
    },
});

HomeMovieCard.propTypes = {
    extraStyle: PropTypes.object,
    posters: PropTypes.array.isRequired,
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    latestData: PropTypes.object,
    nextEpisode: PropTypes.any,
    rating: PropTypes.object.isRequired,
    noRating: PropTypes.bool,
    follow: PropTypes.bool.isRequired,
}


export default HomeMovieCard;
