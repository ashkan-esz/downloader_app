import {useEffect, useState} from "react";

const useDebounce = (value, delay, excludeValue = '') => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
        () => {
            if (value === excludeValue) {
                setDebouncedValue(value);
            } else {
                const handler = setTimeout(() => {
                    setDebouncedValue(value);
                }, delay);
                return () => {
                    clearTimeout(handler);
                };
            }
        }, [value]);
    return debouncedValue;
}

export default useDebounce;
