import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {homeStackHelpers} from "../../../../helper";
import {Colors} from "../../../../styles";
import PropTypes from 'prop-types';
import {CustomImage} from "../../../../components/atoms";
import {getWindowWidth} from "../../../../styles/mixins";
import {BlurView} from "expo-blur";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const SwiperCard = ({
                        extraStyle,
                        posters,
                        widePoster,
                        movieId,
                        title,
                        type,
                        year,
                        latestData,
                        nextEpisode,
                        rating,
                        follow,
                        watchList,
                    }) => {
    const navigation = useNavigation();

    const _navigateToMovieScreen = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters, rating
        });
    }, [movieId, title, type, posters, rating]);

    return (
        <TouchableOpacity
            onPress={_navigateToMovieScreen}
            activeOpacity={1}
        >
            <View style={[style.container, extraStyle]}>

                <CustomImage
                    extraStyle={style.image}
                    posters={widePoster ? [widePoster] : posters}
                    onPress={_navigateToMovieScreen}
                    resizeModeStretch={true}
                    movieId={movieId}
                />

                {
                    follow && <View style={style.likeContainer}>
                        <MaterialCommunityIcons
                            name={"book-play"}
                            size={22}
                            color={Colors.FOLLOW_ICON}
                        />
                    </View>
                }
                {
                    watchList && <View style={style.likeContainer}>
                        <Ionicons
                            name={'bookmark'}
                            size={22}
                            color={Colors.BLUE_LIGHT}
                        />
                    </View>
                }

                <View style={style.blurViewContainer}>
                    <BlurView
                        style={style.blurView}
                        // tint={'dark'}
                        tint={'systemChromeMaterialDark'}
                        intensity={40}
                        experimentalBlurMethod={"dimezisBlurView"}
                    >
                        <Text style={style.title} numberOfLines={1}>
                            {title}
                        </Text>
                        <Text style={[style.title, style.year]} numberOfLines={1}>
                            {year}
                        </Text>
                    </BlurView>
                </View>

                {latestData && <Text style={style.latestData} numberOfLines={1}>
                    {type.includes('serial')
                        ? homeStackHelpers.getSerialState(latestData, nextEpisode, true)
                        : homeStackHelpers.getPartialQuality(latestData.quality, 2)}
                </Text>}
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
        width: Math.min(getWindowWidth(60), 400),
    },
    image: {
        width: Math.min(getWindowWidth(60), 400),
        height: 140,
        minHeight: 190,
        borderRadius: 5,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    likeContainer: {
        backgroundColor: Colors.SECONDARY,
        borderRadius: 8,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 6,
        position: 'absolute',
        top: 1,
        right: 3,
    },
    blurViewContainer: {
        position: 'absolute',
        width: '100%',
        height: 105,
        bottom: 0,
        zIndex: 2,
    },
    blurView: {
        width: '100%',
        height: 70,
        zIndex: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },
    title: {
        fontSize: 24,
        color: "#fff",
        textAlign: 'left',
        marginTop: 3,
        marginBottom: 2,
        position: "absolute",
        bottom: 40,
        left: 10,
        zIndex: 6,
        paddingRight: 3,
    },
    year: {
        bottom: 15,
    },
    latestData: {
        // color: Colors.THIRD,
        color: Colors.LIGHT,
        textAlign: 'left',
        fontSize: 18,
        position: "absolute",
        top: 2,
        left: 10,
    }
});

SwiperCard.propTypes = {
    extraStyle: PropTypes.object,
    posters: PropTypes.array.isRequired,
    widePoster: PropTypes.object,
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    year: PropTypes.string,
    latestData: PropTypes.object,
    nextEpisode: PropTypes.any,
    rating: PropTypes.object.isRequired,
    follow: PropTypes.bool.isRequired,
    watchList: PropTypes.bool.isRequired,
}


export default SwiperCard;
