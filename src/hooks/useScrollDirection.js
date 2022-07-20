import {useRef, useState} from "react";
import {LayoutAnimation} from "react-native";
import {Mixins} from "../styles";

const useScrollDirection = () => {
    const scrollPosition = useRef(0);
    const [scrollDirection, setScrollDirection] = useState('');

    const onScroll = (event) => {
        let newPosition = event.nativeEvent.contentOffset.y;
        let newDirection = scrollPosition.current < newPosition ? 'bottom' : 'top';
        let move = Math.abs(newPosition - scrollPosition.current);
        if (move > 20) {
            if (newPosition < Mixins.WINDOW_HEIGHT / 6) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setScrollDirection('');
            } else if (newDirection !== scrollDirection) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setScrollDirection(newDirection);
            }
            scrollPosition.current = newPosition;
        }
    }

    return {onScroll, scrollDirection};
}

export default useScrollDirection;
