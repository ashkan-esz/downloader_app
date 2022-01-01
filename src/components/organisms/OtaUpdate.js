import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Overlay, Text} from "react-native-elements";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


const OtaUpdate = ({update, downloadUpdate, isDownloading}) => {
    const [overlay, setOverlay] = useState(true);

    return (
        <Overlay
            overlayStyle={style.overlay}
            isVisible={update && overlay}
            onBackdropPress={() => setOverlay(false)}
            animationType={"slide"}
        >
            <View style={style.container}>

                <Text style={style.text}> There is a minor update (1mb) </Text>

                <View style={style.buttonsContainer}>
                    <Button
                        buttonStyle={style.rightButton}
                        title={'Cancel'}
                        onPress={() => setOverlay(false)}
                    />
                    <Button
                        buttonStyle={style.leftButton}
                        title={'Download'}
                        loading={isDownloading}
                        onPress={() => downloadUpdate()}
                    />
                </View>

            </View>
        </Overlay>
    );
};

const style = StyleSheet.create({
    overlay: {
        backgroundColor: Colors.PRIMARY,
        position: 'absolute',
        top: '35%',
        width: '70%',
        minWidth: 250,
        maxWidth: 400,
        height: '25%',
        minHeight: 150,
        maxHeight: 250,
        borderRadius: 10
    },
    container: {
        top: '12%',
    },
    text: {
        color: Colors.WARNING,
        fontSize: Typography.getFontSize(20),
        textAlign: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    leftButton: {
        width: '70%',
        minWidth: 100,
        maxWidth: 150,
        backgroundColor: 'green',
    },
    rightButton: {
        width: '70%',
        minWidth: 100,
        maxWidth: 150,
        backgroundColor: Colors.RED2
    }
});

OtaUpdate.propTypes = {
    update: PropTypes.bool.isRequired,
    isDownloading: PropTypes.bool.isRequired,
    downloadUpdate: PropTypes.func.isRequired,
};


export default OtaUpdate;
