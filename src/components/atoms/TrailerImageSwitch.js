import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import CustomVideo from "./CustomVideo";
import CustomImage from "./CustomImage";
import {useDebounce} from "../../hooks";
import PropTypes from 'prop-types';


const TrailerImageSwitch = ({videoStyle, isOnScreenView, trailer, poster, onLongPress}) => {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const debouncedIsPlaying = useDebounce(isPlaying, 15000, true);

    useEffect(() => {
        setShouldLoad(debouncedIsPlaying);
    }, [debouncedIsPlaying]);

    if (!shouldLoad) {
        return (
            <View>
                <CustomImage
                    extraStyle={videoStyle}
                    url={poster}
                    resizeModeStretch={true}
                    progressSize={60}
                    progressThickness={4}
                />
                <View style={style.imageTextContainer}>
                    <AntDesign
                        name={'play'}
                        size={50}
                        color={'white'}
                        onPress={() => setShouldLoad(true)}
                        onLongPress={onLongPress}
                    />
                </View>
            </View>
        );
    }

    return (
        <CustomVideo
            videoStyle={videoStyle}
            isOnScreenView={isOnScreenView}
            trailer={trailer}
            poster={poster}
            setIsPlaying={setIsPlaying}
            startFullscreen={true}
        />
    );
};

const style = StyleSheet.create({
    imageTextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

TrailerImageSwitch.propTypes = {
    videoStyle: PropTypes.object,
    isOnScreenView: PropTypes.bool.isRequired,
    trailer: PropTypes.string.isRequired,
    poster: PropTypes.object,
    onLongPress: PropTypes.func,
}


export default TrailerImageSwitch;
