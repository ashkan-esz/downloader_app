import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Text} from "@rneui/themed";
import MovieTrailerView from "./MovieTrailerView";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieTrailer = ({trailer, poster}) => {
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
                poster={poster}
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
        fontSize: 22,
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
    poster: PropTypes.object,
}


export default MovieTrailer;

