import {useCallback, useEffect, useRef, useState} from "react";
import {useQueryClient} from "react-query";
import useIsMounted from './useIsMounted';
import {likeOrDislikeApi} from "../api";
import Toast from 'react-native-toast-message';


const useLikeOrDislike = (movieId, savedCount, save, activeFlag = true) => {
    const queryClient = useQueryClient();
    const [isSaved, setIsSaved] = useState(save);
    const isMounted = useIsMounted();

    const prevState = useRef({
        isSaved: false,
        savedCount: 0,
    });

    useEffect(() => {
        if (activeFlag) {
            prevState.current.isSaved = save;
            prevState.current.savedCount = savedCount;
        }
    }, [activeFlag]);

    useEffect(() => {
        setIsSaved(save);
    }, [save]);

    const updateCachedDataArray = (dataArray, newSaveState, newSavedCount) => {
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]._id.toString() === movieId.toString()) {
                dataArray[i].userStats.save = newSaveState;
                dataArray[i].userStats.save_count = newSavedCount;
            }
        }
    }

    const updateCachedData = async (newSaveState, newSavedCount) => {
        await queryClient.setQueriesData({active: true, stale: false}, oldData => {
            try {
                if (Array.isArray(oldData)) {
                    updateCachedDataArray(oldData, newSaveState, newSavedCount);
                    return oldData;
                } else if (typeof oldData === 'object') {
                    if (oldData.pages && Array.isArray(oldData.pages)) {
                        for (let i = 0; i < oldData.pages.length; i++) {
                            if (oldData.pages[i].movies) {
                                updateCachedDataArray(oldData.pages[i].movies, newSaveState, newSavedCount);
                                updateCachedDataArray(oldData.pages[i].staff, newSaveState, newSavedCount);
                                updateCachedDataArray(oldData.pages[i].characters, newSaveState, newSavedCount);
                            } else {
                                updateCachedDataArray(oldData.pages[i], newSaveState, newSavedCount);
                            }
                        }
                        return oldData;
                    }
                    if (oldData.inTheaters) {
                        updateCachedDataArray(oldData.inTheaters, newSaveState, newSavedCount);
                    }
                    if (oldData.comingSoon) {
                        updateCachedDataArray(oldData.comingSoon, newSaveState, newSavedCount);
                    }
                    if (oldData.news) {
                        updateCachedDataArray(oldData.news, newSaveState, newSavedCount);
                    }
                    if (oldData.update) {
                        updateCachedDataArray(oldData.update, newSaveState, newSavedCount);
                    }
                    if (oldData._id && oldData._id.toString() === movieId.toString()) {
                        oldData.userStats.save = newSaveState;
                        oldData.userStats.save_count = newSavedCount;
                    }
                }
            } catch (error) {
            }
            return oldData;
        });
    }

    const _onSave = async () => {
        if (!activeFlag) {
            return;
        }

        const saveState = isSaved;
        setIsSaved(!saveState);
        await updateCachedData(
            !saveState,
            !saveState ? savedCount + 1 : savedCount - 1,
        );

        let result = await likeOrDislikeApi('movies', movieId, 'save', saveState);
        if (result === 'ok' && isMounted.current) {
            prevState.current.isLike = !saveState;
            prevState.current.likeNumber = !saveState ? savedCount + 1 : savedCount - 1;
        }
        if (result === 'error' && isMounted.current) {
            showToast();
            await updateCachedData(
                prevState.current.isSaved,
                prevState.current.savedCount
            );
        }
    }

    const showToast = useCallback(() => {
        Toast.show({
            type: 'message',
            text1: "couldn't refresh feed",
            position: 'bottom',
            onPress: () => {
                Toast.hide();
            },
            visibilityTime: 2000,
        });
    }, []);

    return {
        _onSave,
        isSaved,
    }
}

export default useLikeOrDislike;
