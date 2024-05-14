import {View} from "react-native";
import {MyShimmerPlaceHolder} from "../../atoms";
import React from "react";
import {Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const HomeMovieCardPlaceHolder = ({extraStyle, latestData = true}) => {
    return (
        <View style={[style.cardContainer, extraStyle]}>

            <MyShimmerPlaceHolder extraStyle={style.image}/>
            <MyShimmerPlaceHolder extraStyle={{
                marginTop: 8,
                marginBottom: 2,
            }} width={110} height={Typography.getFontSize(18)}/>

            {
                latestData && <MyShimmerPlaceHolder
                    width={50}
                    height={Typography.getFontSize(14)}
                    extraStyle={{
                        marginTop: 4,
                        marginBottom: 0,
                    }}
                />
            }
        </View>
    );
};

const style = {
    cardContainer: {
        flex: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: "flex-start",
        width: Mixins.getWindowWidth(31),
    },
    image: {
        width: Mixins.getWindowWidth(31),
        height: Mixins.getWindowHeight(25),
        minHeight: 190,
        borderRadius: 5,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    }
};

HomeMovieCardPlaceHolder.propTypes = {
    extraStyle: PropTypes.object,
    latestData: PropTypes.bool,
}

export default HomeMovieCardPlaceHolder;
