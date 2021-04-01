import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MovieScreenDetailsSection, MoviePlotTrailer, MovieScreenUpdateSection} from "../molecules";
import {getTrailer} from "../../utils";
import PropTypes from 'prop-types';


const MovieScreenInfoSection = ({data}) => {
    return (
        <View>
            <MoviePlotTrailer
                plot={data.summary.english}
                trailer={getTrailer(data.trailers, '720')}
            />
            <MovieScreenDetailsSection
                data={data}
            />
            <MovieScreenUpdateSection
                data={data}
            />
        </View>
    );
};

const style = StyleSheet.create({});

MovieScreenInfoSection.propTypes = {
    data: PropTypes.object.isRequired,
}


export default MovieScreenInfoSection;
