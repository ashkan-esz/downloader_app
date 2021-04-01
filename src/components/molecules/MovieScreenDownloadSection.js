import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-elements";
import {MovieScreenQualityCollapsible, MovieScreenSeasonCollapsible} from "../atoms";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenDownloadSection = ({data}) => {
    return (
        <View style={style.container}>

            <Text style={style.section}>
                DOWNLOAD
            </Text>
            {
                data.type === 'serial'
                    ? <MovieScreenSeasonCollapsible
                        latestData={data.latestData}
                        sources={data.sources}
                        seasons={data.seasons}
                        episodes={data.episodes}
                    />
                    : <MovieScreenQualityCollapsible
                        sources={data.sources}
                    />
            }

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    section: {
        fontSize: Typography.getFontSize(24),
        color: 'cyan',
        marginBottom: 20,
    },
});

MovieScreenDownloadSection.propTypes = {
    data: PropTypes.object.isRequired,
}


export default MovieScreenDownloadSection;
