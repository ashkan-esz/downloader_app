import React, {useEffect} from 'react';
import {Platform, StyleSheet, UIManager} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import {Colors} from '../../styles';
import PropTypes from 'prop-types';


const ScrollTop = ({extraStyle, show, flatListRef, extraMarginBottom}) => {

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);
    
    const _scrollToTop = () => {
        if (flatListRef && flatListRef.current) {
            flatListRef.current.scrollToOffset({animated: true, offset: 0});
        }
    }

    return (
        show && <AntDesign
            style={[style.icon, extraStyle, {
                bottom: 50 + (extraMarginBottom | 0)
            }]}
            name="upcircle"
            size={55}
            color={Colors.GRAY_DARK}
            onPress={_scrollToTop}
            delayPressIn={0}
            onPressIn={_scrollToTop}
            hitSlop={5}
        />
    );
}

const style = StyleSheet.create({
    icon: {
        position: 'absolute',
        bottom: 50,
        right: 10,
        zIndex: 10,
    }
});

ScrollTop.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    extraStyle: PropTypes.object,
    extraMarginBottom: PropTypes.number,
}


export default ScrollTop;
