import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Divider, Text} from "@rneui/themed";
import {CustomImage, FullScreenImageView, DoubleTap, LikeIconWithAnimation} from "../atoms";
import MovieTopPosterCarousel from "./MovieTopPosterCarousel";
import {BlurView} from 'expo-blur';
import {Mixins, Typography} from "../../styles";
import PropTypes from 'prop-types';

//todo : swipe to see other posters

const MovieTopPoster = ({
                            title,
                            episodesDuration,
                            poster,
                            rating,
                            genres,
                            posters,
                            widePoster,
                            isLike,
                            onDoubleTap
                        }) => {
    const [overlay, setOverlay] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);

    const titleSize = {
        fontSize: title.length < 20
            ? Typography.getFontSize(30)
            : title.length < 30
                ? Typography.getFontSize(28)
                : Typography.getFontSize(24),
    }

    const _handleDoubleTap = () => {
        !isLike && onDoubleTap();
        setLikeAnimation(prevState => !prevState);
    }

    return (
        <View>
            <CustomImage
                extraStyle={style.image}
                posters={posters.length > 0 ? posters : [poster]}
                resizeModeStretch={true}
            />

            <LikeIconWithAnimation
                extraStyle={style.likeIcon}
                isActive={likeAnimation}
                iconName={"heart"}
                outlineIconName={"heart-outline"}
                activeIconOnly={true}
                activeAnimationOnly={true}
                autoHideLike={true}
                iconSize={70}
            />

            <MovieTopPosterCarousel
                posters={posters.length > 0 ? posters : [poster]}
            />

            <FullScreenImageView
                overlay={overlay}
                setOverlay={setOverlay}
                poster={poster}
            />

            <DoubleTap
                extraStyle={style.doubleTap}
                activeOpacity={0.9}
                onTap={() => setOverlay(true)}
                onDoubleTap={_handleDoubleTap}
            >
                <View style={style.leftSideContainer}>

                    <BlurView
                        style={style.blurView}
                        tint={'dark'}
                        intensity={50}
                    >
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
                    </BlurView>
                </View>
            </DoubleTap>

            <Text style={style.rating}>
                <Text style={style.ratingNumber}>{rating}</Text> /10
            </Text>
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
    likeIcon: {
        // paddingTop: -10,
        position: 'absolute',
    },
    doubleTap: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    leftSideContainer: {
        position: 'absolute',
        width: '100%',
        bottom: '13%',
        zIndex: 3,
    },
    blurView: {
        height: '100%',
        width: '100%',
        zIndex: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },
    title: {
        color: '#ffffff',
        paddingLeft: 10,
        zIndex: 3,
        paddingTop: 3,
    },
    episodesDuration: {
        fontSize: Typography.getFontSize(16),
        color: '#ffffff',
        paddingLeft: 15,
        zIndex: 3,
    },
    genresRowContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 13,
        flexWrap: 'wrap',
        width: '100%',
        zIndex: 3,
        paddingBottom: 10,
    },
    genreContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginRight: 10,
        zIndex: 3,
    },
    genre: {
        fontSize: Typography.getFontSize(16),
        color: '#fff',
        zIndex: 3,
    },
    genresUnderLine: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'red',
        width: '80%',
        height: 3,
        marginTop: 3,
        zIndex: 3,
    },
    rating: {
        position: 'absolute',
        fontSize: Typography.getFontSize(20),
        color: '#ffffff',
        bottom: 5,
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
    widePoster: PropTypes.object,
    isLike: PropTypes.bool.isRequired,
    onDoubleTap: PropTypes.func.isRequired,
}


export default MovieTopPoster;
