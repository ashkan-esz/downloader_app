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


export function showToastMessage({text1, position = "bottom", visibilityTime = 2000}) {
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

export function getElapsedTime(startTime) {
    let timeDiff = (Date.now() - startTime.getTime()) / 1000;

    let seconds = Math.floor(timeDiff % 60);
    let secondsAsString = seconds < 10 ? "0" + seconds : seconds + "";

    timeDiff = Math.floor(timeDiff / 60);
    let minutes = timeDiff % 60;
    let minutesAsString = minutes < 10 ? "0" + minutes : minutes + "";

    timeDiff = Math.floor(timeDiff / 60);
    let hours = timeDiff % 24;

    timeDiff = Math.floor(timeDiff / 24);
    let days = timeDiff;
    let totalHours = hours + (days * 24);
    let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours + "";

    let hourMinuteFormat = totalHoursAsString === "00"
        ? minutesAsString + ":" + secondsAsString
        : totalHoursAsString + ":" + minutesAsString + ":" + secondsAsString;

    let highestUnit = days > 0 ? days + " Days ago"
        : hours > 0 ? hours + " Hour ago" : minutes > 0 ? minutes + " Min ago" : "Just now";
    return {
        hourMinuteFormat,
        highestUnit,
        seconds,
        minutes,
        hours,
        days,
    }
}