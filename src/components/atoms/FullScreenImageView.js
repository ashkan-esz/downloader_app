import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {Image, Overlay} from "react-native-elements";
import {Mixins} from "../../styles";


const FullScreenImageView = ({image, overlay, setOverlay}) => {
    return (
        <View>
            <Overlay
                overlayStyle={style.overlay}
                isVisible={overlay}
                onBackdropPress={() => setOverlay(false)}
                animationType={"slide"}
            >
                <Image
                    style={style.image}
                    source={image}
                    PlaceholderContent={<ActivityIndicator size={'large'} color={'blue'}/>}
                    resizeMode={"stretch"}
                    resizeMethod={"resize"}
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
    image: PropTypes.any.isRequired,
    overlay: PropTypes.bool.isRequired,
    setOverlay: PropTypes.func.isRequired,
}


export default FullScreenImageView;
