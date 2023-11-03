import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Overlay} from "@rneui/themed";
import CustomImage from "./CustomImage";
import {Mixins} from "../../styles";
import PropTypes from 'prop-types';


const FullScreenImageView = ({poster, overlay, setOverlay}) => {
    return (
        <View>
            <Overlay
                overlayStyle={style.overlay}
                isVisible={overlay}
                onBackdropPress={() => setOverlay(false)}
                animationType={"slide"}
            >
                <CustomImage
                    extraStyle={style.image}
                    posters={[poster]}
                    resizeModeStretch={true}
                    onPress={() => setOverlay(false)}
                />
            </Overlay>
        </View>
    );
};

const style = StyleSheet.create({
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '85%',
        ...Mixins.padding(0),
        borderRadius: 10
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

FullScreenImageView.propTypes = {
    poster: PropTypes.object,
    overlay: PropTypes.bool.isRequired,
    setOverlay: PropTypes.func.isRequired,
}


export default FullScreenImageView;
