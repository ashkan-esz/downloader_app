import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {CustomVideo} from "../../atoms";
import {useNavigation} from "@react-navigation/native";
import {Colors, Mixins} from "../../../styles";
import PropTypes from 'prop-types';


const HomeTrailer = ({
                         extraStyle,
                         isOnScreenView,
                         posters,
                         widePoster,
                         trailers,
                         title,
                         genres,
                         type,
                         movieId,
                         rating,
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

    return (
        <View style={[style.container, extraStyle]}>

            <CustomVideo
                extraStyle={style.video}
                isOnScreenView={isOnScreenView}
                trailers={trailers}
                poster={widePoster || posters[0]}
                movieId={movieId}
                follow={follow}
                watchList={watchList}
                width={Mixins.getWindowWidth(68)}
            />

            <Text
                style={style.title}
                numberOfLines={1}
                onPress={_navigateToMovieScreen}
            >
                {/*{title} ({capitalize(type)})*/}
                {title}
            </Text>
            <View style={style.genresContainer}>
                {
                    (genres.length > 0 && genres.filter(g => g !== "animation").slice(0, 3) || ['Unknown']).map((name, index) => {
                        return (
                            <View key={index} style={style.bulletGenresContainer}>
                                <Text style={style.genres}>
                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                </Text>
                                <Text style={style.bullet}>{' \u2022 '}</Text>
                            </View>
                        );
                    })
                }
            </View>
        </View>
    );
};


const style = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 10,
        width: Mixins.getWindowWidth(68),
        height: Mixins.getWindowHeight(20) + 60,
        minHeight: 208,
    },
    video: {
        width: Mixins.getWindowWidth(68),
        height: Mixins.getWindowHeight(20),
        minHeight: 155,
        borderRadius: 10,
        resizeMode: 'stretch',
    },
    title: {
        fontSize: 18,
        color: Colors.TextColor,
        textAlign: 'center',
        marginTop: 5
    },
    genresContainer: {
        flexDirection: 'row',
        justifyContent: "center",
        marginTop: -10,
    },
    bulletGenresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    genres: {
        fontSize: 12,
        textAlign: 'center',
        color: Colors.RED
    },
    bullet: {
        color: Colors.RED,
        fontSize: 30,
        marginLeft: -2,
    }
});

HomeTrailer.propTypes = {
    extraStyle: PropTypes.object,
    isOnScreenView: PropTypes.bool.isRequired,
    posters: PropTypes.array.isRequired,
    widePoster: PropTypes.object,
    trailers: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    type: PropTypes.string,
    movieId: PropTypes.string.isRequired,
    rating: PropTypes.object.isRequired,
    follow: PropTypes.bool.isRequired,
    watchList: PropTypes.bool.isRequired,
};


export default HomeTrailer;

