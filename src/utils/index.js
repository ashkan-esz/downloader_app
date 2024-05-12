import Toast from "react-native-toast-message";

export function showToast({type = 'error', text, position = 'bottom', time = 1000}) {
    Toast.show({
        type: type,
        text1: text,
        position: position,
        onPress: () => {
            Toast.hide();
        },
        visibilityTime: time,
    });
}


export function showToastMessage({text1, position = "bottom", visibilityTime = 2000})  {
    //todo : global function
    //todo : re design
    Toast.show({
        type: "message",
        text1: text1,
        position: position,
        onPress: () => {
            Toast.hide();
        },
        visibilityTime: visibilityTime,
    });
}

export const movieTypes = Object.freeze({
    movie: "movie",
    serial: "serial",
    anime_movie: "anime_movie",
    anime_serial: "anime_serial",
    all: Object.freeze(['movie', 'serial', 'anime_movie', 'anime_serial']),
});

export const moviesDataLevel = Object.freeze({
    low: "low",
    medium: "medium",
    info: "info",
    high: "high",
    dlink: "dlink",
});