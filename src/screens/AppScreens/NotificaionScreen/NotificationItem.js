import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {CustomImage} from "../../../components/atoms";
import {useNavigation} from "@react-navigation/native";
import {Colors, Typography} from "../../../styles";
import PropTypes from 'prop-types';
import {notificationEntityTypeIds} from "../../../api/profileApis";
import {getElapsedTime} from "../../../utils";


const NotificationItem = ({
                              extraStyle,
                              creatorId,
                              image,
                              entityId,
                              entityTypeId,
                              subEntityTypeId,
                              message,
                              status,
                              date,
                          }) => {

    const navigation = useNavigation();

    const _navigateToMovieScreen = useCallback(() => {
        // todo : notificationEntityTypeIds.user
        // todo : notificationEntityTypeIds.message
        if (entityTypeId === notificationEntityTypeIds.movie) {
            let title = message.split(/[:(\[]/gi)[0];
            navigation.navigate('Movie', {
                name: title,
                title: title,
                movieId: entityId,
                posters: [{url: image}],
                rating: {imdb: 0, myAnimeList: 0},
            });
        }
    }, [entityId]);

    return (
        <TouchableOpacity
            style={[style.container, extraStyle]}
            onPress={_navigateToMovieScreen}
            activeOpacity={0.8}
        >

            {status !== 2 && <View style={style.dot}></View>}
            <CustomImage
                extraStyle={[style.image]}
                posters={[{url: image}]}
                onPress={_navigateToMovieScreen}
                movieId={entityId}
                resizeModeStretch={true}
            />

            <View style={style.infoContainer}>
                <Text style={style.massage} numberOfLines={2}>
                    {message}
                </Text>
                <Text style={style.date} numberOfLines={1}>
                    {getElapsedTime(new Date(date)).highestUnit}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%',
        height: 90,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 10
    },
    unread: {
        borderColor: Colors.THIRD,
        borderWidth: 1,
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 24,
        color: Colors.THIRD,
        backgroundColor: Colors.THIRD,
        zIndex: 2,
        alignSelf: "center",
        marginLeft: 1,
        marginRight: -8,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 72,
        marginTop: 10,
        marginLeft: 10,
    },
    infoContainer: {
        paddingTop: 5,
        paddingLeft: 10,
        width: '100%',
        flexShrink: 1
    },
    massage: {
        fontSize: Typography.getFontSize(16),
        color: '#fff',
        paddingRight: 5,
    },
    date: {
        fontSize: Typography.getFontSize(14),
        color: Colors.TextColor,
        marginTop: 3,
    },
});

NotificationItem.propTypes = {
    extraStyle: PropTypes.object,
    creatorId: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired,
    entityTypeId: PropTypes.number.isRequired,
    subEntityTypeId: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
}

export default NotificationItem;
