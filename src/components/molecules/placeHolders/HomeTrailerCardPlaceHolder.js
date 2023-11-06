import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';
import {MyShimmerPlaceHolder} from "../../atoms";


const HomeTrailerCardPlaceHolder = ({extraStyle}) => {
    return (
        <View style={[style.cardContainer, extraStyle]}>
            <MyShimmerPlaceHolder extraStyle={style.video}/>
            <MyShimmerPlaceHolder extraStyle={{
                textAlign: 'center',
                marginTop: 8
            }} width={200} height={Typography.getFontSize(18)}/>
            <View style={style.genresContainer}>
                <MyShimmerPlaceHolder extraStyle={style.genres} width={46} height={Typography.getFontSize(14)}/>
                <MyShimmerPlaceHolder extraStyle={style.genres} width={46} height={Typography.getFontSize(14)}/>
                <MyShimmerPlaceHolder extraStyle={style.genres} width={46} height={Typography.getFontSize(14)}/>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    cardContainer: {
        alignItems: 'center',
        marginRight: 10,
        width: Mixins.getWindowWidth(68),
        height: Mixins.getWindowHeight(20) + 60,
        minHeight: 208,
    },
    video: {
        width: Mixins.getWindowWidth(68),
        height: Mixins.getWindowHeight(20),
        minHeight: 155,
        borderRadius: 10,
    },
    genresContainer: {
        flexDirection: 'row',
        justifyContent: "center",
    },
    genres: {
        textAlign: 'center',
        marginTop: 5,
        marginLeft: 12,
    },
});

HomeTrailerCardPlaceHolder.propTypes = {
    extraStyle: PropTypes.object,
};


export default HomeTrailerCardPlaceHolder;
