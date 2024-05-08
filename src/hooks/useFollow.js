import {useCallback, useEffect, useRef, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import useIsMounted from './useIsMounted';
import * as userStatsApi from "../api/userStatsApi";
import Toast from 'react-native-toast-message';


const useFollow = (movieId, FollowedCount, follow, activeFlag = true) => {
    const queryClient = useQueryClient();
    const [isFollowed, setIsFollowed] = useState(follow);
    const isMounted = useIsMounted();

    const prevState = useRef({
        isFollowed: false,
        followCount: 0,
    });

    useEffect(() => {
        if (activeFlag) {
            prevState.current.isFollowed = follow;
            prevState.current.followCount = FollowedCount;
        }
    }, [activeFlag]);

    // console.log(movieId, typeof movieId);

    useEffect(() => {
        setIsFollowed(follow);
    }, [movieId, follow]);

    const updateCachedDataArray = (dataArray, newFollowState, newFollowCount) => {
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]._id.toString() === movieId.toString()) {
                dataArray[i].userStats.follow = newFollowState;
                dataArray[i].userStats.follow_count = newFollowCount;
            }
        }
    }

    const updateCachedData = async (newFollowState, newFollowCount) => {
        queryClient.setQueriesData({type: 'active', stale: false}, oldData => {
            try {
                if (Array.isArray(oldData)) {
                    updateCachedDataArray(oldData, newFollowState, newFollowCount);
                    return oldData;
                } else if (typeof oldData === 'object') {
                    if (oldData.pages && Array.isArray(oldData.pages)) {
                        for (let i = 0; i < oldData.pages.length; i++) {
                            if (oldData.pages[i].movies) {
                                updateCachedDataArray(oldData.pages[i].movies, newFollowState, newFollowCount);
                                updateCachedDataArray(oldData.pages[i].staff, newFollowState, newFollowCount);
                                updateCachedDataArray(oldData.pages[i].characters, newFollowState, newFollowCount);
                            } else {
                                updateCachedDataArray(oldData.pages[i], newFollowState, newFollowCount);
                            }
                        }
                        return oldData;
                    }
                    if (oldData.inTheaters) {
                        updateCachedDataArray(oldData.inTheaters, newFollowState, newFollowCount);
                    }
                    if (oldData.comingSoon) {
                        updateCachedDataArray(oldData.comingSoon, newFollowState, newFollowCount);
                    }
                    if (oldData.news) {
                        updateCachedDataArray(oldData.news, newFollowState, newFollowCount);
                    }
                    if (oldData.update) {
                        updateCachedDataArray(oldData.update, newFollowState, newFollowCount);
                    }
                    if (oldData._id && oldData._id.toString() === movieId.toString()) {
                        oldData.userStats.follow = newFollowState;
                        oldData.userStats.follow_count = newFollowCount;
                    }
                }
            } catch (error) {
            }
            return oldData;
        });
    }

    const _onFollow = async () => {
        if (!activeFlag) {
            return;
        }

        const followState = isFollowed;
        setIsFollowed(!followState);
        await updateCachedData(
            !followState,
            !followState ? FollowedCount + 1 : FollowedCount - 1,
        );

        let result = await userStatsApi.likeOrDislikeApi('movies', movieId, 'follow', followState);
        if (result === 'ok' && isMounted.current) {
            //todo : fix
            prevState.current.isLike = !followState;
            prevState.current.likeNumber = !followState ? FollowedCount + 1 : FollowedCount - 1;
        }
        if (result === 'error' && isMounted.current) {
            showToast();
            await updateCachedData(
                prevState.current.isFollowed,
                prevState.current.followCount,
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
        _onFollow,
        isFollowed,
    }
}

export default useFollow;
