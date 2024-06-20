import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {CustomImage} from "../../../components/atoms";
import MovieCardRating from "./MovieCardRating";
import MovieCardFollow from "./MovieCardFollow";
import {useNavigation} from "@react-navigation/native";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins} from "../../../styles";
import PropTypes from 'prop-types';


const MovieCard = ({
                       extraStyle,
                       posters,
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

    const _navigateToMovieScreen = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters, rating,
        });
    }, [movieId, title, type, posters, rating]);

    const serialState = homeStackHelpers.getSerialState(latestData, nextEpisode);
    const partialQuality = homeStackHelpers.getPartialQuality(latestData.quality, 3);

    // const imageBorder = {
    //     borderWidth: 0.5,
    //     borderColor: type.includes('movie') ? Colors.RED : 'cyan',
    // }

    return (
        <TouchableOpacity
            style={[style.container, extraStyle]}
            onPress={_navigateToMovieScreen}
            activeOpacity={0.8}
        >
            <CustomImage
                // extraStyle={[style.image, imageBorder]}
                extraStyle={style.image}
                posters={posters}
                // onPress={_navigateToMovieScreen}
                movieId={movieId}
            />
            <MovieCardRating rating={rating}/>

            <View style={style.infoContainer}>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                <MovieCardFollow
                    type={type}
                    isFollow={follow}
                    isWatchList={watchList}
                />

                <View style={style.lineSeparator}/>


                <Text style={style.year}>
                    <Text style={style.statement}>Year : </Text>{premiered.split('-')[0]}
                </Text>

                <Text style={style.year} numberOfLines={1}>
                    <Text style={style.statement}>Genres : </Text>
                    {genres.filter(g => !["animation"].includes(g)).map(g => g.split('-')
                        .map(value => value.charAt(0).toUpperCase() + value.slice(1))
                        .join('-')
                    ).join(', ') || '-'}
                </Text>
                {
                    type.includes('serial') &&
                    <Text style={style.year}>
                        <Text style={style.statement}>Episode : </Text>{serialState}
                    </Text>
                }

                {/*<Text style={style.year} numberOfLines={1}>*/}
                {/*    <Text style={style.statement}>Quality :</Text> {partialQuality}*/}
                {/*</Text>*/}

            </View>

            {
                partialQuality && <Text style={style.quality} numberOfLines={1}>
                    {partialQuality}
                </Text>
            }

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
        borderRadius: 10,
        paddingRight: 5,
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
        fontSize: 20,
        color: '#fff',
    },
    lineSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.NAVBAR,
        marginTop: 10,
        marginBottom: 6,
        width: '90%'
    },
    year: {
        fontSize: 14,
        color: '#fff',
        marginTop: 2
    },
    statement: {
        fontSize: 14,
        color: Colors.SemiCyan,
        marginTop: 2,
    },
    quality: {
        fontSize: 14,
        color: '#fff',
        marginTop: 2,
        position: "absolute",
        bottom: -7,
        left: 12,
        // backgroundColor: "green",
        backgroundColor: "#218380",
        // backgroundColor: "#35605A",
        // backgroundColor: "#558C8C",
        borderRadius: 4,
        paddingLeft: 5,
        paddingRight: 5,
        maxWidth: Mixins.getWindowWidth(37) - 5,
    }
});

MovieCard.propTypes = {
    extraStyle: PropTypes.object,
    posters: PropTypes.array.isRequired,
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

export default MovieCard;
