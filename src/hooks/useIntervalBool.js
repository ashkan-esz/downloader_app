import {useEffect, useState} from "react";

const useIntervalBool = (delay = 2000) => {
    const [bool, setBool] = useState(false);

    useEffect(() => {
        const handler = setInterval(() => {
            setBool((prevState) => !prevState);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, []);

    return bool;
}

export default useIntervalBool;