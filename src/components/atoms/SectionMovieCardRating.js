import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {Image} from 'expo-image';
import IconWithTransition from "./IconWithTransition";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const SectionMovieCardRating = ({
                                    extraStyle, likeContainerStyle,
                                    rating,
                                    likesCount, dislikesCount, followsCount,
                                    isLike, isDisLike, isFollow,
                                    onLike, onDisLike, onFollow,
                                }) => {

    const MemoImdbIcon = memo(() => <Image
        source={require('../../assets/icons/imdb.png')}
        style={style.icon}
    />);
    const MemoMalIcon = memo(() => <Image
        source={require('../../assets/icons/mal.png')}
        style={style.icon}
    />);

    return (
        <View style={extraStyle}>
            <View style={style.ratingContainer}>
                <MemoImdbIcon/>
                <Text style={style.separator}> | </Text>
                <Text style={style.ratingNumber}>{rating.imdb || '?'} </Text>
                <MemoMalIcon/>
                <Text style={style.separator}> | </Text>
                <Text style={style.ratingNumber}>{rating.myAnimeList || '?'} </Text>
            </View>

            <View style={[style.likeContainer, likeContainerStyle]}>
                <IconWithTransition
                    extraIconStyle={style.likeIcon}
                    isActive={isLike}
                    iconName={"heart"}
                    outlineIconName={"heart-outline"}
                    onPress={onLike}
                    iconSize={25}
                    firstViewAnimation={false}
                />
                <Text style={style.likeNumber}>
                    {likesCount}
                </Text>

                <IconWithTransition
                    extraIconStyle={style.likeIcon}
                    isActive={isDisLike}
                    iconName={"heart-dislike"}
                    outlineIconName={"heart-dislike-outline"}
                    onPress={onDisLike}
                    iconSize={25}
                    firstViewAnimation={false}
                />
                <Text style={style.likeNumber}>
                    {dislikesCount}
                </Text>

                <IconWithTransition
                    extraIconStyle={style.likeIcon}
                    isActive={isFollow}
                    iconName={"bookmark"}
                    outlineIconName={"bookmark-outline"}
                    iconColor={"grey"}
                    activeIconColor={Colors.BOOKMARK_ICON}
                    onPress={onFollow}
                    iconSize={25}
                    firstViewAnimation={false}
                />
                <Text style={style.likeNumber}>
                    {followsCount}
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
    separator: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(14),
        opacity: 0.5
    },
    icon: {
        width: 40,
        height: 20,
        alignSelf: 'center',
        borderRadius: 4,
    },
    malIcon: {
        marginLeft: 5,
        borderRadius: 4,
    },
    ratingNumber: {
        fontSize: Typography.getFontSize(16),
        marginLeft: 2,
        color: Colors.RED2,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 3,
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
    rating: PropTypes.object.isRequired,
    likesCount: PropTypes.number.isRequired,
    dislikesCount: PropTypes.number.isRequired,
    followsCount: PropTypes.number.isRequired,
    isLike: PropTypes.bool.isRequired,
    isDisLike: PropTypes.bool.isRequired,
    isFollow: PropTypes.bool.isRequired,
    onLike: PropTypes.func.isRequired,
    onDisLike: PropTypes.func.isRequired,
    onFollow: PropTypes.func.isRequired,
}


export default SectionMovieCardRating;
