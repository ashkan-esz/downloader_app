import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Text} from "react-native-elements";
import {CustomImage, FullScreenImageView} from "../atoms";
import MovieTopPosterCarousel from "./MovieTopPosterCarousel";
import {BlurView} from 'expo-blur';
import {Mixins, Typography} from "../../styles";
import PropTypes from 'prop-types';

//todo : swipe to see other posters

const MovieTopPoster = ({title, episodesDuration, poster, rating, genres, posters}) => {
    const [overlay, setOverlay] = useState(false);

    const titleSize = {
        fontSize: title.length < 20
            ? Typography.getFontSize(30)
            : Typography.getFontSize(28)
    }

    return (
        <View>
            <View>
                <CustomImage
                    extraStyle={style.image}
                    url={poster}
                    resizeModeStretch={true}
                />

                <MovieTopPosterCarousel
                    posters={posters.length > 0 ? posters : [poster]}
                />

                <FullScreenImageView
                    overlay={overlay}
                    setOverlay={setOverlay}
                    poster={poster}
                />

                <TouchableOpacity
                    style={style.blurView}
                    activeOpacity={1}
                    onPress={() => setOverlay(true)}
                >
                    <BlurView
                        style={style.blurView}
                        tint={'dark'}
                        intensity={45}
                    />


                    <View style={style.leftSideContainer}>

                        <Text style={[style.title, titleSize]}>
                            {title}
                        </Text>
                        <Text style={style.episodesDuration}>
                            {episodesDuration}
                        </Text>

                        <View style={style.genresRowContainer}>
                            {
                                (genres.length > 0 ? genres : ['unknown']).map(item => (
                                    <View style={style.genreContainer} key={item}>
                                        <Text style={style.genre}>
                                            {item.trim()}
                                        </Text>
                                        <Divider style={style.genresUnderLine}/>
                                    </View>
                                ))
                            }
                        </View>
                    </View>

                </TouchableOpacity>

                <Text style={style.rating}>
                    <Text style={style.ratingNumber}>{rating}</Text> /10
                </Text>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
    },
    image: {
        width: '100%',
        height: Mixins.getWindowHeight(55),
    },
    blurView: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 2,
    },
    leftSideContainer: {
        position: 'absolute',
        width: '100%',
        bottom: '11%',
        paddingLeft: 10,
        zIndex: 3,
    },
    title: {
        color: '#ffffff',
    },
    episodesDuration: {
        fontSize: Typography.getFontSize(16),
        color: '#ffffff',
        paddingLeft: 5,
    },
    genresRowContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 3,
        flexWrap: 'wrap',
        width: '68%',
    },
    genreContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginRight: 10,
    },
    genre: {
        fontSize: Typography.getFontSize(16),
        color: '#fff',
    },
    genresUnderLine: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'red',
        width: '80%',
        height: 3,
        marginTop: 3,
    },
    rating: {
        position: 'absolute',
        fontSize: Typography.getFontSize(20),
        color: '#ffffff',
        bottom: 10,
        right: 15,
        zIndex: 3,
    },
    ratingNumber: {
        fontSize: Typography.getFontSize(48),
        color: 'red',
    },
});

MovieTopPoster.propTypes = {
    title: PropTypes.string.isRequired,
    episodesDuration: PropTypes.string.isRequired,
    poster: PropTypes.object,
    rating: PropTypes.number.isRequired,
    genres: PropTypes.array.isRequired,
    posters: PropTypes.array.isRequired,
}


export default MovieTopPoster;
