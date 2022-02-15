import React, {memo, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "react-native-elements";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {CustomImage} from "../../atoms";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const SearchMovieCard = ({extraStyle, posters, title, premiered, type, movieId, rating, likeOrDislike}) => {
    const navigation = useNavigation();

    const _navigateToMovieScreen = useCallback(() => {
        navigation.navigate('Movie', {
            name: title.slice(0, 20),
            movieId, title, type, posters, rating
        });
    }, [movieId, title, type, posters, rating]);

    const typeColor = {
        color: type.includes('movie') ? 'red' : 'cyan',
    }

    return (
        <TouchableOpacity
            onPress={_navigateToMovieScreen}
            activeOpacity={1}
        >
            <View style={[style.container, extraStyle]}>
                <CustomImage
                    extraStyle={style.image}
                    url={posters[0]}
                    onPress={_navigateToMovieScreen}
                >
                    {
                        likeOrDislike !== '' && <View style={style.likeContainer}>
                            <Ionicons
                                name={likeOrDislike === 'like' ? 'heart' : 'md-heart-dislike'}
                                size={24}
                                color={"red"}
                            />
                        </View>
                    }
                </CustomImage>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={style.year} numberOfLines={1}>
                    {premiered.split('-')[0]} - <Text style={[style.year, typeColor]}>{
                        type.split('_').map(item => item[0].toUpperCase() + item.slice(1)).join(' ')
                    }</Text>
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
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    likeContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.SECONDARY,
        borderRadius: 8,
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
    },
    title: {
        fontSize: Typography.getFontSize(16),
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
    movieId: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    likeOrDislike: PropTypes.string.isRequired,
}

const areEqual = (prevProps, nextProps) => {
    return prevProps.posters[0] === nextProps.posters[0] &&
        prevProps.likeOrDislike === nextProps.likeOrDislike;
}

export default memo(SearchMovieCard, areEqual);
