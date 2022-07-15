import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {AirbnbRating} from 'react-native-ratings';
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const CustomRating = ({rating}) => {
    return (
        <View style={style.container}>

            <AirbnbRating
                starStyle={style.star}
                defaultRating={rating / 2}
                size={5}
                showRating={false}
                isDisabled={true}
            />

            <Text style={style.separator}> | </Text>
            <Text style={style.rate}>{rating || '?'} </Text>

        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    star: {
        height: 13,
        width: 10
    },
    separator: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(14),
        opacity: 0.5
    },
    rate: {
        color: Colors.RED2,
        fontSize: Typography.getFontSize(14)
    }
});

CustomRating.propTypes = {
    rating: PropTypes.number.isRequired
}


export default CustomRating;
