import React, {memo, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomVideo from "./CustomVideo";
import CustomImage from "./CustomImage";
import {useDebounce} from "../../hooks";
import {Colors} from "../../styles";
import PropTypes from 'prop-types';


const TrailerImageSwitch = ({
                                videoStyle,
                                isOnScreenView,
                                trailer,
                                posters,
                                widePoster,
                                onLongPress,
                                like,
                                dislike,
                                hideLikeIcon,
                                startFullscreen = true,
                                movieId,
                            }) => {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const debouncedIsPlaying = useDebounce(isPlaying, 15000, true);

    useEffect(() => {
        if (isPlaying || shouldLoad) {
            setIsPlaying(false);
            setShouldLoad(false);
        }
    }, [trailer]);

    useEffect(() => {
        setShouldLoad(debouncedIsPlaying);
    }, [debouncedIsPlaying]);

    if (!shouldLoad) {
        return (
            <View>
                <CustomImage
                    extraStyle={[style.image, videoStyle]}
                    posters={widePoster ? [widePoster] : posters}
                    resizeModeStretch={true}
                    movieId={movieId}
                />

                {
                    !hideLikeIcon && (like || dislike) && <View style={style.likeContainer}>
                        <Ionicons
                            name={like ? 'heart' : 'md-heart-dislike'}
                            size={22}
                            color={"red"}
                        />
                    </View>
                }

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
            poster={widePoster || posters[0]?.url || ''}
            setIsPlaying={setIsPlaying}
            startFullscreen={startFullscreen}
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
    image: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    likeContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.SECONDARY,
        borderRadius: 8,
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        position: 'absolute',
        left: 0,
    },
});

TrailerImageSwitch.propTypes = {
    videoStyle: PropTypes.object,
    isOnScreenView: PropTypes.bool.isRequired,
    trailer: PropTypes.string.isRequired,
    posters: PropTypes.array,
    widePoster: PropTypes.object,
    movieId: PropTypes.string,
    onLongPress: PropTypes.func,
    like: PropTypes.bool.isRequired,
    dislike: PropTypes.bool.isRequired,
    hideLikeIcon: PropTypes.bool,
    startFullscreen: PropTypes.bool,
}


export default memo(TrailerImageSwitch);
