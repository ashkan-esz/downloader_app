import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-elements";
import {AntDesign} from "@expo/vector-icons";
import {homeStackHelpers} from "../../helper";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenUpdateSection = ({data}) => {
    const {
        type, status,
        latestData, nextEpisode,
        episodes, totalDuration, releaseDay
    } = data;

    const episodeText = type === 'serial'
        ? ('S' + latestData.season + 'E' + latestData.episode + ' , ') +
        episodes.find(value => value.season === latestData.season && value.episode === latestData.episode).title
        : '';

    const nextEpisodeText = (nextEpisode && nextEpisode.episode !== latestData.episode)
        ? ('S' + nextEpisode.season + 'E' + nextEpisode.episode + ' , ' + nextEpisode.title)
        : 'unknown';

    const makeTotalDuration = totalDuration.split(':')[0] + ' hour , ' +
        totalDuration.split(':')[1] + ' min';

    const {hardSubText, dubbedText} = homeStackHelpers.get_hardSub_dubbed_text(latestData, type);

    return (
        <View style={style.container}>
            <Text style={style.section}>
                UPDATE
            </Text>

            {
                type === 'serial' && <View>
                    <Text style={style.text}>
                        <Text style={style.statement}>Day :</Text> {releaseDay || 'unknown'}
                    </Text>
                    <Text style={style.text}>
                        <Text style={style.statement}>TotalDuration : </Text> {makeTotalDuration}
                    </Text>
                    <Text style={style.text} numberOfLines={1}>
                        <Text style={style.statement}>Episode : </Text> {episodeText}
                    </Text>
                </View>
            }

            <Text style={style.text}>
                <Text style={style.statement}>Quality : </Text> {latestData.quality}
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>HardSub : </Text>
                {
                    typeof hardSubText === 'boolean'
                        ? <AntDesign
                            name={hardSubText ? 'checkcircleo' : 'closecircleo'}
                            size={22}
                            color={hardSubText ? 'green' : 'red'}
                        />
                        : hardSubText
                }
            </Text>
            <Text style={style.text}>
                <Text style={style.statement}>Dubbed : </Text>
                {
                    typeof dubbedText === 'boolean'
                        ? <AntDesign
                            name={dubbedText ? 'checkcircleo' : 'closecircleo'}
                            size={22}
                            color={dubbedText ? 'green' : 'red'}
                        />
                        : dubbedText
                }
            </Text>
            {
                status === 'running' && <View>
                    <Text style={style.text} numberOfLines={1}>
                        <Text style={style.statement}>Next Episode : </Text> {nextEpisodeText}
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
        fontSize: Typography.getFontSize(24),
        color: 'cyan',
        paddingLeft: 2,
        marginBottom: 10,
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

MovieScreenUpdateSection.propTypes = {
    data: PropTypes.object.isRequired,
}


export default MovieScreenUpdateSection;
