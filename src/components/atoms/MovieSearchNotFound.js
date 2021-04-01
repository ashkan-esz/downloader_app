import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, Text} from "react-native-elements";
import {Colors, Typography} from "../../styles";


const MovieSearchNotFound = () => {
    return (
        <View>
            <Icon
                containerStyle={style.IconContainer}
                name={'search'}
                size={100}
                color={Colors.RED2}
            />
            <Text
                style={style.title}
            >
                Not Found.
            </Text>
        </View>
    );
}

const style = StyleSheet.create({
    IconContainer: {
        marginTop: 20
    },
    title: {
        alignSelf: 'center',
        fontSize: Typography.getFontSize(20),
        color: Colors.RED2
    }
});


export default MovieSearchNotFound;
