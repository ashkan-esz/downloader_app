import React, {memo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "react-native-elements";
import {CustomImage} from "../../atoms";
import {useNavigation} from "@react-navigation/native";
import {Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const SearchMovieCard = ({extraStyle, posters, title, premiered, type, extraData}) => {
    const navigation = useNavigation();

    const navigateToMovieScreen = () => {
        navigation.navigate('Movie', {
            name: title.slice(0, 25),
            title, type, posters, ...extraData
        })
    }

    const typeColor = {
        color: type.includes('movie') ? 'red' : 'cyan',
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
                <CustomImage
                    extraStyle={style.image}
                    url={posters[0]}
                    onPress={navigateToMovieScreen}
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
    posters: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    premiered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    extraData: PropTypes.object.isRequired,
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.poster === nextProps.poster;
}

export default memo(SearchMovieCard, areEqual);
