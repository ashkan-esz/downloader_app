import {useCallback, useRef, useState} from "react";

const useScrollDirection = () => {
    const scrollPosition = useRef(0);
    const [scrollDirection, setScrollDirection] = useState('');

    const onScroll = useCallback((event) => {
        let newPosition = event.nativeEvent.contentOffset.y;
        let newDirection = scrollPosition.current < newPosition ? 'bottom' : 'top';
        let move = Math.abs(newPosition - scrollPosition.current);
        if (move > 20) {
            if (newPosition < 300) {
                setScrollDirection('');
            } else if (newDirection !== scrollDirection) {
                setScrollDirection(newDirection);
            }
            scrollPosition.current = newPosition;
        }
    }, [scrollDirection]);

    return {onScroll, scrollDirection};
}

export default useScrollDirection;
