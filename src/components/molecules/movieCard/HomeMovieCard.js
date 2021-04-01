import React, {memo} from 'react';
import {View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Image, Text} from "react-native-elements";
import {useNavigation} from "@react-navigation/native";
import {CustomRating} from "../../atoms";
import {getPartialQuality, getSerialState} from "../../../utils";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const HomeMovieCard = ({extraStyle, poster, id, title, type, tab, latestData, nextEpisode, rating, noRating}) => {
    const navigation = useNavigation();

    const navigateToMovieScreen = () => {
        navigation.navigate('Movie', {
            name: title.slice(0, 25),
            id, title, type, poster, rating
        })
    }

    const imageBorder = {
        borderWidth: type === 'serial' ? 0.5 : null,
        borderColor: type === 'serial' ? 'cyan' : null,
    }
    const latestDataFontSize = {
        fontSize: tab !== 'todaySeries'
            ? Typography.getFontSize(16)
            : Typography.getFontSize(14),
        marginTop: tab !== 'todaySeries' ? -2 : -1,
        marginBottom: tab !== 'todaySeries' ? 0 : 1
    }

    return (
        <TouchableOpacity
            onPress={navigateToMovieScreen}
            activeOpacity={1}
        >
            <View style={[style.container, extraStyle]}>
                <Image
                    style={[style.image, imageBorder]}
                    source={poster ? {uri: poster} : null}
                    PlaceholderContent={<ActivityIndicator size={'large'} color={'blue'}/>}
                    testID={'movie-card'}
                />
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                {latestData && <Text style={[style.latestData, latestDataFontSize]} numberOfLines={1}>
                    {type === 'serial'
                        ? getSerialState(latestData, nextEpisode, tab)
                        : getPartialQuality(latestData.quality, 2)}
                </Text>}
                {!noRating && <CustomRating rating={rating}/>}
            </View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: Mixins.getWindowWidth(31),
    },
    image: {
        width: Mixins.getWindowWidth(31),
        height: Mixins.getWindowHeight(25),
        minHeight: 190,
        borderRadius: 5,
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
    }
});

HomeMovieCard.propTypes = {
    extraStyle: PropTypes.object,
    poster: PropTypes.any.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    tab: PropTypes.string,
    latestData: PropTypes.object,
    nextEpisode: PropTypes.any,
    rating: PropTypes.number.isRequired,
    noRating: PropTypes.bool,
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.poster === nextProps.poster;
}

export default memo(HomeMovieCard, areEqual);
