import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-elements";
import {filterReleasedEpisodes} from "../../utils";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenDetailsSection = ({data}) => {
    const {
        type, premiered, status,
        seasons, episodes, duration,
        latestData,
        country, movieLang,
        rated, boxOffice,
    } = data;

    const numberOfEpisodes = filterReleasedEpisodes(episodes, latestData).length;

    return (
        <View style={style.container}>
            <Text style={style.section}>
                INFO
            </Text>

            <View style={style.row}>
                <Text style={style.text}>
                    <Text style={style.statement}>Type : </Text> {type}
                </Text>
                <Text style={style.text}>
                    <Text style={style.statement}>Year : </Text> {premiered.split('-').slice(0, 2).join('-')}
                </Text>
                <Text style={style.text}>
                    <Text style={style.statement}>Duration : </Text> {duration || 'unknown'}
                </Text>
            </View>

            <View style={style.row}>
                <Text style={style.text}>
                    <Text style={style.statement}>Country
                        :</Text> {country.split(',').slice(0, 2).join(' , ') || 'unknown'}
                </Text>
                <Text style={style.text}>
                    <Text style={style.statement}>Lang :</Text> {movieLang || 'unknown'}
                </Text>
                <Text style={style.text}>
                    <Text style={style.statement}>Rated :</Text> {rated || 'unknown'}
                </Text>
            </View>

            {
                type === 'serial' && <View style={style.row}>
                    <Text style={style.text}>
                        <Text style={style.statement}>Seasons : </Text> {seasons.length}
                    </Text>
                    <Text style={style.text}>
                        <Text style={style.statement}>Episodes : </Text> {numberOfEpisodes}
                    </Text>
                    <Text style={style.text}>
                        <Text style={style.statement}>Status : </Text> {status}
                    </Text>
                </View>
            }

            <Text style={style.text}>
                <Text style={style.statement}>BoxOffice :</Text> {boxOffice || 'unknown'}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Director :</Text> {data.director || 'unknown'}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Writer :</Text> {data.writer.split(',').join(' , ') || 'unknown'}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Cast :</Text> {data.cast.join(' ,  ') || 'unknown'}
            </Text>

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20,
        paddingLeft: 8,
        paddingRight: 8,
    },
    section: {
        fontSize: Typography.getFontSize(24),
        color: 'cyan',
        paddingLeft: 2,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: Typography.getFontSize(16),
        color: '#fff',
        marginTop: 5
    },
    statement: {
        fontSize: Typography.getFontSize(16),
        color: Colors.SemiCyan,
    },
});

MovieScreenDetailsSection.propTypes = {
    data: PropTypes.object.isRequired,
}


export default MovieScreenDetailsSection;
