import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const MovieScreenEpisode = ({extraStyle, episode}) => {
    const gradient = ['rgba(131,58,180,1)', 'rgba(253,29,29,1)', 'rgba(252,176,69,1)'];

    const buttonTitleFontSize = {
        fontSize: (episode.sourceName + ' | ' + episode.info).length < 40
            ? Typography.getFontSize(16)
            : Typography.getFontSize(14),
        color: '#fff',
    }

    const _onPress = async (link) => {
        try {
            Clipboard.setString(link);
            Toast.show({
                type: 'linkToClipboard',
                text1: 'Link copied to clipboard',
                position: 'bottom',
                onPress: () => {
                    Toast.hide()
                },
                visibilityTime: 1000
            });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <LinearGradient
            colors={gradient}
            locations={[0, 0.5, 1]}
            start={[0, 0]}
            end={[1, 1]}
            style={extraStyle}
        >
            <Button
                titleStyle={buttonTitleFontSize}
                title={(episode.sourceName.charAt(0).toUpperCase() + episode.sourceName.slice(1)) + ' | ' + episode.info}
                type={"clear"}
                onPress={() => _onPress(episode.link)}
            />
        </LinearGradient>
    );
};

const style = StyleSheet.create({});

MovieScreenEpisode.propTypes = {
    extraStyle: PropTypes.object,
    episode: PropTypes.object.isRequired,
}


export default MovieScreenEpisode;
