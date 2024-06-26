import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {homeStackHelpers} from "../../helper";
import {Colors} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenDetailsSection = ({data}) => {
    const [numberOfEpisodes, setNumberOfEpisodes] = useState(0);
    const {
        type, status,
        premiered, year, endYear,
        seasons, duration,
        latestData,
        country, movieLang,
        rated, boxOffice,
    } = data;

    useEffect(() => {
        let temp = homeStackHelpers.getNumberOfReleasedEpisodes(seasons, latestData);
        setNumberOfEpisodes(temp);
    }, []);

    const getType = () => {
        return type
            .split('_')
            .map(value => value.charAt(0).toUpperCase() + value.slice(1))
            .join(' ');
    }

    const getYear = () => {
        if (year === endYear) {
            return year;
        }
        let temp = endYear || 'Now';
        return year + ' - ' + temp;
    }

    return (
        <View style={style.container}>
            <Text style={style.section}>
                INFO
            </Text>

            <Text style={style.text}>
                <Text style={style.statement}>Type : </Text> {getType()}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Duration : </Text> {duration || 'unknown'}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Premiered : </Text> {premiered}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Year : </Text> {getYear()}
            </Text>

            {
                type.includes('serial') && <View>
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
                <Text style={style.statement}>Country :</Text> {country || 'unknown'}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Lang :</Text> {movieLang || 'unknown'}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Rated :</Text> {rated || 'unknown'}
            </Text>

            <Text style={style.text}>
                <Text style={style.statement}>BoxOffice :</Text> {boxOffice || 'unknown'}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Directors
                    :</Text> {data.staff.directors.map(item => item.staff.name).join(', ')}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Writers :</Text> {data.staff.writers.map(item => item.staff.name).join(', ')}
            </Text>

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 25,
        paddingLeft: 8,
        paddingRight: 8,
    },
    section: {
        fontSize: 24,
        color: Colors.SectionHeader,
        paddingLeft: 2,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 14,
        textTransform: 'capitalize',
        color: '#fff',
        marginTop: 5
    },
    statement: {
        fontSize: 14,
        color: Colors.SemiCyan,
    },
});

MovieScreenDetailsSection.propTypes = {
    data: PropTypes.object.isRequired,
}


export default MovieScreenDetailsSection;
