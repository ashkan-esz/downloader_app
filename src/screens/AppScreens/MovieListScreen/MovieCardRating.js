import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {Image} from 'expo-image';
import {Colors, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const MovieCardRating = ({extraStyle, ratingContainerStyle, rating}) => {

    const MemoImdbIcon = memo(() => <Image
        source={require('../../../assets/icons/imdb_round.png')}
        style={style.ratingIcon}
    />);
    const MemoMalIcon = memo(() => <Image
        source={require('../../../assets/icons/mal_round.png')}
        style={style.ratingIcon}
    />);

    return (
        <View style={[style.container, extraStyle]}>
            {
                !!rating.imdb && <View style={[style.ratingContainer, ratingContainerStyle]}>
                    <MemoImdbIcon/>
                    <Text style={style.rating}>{rating.imdb.toFixed(1)}</Text>
                </View>
            }
            {
                !!rating.myAnimeList &&
                <View style={[style.ratingContainer, ratingContainerStyle, rating.imdb && style.secondRating]}>
                    <MemoMalIcon/>
                    <Text style={style.rating}>{rating.myAnimeList.toFixed(1)}</Text>
                </View>
            }
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        position: "absolute",
        top: 11,
        left: 11,
    },
    ratingContainer: {
        backgroundColor: Colors.BLACK,
        position: "absolute",
        flexDirection: "row",
        borderRadius: 8,
        alignItems: "center",
        height: 20,
    },
    secondRating: {
        marginLeft: 45,
    },
    ratingIcon: {
        width: 16,
        height: 16,
        alignSelf: 'center',
        borderRadius: 16,
        marginLeft: 3,
    },
    rating: {
        fontSize: Typography.getFontSize(12),
        color: "#fff",
        marginLeft: 3,
        marginRight: 5,
    },
});

MovieCardRating.propTypes = {
    extraStyle: PropTypes.object,
    ratingContainerStyle: PropTypes.object,
    rating: PropTypes.object.isRequired,
}


export default MovieCardRating;
