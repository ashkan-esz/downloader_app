import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Colors} from "../../../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";


const MovieCardFollow = ({extraStyle, isFollow, isWatchList}) => {

    if (!isFollow && !isWatchList) {
        return null;
    }

    return (
        <View style={[style.container, extraStyle]}>
            {
                isFollow
                    ? <MaterialCommunityIcons
                        name={"book-play"}
                        size={20}
                        color={Colors.FOLLOW_ICON}
                    />
                    : <Ionicons
                        name={'bookmark'}
                        size={22}
                        color={Colors.BLUE_LIGHT}
                    />
            }
            <Text style={style.text}> {isFollow ? "Following" : "Watch-List"} </Text>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        backgroundColor: Colors.BLACK,
        flexDirection: "row",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        width: 95,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 3,
        marginBottom: -5,
        marginLeft: -1,
    },
    text: {
        fontSize: 12,
        color: "#fff",
        marginLeft: 1,
    },
});

MovieCardFollow.propTypes = {
    extraStyle: PropTypes.object,
    isFollow: PropTypes.bool.isRequired,
    isWatchList: PropTypes.bool.isRequired,
}


export default MovieCardFollow;
