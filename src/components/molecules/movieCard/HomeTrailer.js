import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-elements";
import {TrailerImageSwitch} from "../../atoms";
import {useNavigation} from "@react-navigation/native";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const HomeTrailer = ({
                         extraStyle,
                         isOnScreenView,
                         posters,
                         trailer,
                         title,
                         genres,
                         type,
                         movieId,
                         rating,
                         likeOrDislike
                     }) => {
    const navigation = useNavigation();

    const _navigateToMovieScreen = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters, rating
        });
    }, [movieId, title, type, posters, rating]);

    return (
        <View style={[style.container, extraStyle]}>

            <TrailerImageSwitch
                videoStyle={style.video}
                isOnScreenView={isOnScreenView}
                trailer={trailer}
                poster={posters[0]}
                onLongPress={_navigateToMovieScreen}
                likeOrDislike={likeOrDislike}
            />

            <Text
                style={style.title}
                numberOfLines={1}
                onPress={_navigateToMovieScreen}
            >
                {title} ({type})
            </Text>
            <View style={style.genresContainer}>
                {
                    (genres.length > 0 && genres.slice(0, 3) || ['Unknown']).map((name, index) => {
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
        fontSize: Typography.getFontSize(18),
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
        alignItems: 'center'
    },
    genres: {
        fontSize: Typography.getFontSize(14),
        textAlign: 'center',
        color: Colors.RED
    },
    bullet: {
        color: Colors.RED,
        fontSize: Typography.getFontSize(30),
    }
});

HomeTrailer.propTypes = {
    extraStyle: PropTypes.object,
    isOnScreenView: PropTypes.bool.isRequired,
    posters: PropTypes.array.isRequired,
    trailer: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    type: PropTypes.string,
    movieId: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    likeOrDislike: PropTypes.string.isRequired,
};


export default HomeTrailer;

