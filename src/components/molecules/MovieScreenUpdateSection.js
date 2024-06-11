import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import AntDesign from "react-native-vector-icons/AntDesign";
import {homeStackHelpers} from "../../helper";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenUpdateSection = ({data}) => {
    const {
        type, status,
        latestData, nextEpisode,
        seasons, totalDuration, releaseDay
    } = data;

    const makeTotalDuration = totalDuration ? totalDuration.split(':')[0] + ' hour , ' +
        totalDuration.split(':')[1] + ' min' : '-';

    return (
        <View style={style.container}>
            <Text style={style.section}>
                UPDATE
            </Text>

            {
                type.includes('serial') && <View>
                    <Text style={style.text}>
                        <Text style={style.statement}>Status :</Text> {status}
                    </Text>
                    <Text style={style.text}>
                        <Text style={style.statement}>Day :</Text> {releaseDay || 'unknown'}
                    </Text>
                    <Text style={style.text}>
                        <Text style={style.statement}>TotalDuration : </Text> {makeTotalDuration}
                    </Text>
                    <Text style={style.text} numberOfLines={1}>
                        <Text style={style.statement}>Episode : </Text>
                        {" " + homeStackHelpers.getSeasonEpisodeWithTitle(seasons, latestData.season, latestData.episode, type)}
                    </Text>
                    <Text style={style.text} numberOfLines={1}>
                        <Text style={style.statement}>Torrent-Episode : </Text>
                        {" " + homeStackHelpers.getSeasonEpisodeWithTitle(seasons, ...homeStackHelpers.getSeasonEpisode(latestData.torrentLinks), type)}
                    </Text>
                </View>
            }

            <Text style={style.text}>
                <Text style={style.statement}>Quality : </Text> {latestData.quality}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>HardSub : </Text>
                {
                    (!latestData.hardSub || type.includes("movie"))
                        ? <AntDesign
                            name={latestData.hardSub ? 'checkcircleo' : 'closecircleo'}
                            size={22}
                            color={latestData.hardSub ? 'green' : 'red'}
                        />
                        : latestData.hardSub.toUpperCase()
                }
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Dubbed : </Text>
                {
                    (!latestData.dubbed || type.includes("movie"))
                        ? <AntDesign
                            name={latestData.dubbed ? 'checkcircleo' : 'closecircleo'}
                            size={22}
                            color={latestData.dubbed ? 'green' : 'red'}
                        />
                        : latestData.dubbed.toUpperCase()
                }
            </Text>
            {
                status === 'running' && <View>
                    <Text style={style.text} numberOfLines={1}>
                        <Text style={style.statement}>Next Episode : </Text>
                        {" " + homeStackHelpers.getSeasonEpisodeWithTitle(seasons, nextEpisode?.season, nextEpisode?.episode, type)}
                    </Text>
                    <Text style={style.text} numberOfLines={1}>
                        <Text style={style.statement}>Time To Next Episode
                            : </Text> {homeStackHelpers.daysToNextEpisode(nextEpisode)}
                    </Text>
                </View>
            }
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
        fontSize: 24,
        color: Colors.SectionHeader,
        paddingLeft: 2,
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5
    },
    statement: {
        fontSize: 14,
        color: Colors.SemiCyan,
    },
});

MovieScreenUpdateSection.propTypes = {
    data: PropTypes.object.isRequired,
}


export default MovieScreenUpdateSection;
