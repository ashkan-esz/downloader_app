import React, {useRef} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';


const DoubleTap = ({extraStyle, activeOpacity, children, onTap, onDoubleTap, doublePressDelay}) => {
    const lastTap = useRef(null);
    const tabCount = useRef(0);

    const _handleDoubleTap = () => {
        const now = Date.now();
        const delay = now - lastTap.current;
        const DOUBLE_PRESS_DELAY = doublePressDelay || 200;
        if (lastTap.current && delay < DOUBLE_PRESS_DELAY) {
            onDoubleTap();
            tabCount.current = 0;
        } else {
            lastTap.current = now;
            tabCount.current = (tabCount.current + 1);
            setTimeout(() => {
                if (tabCount.current === 1) {
                    onTap && onTap();
                }
                tabCount.current = 0;
            }, DOUBLE_PRESS_DELAY);
        }
    }

    return (
        <TouchableOpacity
            style={extraStyle}
            activeOpacity={activeOpacity || 1}
            onPress={_handleDoubleTap}
        >
            {children}
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({});

DoubleTap.propTypes = {
    extraStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    activeOpacity: PropTypes.number,
    onTap: PropTypes.func,
    onDoubleTap: PropTypes.func.isRequired,
    doublePressDelay: PropTypes.number,
}


export default DoubleTap;

