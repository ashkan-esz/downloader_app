import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Text} from "react-native-elements";
import MovieTrailerView from "./MovieTrailerView";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieTrailer = ({trailer}) => {
    const [overlay, setOverlay] = useState(false);

    return (
        <View style={style.container}>
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
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 15,
        paddingLeft: 10,
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
        backgroundColor: 'red',
        width: '80%',
        height: 2,
        marginTop: 4,
    },
    disableTrailerButton: {
        opacity: 0.3
    }
});

MovieTrailer.propTypes = {
    trailer: PropTypes.string.isRequired,
}


export default MovieTrailer;

