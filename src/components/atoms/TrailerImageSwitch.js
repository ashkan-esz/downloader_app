import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Icon, Image} from "react-native-elements";
import CustomVideo from "./CustomVideo";
import {useDebounce} from "../../hooks";
import PropTypes from 'prop-types';

//todo : fix ugly image

const TrailerImageSwitch = ({videoStyle, trailer, poster, onLongPress = () => {}}) => {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const debouncedIsPlaying = useDebounce(isPlaying, 15000, true);

    useEffect(() => {
        setShouldLoad(debouncedIsPlaying);
    }, [debouncedIsPlaying]);

    if (!shouldLoad) {
        return (
            <View>
                <Image
                    style={videoStyle}
                    source={poster ? {uri: poster} : null}
                    PlaceholderContent={<ActivityIndicator size={'large'} color={'blue'}/>}
                    onLongPress={onLongPress}
                />
                <View style={style.imageTextContainer}>
                    <Icon
                        name={'play'}
                        type={"antdesign"}
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
            trailer={trailer}
            poster={poster}
            setIsPlaying={setIsPlaying}
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
    trailer: PropTypes.string.isRequired,
    poster: PropTypes.string,
    onLongPress: PropTypes.func,
}


export default TrailerImageSwitch;
