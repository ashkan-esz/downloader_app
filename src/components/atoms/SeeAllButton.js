import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Colors, Typography} from "../../styles";
import {Button} from "react-native-elements";


const SeeAllButton = ({onPress, disabled}) => {
    return (
        <Button
            containerStyle={style.buttonContainer}
            titleStyle={style.buttonTitle}
            title={'See All'}
            type={"clear"}
            disabled={disabled}
            onPress={onPress}
        />
    );
};

const style = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        height: 35,
        marginTop: 15,
        backgroundColor: Colors.RED2
    },
    buttonTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(19)
    }
});

SeeAllButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}


export default SeeAllButton;
