import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-elements";
import {AirbnbRating} from "react-native-ratings";
import LikeIconWithAnimation from "./LikeIconWithAnimation";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const SectionMovieCardRating = ({
                                    extraStyle, likeContainerStyle,
                                    rating,
                                    likesCount, dislikesCount,
                                    isLike, isDisLike,
                                    onLike, onDisLike
                                }) => {

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

            <View style={[style.likeContainer, likeContainerStyle]}>
                <LikeIconWithAnimation
                    extraIconStyle={style.likeIcon}
                    isActive={isLike}
                    iconName={"heart"}
                    outlineIconName={"heart-outline"}
                    onPress={onLike}
                    iconSize={25}
                />
                <Text style={style.likeNumber}>
                    {likesCount} likes
                </Text>

                <LikeIconWithAnimation
                    extraIconStyle={style.likeIcon}
                    isActive={isDisLike}
                    iconName={"md-heart-dislike"}
                    outlineIconName={"md-heart-dislike-outline"}
                    onPress={onDisLike}
                    iconSize={25}
                />
                <Text style={style.likeNumber}>
                    {dislikesCount} dislikes
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
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    likeIcon: {
        marginTop: 3,
        paddingLeft: -3,
    },
    likeNumber: {
        fontSize: Typography.getFontSize(14),
        color: '#ffffff',
        marginTop: 3,
        paddingLeft: 3,
        paddingRight: 6,
    },
});

SectionMovieCardRating.propTypes = {
    extraStyle: PropTypes.object,
    likeContainerStyle: PropTypes.object,
    rating: PropTypes.number.isRequired,
    likesCount: PropTypes.number.isRequired,
    dislikesCount: PropTypes.number.isRequired,
    isLike: PropTypes.bool.isRequired,
    isDisLike: PropTypes.bool.isRequired,
    onLike: PropTypes.func.isRequired,
    onDisLike: PropTypes.func.isRequired,
}


export default SectionMovieCardRating;
