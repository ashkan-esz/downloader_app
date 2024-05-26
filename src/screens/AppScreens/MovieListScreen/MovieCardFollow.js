import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Typography} from "../../../styles";


const MovieCardFollow = ({
                                   extraStyle, type,
                                    followsCount, watchListCount,
                                    isFollow, isWatchList,
                                    onFollow, onWatchList,
                                }) => {
    return (
        <View style={[style.container, extraStyle]}>
            {/*<View style={[style.likeContainer, likeContainerStyle]}>*/}

            {/*    /!*todo : better design for disabled icon*!/*/}

            {/*    /!* todo : follow is disabled for movies*!/*/}
            {/*    <IconWithTransition*/}
            {/*        extraIconStyle={style.likeIcon}*/}
            {/*        isActive={isFollow}*/}
            {/*        iconName={"book-play"}*/}
            {/*        outlineIconName={"book-play-outline"}*/}
            {/*        iconGroup={"MaterialCommunityIcons"}*/}
            {/*        iconColor={"grey"}*/}
            {/*        activeIconColor={Colors.FOLLOW_ICON}*/}
            {/*        onPress={onFollow}*/}
            {/*        iconSize={25}*/}
            {/*        firstViewAnimation={false}*/}
            {/*    />*/}
            {/*    <Text style={style.likeNumber}>*/}
            {/*        {followsCount}*/}
            {/*    </Text>*/}

            {/*    /!* todo : disable when its followed *!/*/}
            {/*    <IconWithTransition*/}
            {/*        extraIconStyle={style.likeIcon}*/}
            {/*        isActive={isWatchList}*/}
            {/*        iconName={"bookmark"}*/}
            {/*        outlineIconName={"bookmark-outline"}*/}
            {/*        iconColor={"grey"}*/}
            {/*        activeIconColor={Colors.BLUE_LIGHT}*/}
            {/*        onPress={onWatchList}*/}
            {/*        iconSize={25}*/}
            {/*        firstViewAnimation={false}*/}
            {/*    />*/}
            {/*    <Text style={style.likeNumber}>*/}
            {/*        {watchListCount}*/}
            {/*    </Text>*/}
            {/*</View>*/}
        </View>
    );
};

const style = StyleSheet.create({
    container:{

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

MovieCardFollow.propTypes = {
    extraStyle: PropTypes.object,
    type: PropTypes.string.isRequired,
    followsCount: PropTypes.number.isRequired,
    watchListCount: PropTypes.number.isRequired,
    isFollow: PropTypes.bool.isRequired,
    isWatchList: PropTypes.bool.isRequired,
    onFollow: PropTypes.func.isRequired,
    onWatchList: PropTypes.func.isRequired,
}


export default MovieCardFollow;
