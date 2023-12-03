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