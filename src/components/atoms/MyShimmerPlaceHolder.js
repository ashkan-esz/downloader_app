import React from "react";
import MovieScreenQualityCollapsible from "./MovieScreenQualityCollapsible";
import {Colors} from "../../styles";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";
import {LinearGradient} from "expo-linear-gradient";
import PropTypes from "prop-types";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MyShimmerPlaceHolder = ({extraStyle, width, height}) => {
    return (
        <ShimmerPlaceholder
            width={width}
            height={height}
            shimmerStyle={[{borderRadius: 8}, extraStyle]}
            shimmerColors={[Colors.SHIMMER_DARK, Colors.SHIMMER_LIGHT, Colors.SHIMMER_DARK]}
        />
    );
};

MovieScreenQualityCollapsible.propTypes = {
    extraStyle: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
}


export default MyShimmerPlaceHolder;
