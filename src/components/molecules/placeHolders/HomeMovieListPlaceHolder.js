import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {CustomRating, CustomImage} from "../../atoms";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const HomeMovieListPlaceHolder = ({extraStyle, number, rating = true}) => {
    const getPlaceHolders = () => {
        let array = [];
        for (let i = 0; i < number; i++) {
            array.push(
                <View style={style.cardContainer} key={i}>
                    <CustomImage
                        extraStyle={style.image}
                        url={null}
                        showLoadingImage={true}
                    />
                    <Text style={style.title} numberOfLines={1}>
                        Loading....
                    </Text>
                    <Text style={style.latestData}>
                        ??
                    </Text>
                    {rating && <CustomRating rating={0}/>}
                </View>
            );
        }
        return array;
    };
    return (
        <View style={[style.container, extraStyle]}>
            {getPlaceHolders()}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 10,
        alignItems: 'center',
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: "center",
        width: Mixins.getWindowWidth(31),
    },
    image: {
        width: Mixins.getWindowWidth(31),
        height: Mixins.getWindowHeight(25),
        minHeight: 190,
        borderRadius: 5,
    },
    title: {
        fontSize: Typography.getFontSize(18),
        color: Colors.TextColor,
        textAlign: 'center',
        marginTop: 3,
        marginBottom: 2
    },
    latestData: {
        fontSize: Typography.getFontSize(16),
        color: Colors.TextColor,
        textAlign: 'center',
        marginTop: -2,
        marginBottom: 0
    }
});

HomeMovieListPlaceHolder.propTypes = {
    extraStyle: PropTypes.object,
    number: PropTypes.number.isRequired,
    rating: PropTypes.bool,
};


export default HomeMovieListPlaceHolder;
