import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import LikeIconWithAnimation from "./LikeIconWithAnimation";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieLikeAndBookmark = ({
                                  extraStyle,
                                  isLike,
                                  isDisLike,
                                  isFollowed,
                                  isWatchlist,
                                  onLike,
                                  onDisLike,
                                  onFollow,
                                  onWatchList,
                                  likesCount,
                                  dislikesCount,
                                  type,
                                  disable
                              }) => {
    return (
        <View style={[style.container, extraStyle]}>
            <View style={style.likeContainer}>

                <LikeIconWithAnimation
                    isActive={isLike}
                    iconName={"heart"}
                    outlineIconName={"heart-outline"}
                    onPress={onLike}
                    disableOnPressActivation={disable}
                />
                <Text style={style.likeNumber}>
                    {likesCount} likes
                </Text>

                <LikeIconWithAnimation
                    isActive={isDisLike}
                    iconName={"heart-dislike"}
                    outlineIconName={"heart-dislike-outline"}
                    onPress={onDisLike}
                    disableOnPressActivation={disable}
                />
                <Text style={style.likeNumber}>
                    {dislikesCount} dislikes
                </Text>

                <LikeIconWithAnimation
                    extraStyle={style.followIcon}
                    isActive={isFollowed}
                    iconName={"book-play"}
                    outlineIconName={"book-play-outline"}
                    iconGroup={"MaterialCommunityIcons"}
                    onPress={onFollow}
                    disableOnPressActivation={disable}
                    disabled={type.includes("movie")}
                    iconColor={"grey"}
                    activeIconColor={Colors.FOLLOW_ICON}
                />
                <LikeIconWithAnimation
                    extraStyle={style.watchlistIcon}
                    isActive={isWatchlist}
                    iconName={"bookmark"}
                    outlineIconName={"bookmark-outline"}
                    onPress={onWatchList}
                    disableOnPressActivation={disable}
                    disabled={isFollowed}
                    iconColor={"grey"}
                    activeIconColor={Colors.BLUE_LIGHT}
                />
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        marginTop: 5,
        paddingLeft: 5,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: Colors.SECONDARY,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    likeNumber: {
        fontSize: Typography.getFontSize(14),
        color: '#ffffff',
        marginTop: 3,
        paddingLeft: 4
    },
    followIcon: {
        position: 'absolute',
        right: 40,
        marginTop: 3,
        zIndex: 5,
    },
    watchlistIcon: {
        position: 'absolute',
        right: 5,
        marginTop: 3,
        zIndex: 5,
    }
});

MovieLikeAndBookmark.propTypes = {
    extraStyle: PropTypes.object,
    isLike: PropTypes.bool.isRequired,
    isDisLike: PropTypes.bool.isRequired,
    isFollowed: PropTypes.bool.isRequired,
    isWatchlist: PropTypes.bool.isRequired,
    onLike: PropTypes.func.isRequired,
    onDisLike: PropTypes.func.isRequired,
    onFollow: PropTypes.func.isRequired,
    onWatchList: PropTypes.func.isRequired,
    likesCount: PropTypes.number.isRequired,
    dislikesCount: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    disable: PropTypes.bool,
}


export default MovieLikeAndBookmark;
