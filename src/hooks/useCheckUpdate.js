import {useEffect, useState} from "react";
import * as Updates from "expo-updates";

const useCheckUpdate = () => {
    const [update, setUpdate] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            const checkUpdate = async () => {
                try {
                    const updateResult = await Updates.checkForUpdateAsync();
                    if (updateResult.isAvailable) {
                        setUpdate(true);
                    }
                } catch (e) {
                }
            }
            setTimeout(() => {
                checkUpdate();
            }, 500);
        }
    }, []);

    async function downloadUpdate() {
        try {
            setIsDownloading(true);
            await Updates.fetchUpdateAsync();
            setIsDownloading(false);
            await Updates.reloadAsync();
            await Updates.clearUpdateCacheExperimentalAsync();
        } catch (e) {
            setIsDownloading(false);
            setUpdate(false);
        }
    }

    return {update, isDownloading, downloadUpdate};
}

export default useCheckUpdate;
