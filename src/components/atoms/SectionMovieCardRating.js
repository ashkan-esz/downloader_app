import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {Image} from 'expo-image';
import IconWithTransition from "./IconWithTransition";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const SectionMovieCardRating = ({
                                    extraStyle, likeContainerStyle,
                                    rating, type,
                                    followsCount, watchListCount,
                                    isFollow, isWatchList,
                                    onFollow, onWatchList
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

                {/*todo : better design for disabled icon*/}

                {/* todo : follow is disabled for movies*/}
                <IconWithTransition
                    extraIconStyle={style.likeIcon}
                    isActive={isFollow}
                    iconName={"book-play"}
                    outlineIconName={"book-play-outline"}
                    iconGroup={"MaterialCommunityIcons"}
                    iconColor={"grey"}
                    activeIconColor={Colors.FOLLOW_ICON}
                    onPress={onFollow}
                    iconSize={25}
                    firstViewAnimation={false}
                />
                <Text style={style.likeNumber}>
                    {followsCount}
                </Text>

                {/* todo : disable when its followed */}
                <IconWithTransition
                    extraIconStyle={style.likeIcon}
                    isActive={isWatchList}
                    iconName={"bookmark"}
                    outlineIconName={"bookmark-outline"}
                    iconColor={"grey"}
                    activeIconColor={Colors.BLUE_LIGHT}
                    onPress={onWatchList}
                    iconSize={25}
                    firstViewAnimation={false}
                />
                <Text style={style.likeNumber}>
                    {watchListCount}
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
    type: PropTypes.string.isRequired,
    followsCount: PropTypes.number.isRequired,
    watchListCount: PropTypes.number.isRequired,
    isFollow: PropTypes.bool.isRequired,
    isWatchList: PropTypes.bool.isRequired,
    onFollow: PropTypes.func.isRequired,
    onWatchList: PropTypes.func.isRequired,
}


export default SectionMovieCardRating;
