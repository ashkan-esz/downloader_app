import React from 'react';
import {StyleSheet} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import {Colors} from '../../styles';
import PropTypes from 'prop-types';


const ScrollTop = ({show, flatListRef, bottom, right}) => {
    const _scrollToTop = () => {
        if (flatListRef && flatListRef.current) {
            flatListRef.current.scrollToOffset({animated: true, offset: 0});
        }
    }

    return (
        <AntDesign
            style={{
                position: 'absolute',
                bottom: bottom,
                right: right,
                opacity: show ? 1 : 0
            }}
            name="upcircle"
            size={50}
            color={Colors.RED2}
            onPress={_scrollToTop}
        />
    );
}

const style = StyleSheet.create({});

ScrollTop.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    bottom: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
}


export default ScrollTop;
