import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-elements";
import {AirbnbRating} from "react-native-ratings";
import {FontAwesome} from "@expo/vector-icons";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const SectionMovieCardRating = ({extraStyle, rating, like}) => {
    return (
        <View style={extraStyle}>
            <View style={style.ratingContainer}>
                <AirbnbRating
                    starStyle={style.ratingStar}
                    defaultRating={rating / 2}
                    size={5}
                    showRating={false}
                    isDisabled={true}
                />

                <Text style={style.separatorSeparator}> | </Text>
                <Text style={style.ratingNumber}>{rating || '?'} </Text>
            </View>

            <View style={style.likeContainer}>
                <FontAwesome
                    name="heart"
                    size={20}
                    color="red"
                    style={style.like}
                />
                <Text style={style.likeNumber}>
                    {like} likes
                </Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 2
    },
    ratingStar: {
        height: 15,
        width: 11
    },
    separatorSeparator: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(14),
        opacity: 0.5
    },
    ratingNumber: {
        fontSize: Typography.getFontSize(16),
        marginLeft: 2,
        color: Colors.RED2,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    like: {
        marginTop: 3,
        paddingLeft: 3
    },
    likeNumber: {
        fontSize: Typography.getFontSize(14),
        color: '#ffffff',
        marginTop: 3,
        paddingLeft: 4
    },
});

SectionMovieCardRating.propTypes = {
    extraStyle: PropTypes.object,
    rating: PropTypes.number.isRequired,
    like: PropTypes.number.isRequired,
}


export default SectionMovieCardRating;
