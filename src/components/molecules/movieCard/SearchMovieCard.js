import React, {memo} from 'react';
import {View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Image, Text} from "react-native-elements";
import {useNavigation} from "@react-navigation/native";
import {Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const SearchMovieCard = ({extraStyle, poster, title, premiered, type, extraData}) => {
    const navigation = useNavigation();

    const navigateToMovieScreen = () => {
        navigation.navigate('Movie', {
            name: title.slice(0, 25),
            title, type, poster, ...extraData
        })
    }

    const typeColor = {
        color: type === 'movie' ? 'red' : 'cyan',
    }
    const titleFontSize = {
        fontSize: ((title.length - 4) * Typography.getFontSize(16) < Mixins.getWindowWidth(28))
            ? Typography.getFontSize(18)
            : Typography.getFontSize(16)
    }

    return (
        <TouchableOpacity
            onPress={navigateToMovieScreen}
            activeOpacity={1}
        >
            <View style={[style.container, extraStyle]}>
                <Image
                    style={style.image}
                    source={poster ? {uri: poster} : null}
                    PlaceholderContent={<ActivityIndicator size={'large'} color={'blue'}/>}
                    testID={'movie-card'}
                />
                <Text style={[style.title, titleFontSize]} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={style.year}>
                    {premiered.split('-')[0]} - <Text style={[style.year, typeColor]}>{type}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginBottom: 20,
        width: Mixins.getWindowWidth(28),
    },
    image: {
        width: '100%',
        height: Mixins.getWindowHeight(24),
        borderRadius: 10,
    },
    title: {
        fontSize: Typography.getFontSize(18),
        color: '#ffffff',
        paddingLeft: 5,
    },
    year: {
        fontSize: Typography.getFontSize(14),
        color: '#ffffff',
        paddingLeft: 5,
    }
});

SearchMovieCard.propTypes = {
    extraStyle: PropTypes.object,
    poster: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    extraData: PropTypes.object.isRequired,
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.poster === nextProps.poster;
}

export default memo(SearchMovieCard, areEqual);
