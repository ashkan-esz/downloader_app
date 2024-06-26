import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import MovieError from "./MovieError";
import PropTypes from 'prop-types';
import {Colors} from "../../styles";


const MovieLoadingAndError = ({isError, retry}) => {

    if (isError) {
        return (
            <MovieError retry={retry}/>
        );
    }

    return (
        <ActivityIndicator
            style={style.loading}
            size={"large"}
            color={Colors.THIRD}
            animating={true}
        />
    );
};

const style = StyleSheet.create({
    loading: {
        marginTop: 20,
    },
});

MovieLoadingAndError.propTypes = {
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
}


export default MovieLoadingAndError;
