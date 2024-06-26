import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {Colors} from "../../styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const MovieSearchNotFound = () => {
    return (
        <>
            <MaterialIcons
                style={style.icon}
                name="search"
                size={100}
                color={Colors.RED2}
            />
            <Text
                style={style.title}
            >
                Not Found.
            </Text>
        </>
    );
}

const style = StyleSheet.create({
    icon: {
        alignSelf: 'center',
        marginTop: 20,
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        color: Colors.RED2,
    }
});


export default MovieSearchNotFound;
