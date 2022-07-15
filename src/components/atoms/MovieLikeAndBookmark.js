import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {Ionicons} from "@expo/vector-icons";
import LikeIconWithAnimation from "./LikeIconWithAnimation";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieLikeAndBookmark = ({
                                  extraStyle,
                                  isLike,
                                  isDisLike,
                                  onLike,
                                  onDisLike,
                                  likesCount,
                                  dislikesCount,
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
                    iconName={"md-heart-dislike"}
                    outlineIconName={"md-heart-dislike-outline"}
                    onPress={onDisLike}
                    disableOnPressActivation={disable}
                />
                <Text style={style.likeNumber}>
                    {dislikesCount} dislikes
                </Text>

                <Ionicons
                    name={"bookmark-outline"}
                    size={30}
                    color="grey"
                    style={style.bookmarkIcon}
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
    bookmarkIcon: {
        position: 'absolute',
        right: 5,
        marginTop: 3,
    }
});

MovieLikeAndBookmark.propTypes = {
    extraStyle: PropTypes.object,
    isLike: PropTypes.bool.isRequired,
    isDisLike: PropTypes.bool.isRequired,
    onLike: PropTypes.func.isRequired,
    onDisLike: PropTypes.func.isRequired,
    likesCount: PropTypes.number.isRequired,
    dislikesCount: PropTypes.number.isRequired,
    disable: PropTypes.bool,
}


export default MovieLikeAndBookmark;
