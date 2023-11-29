import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Image} from 'expo-image';
import {setDownloadingUpdateFlag, setUpdateFlag} from "../redux/slices/user.slice";

//todo : use server api

const useCheckUpdate = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            const checkUpdate = async () => {
                try {

                } catch (e) {
                }
            }
            checkUpdate();
        }
    }, []);

    async function downloadUpdate() {
        try {
            dispatch(setDownloadingUpdateFlag(true));
            dispatch(setDownloadingUpdateFlag(false));
            dispatch(setUpdateFlag(false));
            await Image.clearMemoryCache();
            await Image.clearDiskCache();
        } catch (e) {
            dispatch(setUpdateFlag(false));
            dispatch(setDownloadingUpdateFlag(false));
        }
    }

    return {downloadUpdate};
}


export default useCheckUpdate;
