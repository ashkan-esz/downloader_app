import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Text} from "react-native-elements";
import {MovieTrailerView} from "../atoms";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MoviePlotTrailer = ({plot, trailer}) => {
    const [overlay, setOverlay] = useState(false);

    return (
        <View style={style.container}>
            <Text style={style.section}>
                PLOT
            </Text>

            <TouchableOpacity
                style={[style.trailerButtonContainer, !trailer && style.disableTrailerButton]}
                onPress={() => setOverlay(true)}
                disabled={!trailer}
            >
                <Text style={style.trailerButton}>
                    Watch trailer
                </Text>
                <Divider style={style.trailerButtonUnderLine}/>
            </TouchableOpacity>

            <MovieTrailerView
                trailer={trailer}
                setOverlay={setOverlay}
                overlay={overlay}
            />

            <Text style={style.plotText}>
                {plot || 'no summary available.'}
            </Text>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
        paddingLeft: 10,
    },
    section: {
        fontSize: Typography.getFontSize(24),
        color: 'cyan',
        marginBottom: 15,
    },
    plotText: {
        fontSize: Typography.getFontSize(16),
        width: '100%',
        color: '#fff',
    },
    trailerButtonContainer: {
        position: 'absolute',
        right: 15,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    trailerButton: {
        fontSize: Typography.getFontSize(22),
        color: '#fff',
    },
    trailerButtonUnderLine: {
        backgroundColor: 'cyan',
        width: '80%',
        height: 2,
        marginTop: 3,
    },
    disableTrailerButton: {
        opacity: 0.3
    }
});

MoviePlotTrailer.propTypes = {
    plot: PropTypes.string.isRequired,
    trailer: PropTypes.string.isRequired,
}


export default MoviePlotTrailer;

