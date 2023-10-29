import {Dimensions, PixelRatio} from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
const guidelineBaseWidth = 375;

export function getWindowWidth(percent) {
    return WINDOW_WIDTH * percent / 100;
}

export function getWindowHeight(percent) {
    return WINDOW_HEIGHT * percent / 100;
}

export const scaleSize = size => (WINDOW_WIDTH / guidelineBaseWidth) * size;

export const scaleFont = size => size * PixelRatio.getFontScale();

export function dimensions(property, top, right = top, bottom = top, left = right) {
    let styles = {};
    styles[`${property}Top`] = top;
    styles[`${property}Right`] = right;
    styles[`${property}Bottom`] = bottom;
    styles[`${property}Left`] = left;
    return styles;
}


export function margin(top, right, bottom, left) {
    return dimensions('margin', top, right, bottom, left);
}

export function padding(top, right, bottom, left) {
    return dimensions('padding', top, right, bottom, left);
}

export function boxShadow(color, offset = {height: 2, width: 2},
                          radius = 8, opacity = 0.2) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}
