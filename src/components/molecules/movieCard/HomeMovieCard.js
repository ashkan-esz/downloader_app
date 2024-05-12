import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {CustomRating, CustomImage} from "../../atoms";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const HomeMovieCard = ({
                           extraStyle,
                           posters,
                           movieId,
                           title,
                           type,
                           tab,
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
                {latestData && <Text style={style.latestData} numberOfLines={1}>
                    {type.includes('serial')
                        ? homeStackHelpers.getSerialState(latestData, nextEpisode, tab)
                        : homeStackHelpers.getPartialQuality(latestData.quality, 2)}
                </Text>}
                {!noRating && <CustomRating rating={rating}/>}
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
        borderRadius: 8,
        paddingLeft: 3,
        paddingRight: 2,
        paddingTop: 3,
        paddingBottom: 5,
        position: 'absolute',
        top: 0,
        right: 0,
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
    }
});

HomeMovieCard.propTypes = {
    extraStyle: PropTypes.object,
    posters: PropTypes.array.isRequired,
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    tab: PropTypes.string,
    latestData: PropTypes.object,
    nextEpisode: PropTypes.any,
    rating: PropTypes.number.isRequired,
    noRating: PropTypes.bool,
    follow: PropTypes.bool.isRequired,
}


export default HomeMovieCard;
