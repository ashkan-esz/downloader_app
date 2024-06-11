import React from 'react';
import {Button} from "@rneui/themed";
import {LinearGradient} from "expo-linear-gradient";
import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import PropTypes from 'prop-types';


const MovieScreenEpisode = ({extraStyle, rawTitle, linkData}) => {
    const gradient = ['rgba(131,58,180,1)', 'rgba(253,29,29,1)', 'rgba(252,176,69,1)'];

    const infoText = linkData.sourceName.charAt(0).toUpperCase() + linkData.sourceName.slice(1) + ' | ' + linkData.info;

    const buttonTitleFontSize = {
        fontSize: (linkData.sourceName + ' | ' + linkData.info).length < 36
            ? 16
            : 14,
        color: '#fff',
        zIndex: 10,
    }

    const _onPress = async () => {
        try {
            await Clipboard.setStringAsync(linkData.link);
            Toast.show({
                type: 'linkToClipboard',
                text1: 'Link copied to clipboard',
                position: 'bottom',
                onPress: () => {
                    Toast.hide();
                },
                visibilityTime: 1000
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const _onLongPress = async () => {
        try {
            let messageText;
            if (linkData.season) {
                let seasonEpisode = 'S' + linkData.season + 'E' + linkData.episode;
                messageText = rawTitle + '\n' + seasonEpisode + '\n' + infoText + '\n';
            } else {
                messageText = rawTitle + '\n' + infoText + '\n';
            }
            const shareResponse = await Share.open({
                title: 'Share',
                message: messageText,
                url: linkData.link,
            });
        } catch (error) {
        }
    }

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
                title={infoText}
                type={"clear"}
                onPress={_onPress}
                onLongPress={_onLongPress}
            />
        </LinearGradient>
    );
};


MovieScreenEpisode.propTypes = {
    extraStyle: PropTypes.object,
    linkData: PropTypes.object.isRequired,
    rawTitle: PropTypes.string.isRequired,
}


export default MovieScreenEpisode;
