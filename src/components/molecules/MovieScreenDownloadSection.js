import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "react-native-elements";
import {MovieScreenQualityCollapsible, MovieScreenSeasonCollapsible} from "../atoms";
import {Typography, Colors} from "../../styles";
import {LinearGradient} from "expo-linear-gradient";
import PropTypes from 'prop-types';

//todo : check section list

const MovieScreenDownloadSection = ({data}) => {
    const cyanGradient = ['rgba(34,193,195,1)', 'rgba(253,187,45,1)'];
    return (
        <View style={style.container}>

            <Text style={style.section}>
                DOWNLOAD
            </Text>
            {
                data.sources.length === 0
                    ? <TouchableOpacity activeOpacity={0.7}>
                        <LinearGradient
                            colors={cyanGradient}
                            start={[0, 0]}
                            end={[1, 1]}
                            locations={[0, 1]}
                            style={style.headerGradient}
                        >
                            <Text style={style.headerText}>
                                No link available
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    : data.type.includes('serial')
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
        color: Colors.SectionHeader,
        marginBottom: 20,
    },
    headerGradient: {
        height: 45,
        borderRadius: 7,
        paddingLeft: 5,
        paddingTop: 8,
        marginBottom: 10,
    },
    headerText: {
        fontSize: Typography.getFontSize(18),
        color: '#fff',
    }
});

MovieScreenDownloadSection.propTypes = {
    data: PropTypes.object.isRequired,
}


export default MovieScreenDownloadSection;
