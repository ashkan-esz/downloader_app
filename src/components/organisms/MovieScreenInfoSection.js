import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MoviePlot, MovieTrailer} from "../atoms";
import {MovieScreenDetailsSection, MovieScreenUpdateSection} from "../molecules";
import PropTypes from 'prop-types';


const MovieScreenInfoSection = ({data}) => {
    return (
        <View>
            <MovieTrailer
                trailer={data.trailers ? data.trailers[0].link : ''}
            />
            <MoviePlot
                summary={data.summary}
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
