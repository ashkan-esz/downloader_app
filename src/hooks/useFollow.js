import {useCallback, useEffect, useRef, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import useIsMounted from './useIsMounted';
import * as userStatsApi from "../api/userStatsApi";
import {showToastMessage} from "../utils";


const useFollow = (movieId, followedCount, follow, watchListCount, watchList) => {
    const queryClient = useQueryClient();
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const isMounted = useIsMounted();

    const prevState = useRef({
        follow: false,
        followCount: 0,
        watchlist: false,
        watchlist_count: 0,
    });

    useEffect(() => {
        prevState.current.follow = follow;
        prevState.current.followCount = followedCount;
        prevState.current.watchlist = watchList;
        prevState.current.watchlist_count = watchListCount;
    }, [movieId, follow, watchList]);

    const updateCachedDataArray = (dataArray, newFollowState, newFollowCount, newWatchListState, newWatchListCount) => {
        let updated = false;
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]._id.toString() === movieId.toString() && dataArray[i].userStats) {
                dataArray[i].userStats.follow = newFollowState;
                dataArray[i].userStats.follow_count = newFollowCount;
                dataArray[i].userStats.watchlist = newWatchListState;
                dataArray[i].userStats.watchlist_count = newWatchListCount;
                updated = true;
            }
        }
        return updated;
    }

    const updateCachedData = async (newFollowState, newFollowCount, newWatchListState, newWatchListCount) => {
        queryClient.setQueriesData({type: 'active', stale: false, queryKey: ['movie']}, oldData => {
            let updated = false;
            try {
                if (Array.isArray(oldData)) {
                    updated = updateCachedDataArray(oldData, newFollowState, newFollowCount, newWatchListState, newWatchListCount);
                    if (!updated) {
                        return undefined;
                    }
                    return oldData;
                } else if (typeof oldData === 'object') {
                    if (oldData.pages && Array.isArray(oldData.pages)) {
                        for (let i = 0; i < oldData.pages.length; i++) {
                            if (oldData.pages[i].movies) {
                                updated = updateCachedDataArray(oldData.pages[i].movies, newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                                updated = updateCachedDataArray(oldData.pages[i].staff, newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                                updated = updateCachedDataArray(oldData.pages[i].characters, newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                            } else {
                                updated = updateCachedDataArray(oldData.pages[i], newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                            }
                        }
                        return oldData;
                    }
                    if (oldData.inTheaters) {
                        updated = updateCachedDataArray(oldData.inTheaters, newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData.comingSoon) {
                        updated = updateCachedDataArray(oldData.comingSoon, newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData.news) {
                        updated = updateCachedDataArray(oldData.news, newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData.update) {
                        updated = updateCachedDataArray(oldData.update, newFollowState, newFollowCount, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData._id && oldData._id.toString() === movieId.toString() && oldData.userStats) {
                        oldData.userStats.follow = newFollowState;
                        oldData.userStats.follow_count = newFollowCount;
                        oldData.userStats.watchlist = newWatchListState;
                        oldData.userStats.watchlist_count = newWatchListCount;
                        updated = true;
                    }
                }
            } catch (error) {
            }
            if (!updated) {
                return undefined;
            }
            return oldData;
        });
    }

    const _onFollow = useCallback(async () => {
        const newFollowState = !prevState.current.follow;
        const newFollowCount = newFollowState
            ? prevState.current.followCount + 1
            : prevState.current.followCount - 1;

        const newWatchListState = false;
        const newWatchListCount = prevState.current.watchlist
            ? prevState.current.watchlist_count - 1
            : prevState.current.watchlist_count;

        setIsFollowLoading(true);
        await updateCachedData(
            newFollowState,
            newFollowCount,
            newWatchListState,
            newWatchListCount,
        );

        let result = await userStatsApi.followMovieApi(movieId, {remove: !newFollowState});
        if (result === 'ok' && isMounted.current) {
            prevState.current.follow = newFollowState;
            prevState.current.followCount = newFollowCount;
            prevState.current.watchlist = newWatchListState;
            prevState.current.watchlist_count = newWatchListCount;
        } else if (result === 'error' && isMounted.current) {
            showToastMessage({
                type: 'message',
                text1: "couldn't refresh feed",
                position: 'bottom',
                visibilityTime: 2000,
            });
            await updateCachedData(
                prevState.current.follow,
                prevState.current.followCount,
                prevState.current.watchlist,
                prevState.current.watchlist_count,
            );
        }
        setIsFollowLoading(false);
    }, [movieId, prevState.current]);

    return {
        _onFollow,
        isFollowLoading,
    }
}

export default useFollow;
