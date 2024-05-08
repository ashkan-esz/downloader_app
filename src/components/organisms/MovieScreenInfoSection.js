import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MoviePlot, MovieTrailer} from "../atoms";
import {MovieScreenDetailsSection, MovieScreenUpdateSection} from "../molecules";
import PropTypes from 'prop-types';


const MovieScreenInfoSection = ({data, forceClosePlot, setForceClosePlot}) => {
    return (
        <View>
            <MovieTrailer
                poster={data.posters[0]}
                trailer={data.trailers?.[0]?.url || ''}
            />
            <MoviePlot
                summary={data.summary}
                forceClosePlot={forceClosePlot}
                setForceClosePlot={setForceClosePlot}
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
    forceClosePlot: PropTypes.bool.isRequired,
    setForceClosePlot: PropTypes.func.isRequired,
}


export default MovieScreenInfoSection;
