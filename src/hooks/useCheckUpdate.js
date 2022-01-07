import {useEffect} from "react";
import * as Updates from "expo-updates";
import {useDispatch} from "react-redux";
import FastImage from "react-native-fast-image";
import {setDownloadingUpdateFlag, setUpdateFlag} from "../redux/slices/user.slice";


const useCheckUpdate = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            const checkUpdate = async () => {
                try {
                    const updateResult = await Updates.checkForUpdateAsync();
                    if (updateResult.isAvailable) {
                        dispatch(setUpdateFlag(true));
                    }
                } catch (e) {
                }
            }
            checkUpdate();
        }
    }, []);

    async function downloadUpdate() {
        try {
            dispatch(setDownloadingUpdateFlag(true));
            await Updates.fetchUpdateAsync();
            dispatch(setDownloadingUpdateFlag(false));
            dispatch(setUpdateFlag(false));
            await Updates.clearUpdateCacheExperimentalAsync();
            await FastImage.clearMemoryCache();
            await FastImage.clearDiskCache();
            await Updates.reloadAsync();
        } catch (e) {
            dispatch(setUpdateFlag(false));
            dispatch(setDownloadingUpdateFlag(false));
        }
    }

    return {downloadUpdate};
}


export default useCheckUpdate;
