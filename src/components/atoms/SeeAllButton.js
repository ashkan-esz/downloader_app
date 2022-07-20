import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from "@rneui/themed";
import {Colors, Typography} from "../../styles";
import PropTypes from 'prop-types';


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
        marginTop: 10,
        backgroundColor: Colors.RED2
    },
    buttonTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(19),
        height: '100%',
    }
});

SeeAllButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}


export default SeeAllButton;
