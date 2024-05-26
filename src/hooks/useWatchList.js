import {useCallback, useEffect, useRef, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import useIsMounted from './useIsMounted';
import * as userStatsApi from "../api/userStatsApi";
import {showToastMessage} from "../utils";


const useWatchList = (movieId, watchListCount, watchList) => {
    const queryClient = useQueryClient();
    const [isWatchListLoading, setIsWatchListLoading] = useState(false);
    const isMounted = useIsMounted();

    const prevState = useRef({
        watchlist: false,
        watchlist_count: 0,
    });

    useEffect(() => {
        prevState.current.watchlist = watchList;
        prevState.current.watchlist_count = watchListCount;
    }, [movieId, watchList]);

    const updateCachedDataArray = (dataArray, newWatchListState, newWatchListCount) => {
        let updated = false;
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]._id.toString() === movieId.toString() && dataArray[i].userStats) {
                dataArray[i].userStats.watchlist = newWatchListState;
                dataArray[i].userStats.watchlist_count = newWatchListCount;
                updated = true;
            }
        }
        return updated;
    }

    const updateCachedData = async (newWatchListState, newWatchListCount) => {
        queryClient.setQueriesData({type: 'active', stale: false, queryKey: ['movie']}, oldData => {
            let updated = false;
            try {
                if (Array.isArray(oldData)) {
                    updated = updateCachedDataArray(oldData, newWatchListState, newWatchListCount);
                    if (!updated) {
                        return undefined;
                    }
                    return oldData;
                } else if (typeof oldData === 'object') {
                    if (oldData.pages && Array.isArray(oldData.pages)) {
                        for (let i = 0; i < oldData.pages.length; i++) {
                            if (oldData.pages[i].movies) {
                                updated = updateCachedDataArray(oldData.pages[i].movies, newWatchListState, newWatchListCount) || updated;
                                updated = updateCachedDataArray(oldData.pages[i].staff, newWatchListState, newWatchListCount) || updated;
                                updated = updateCachedDataArray(oldData.pages[i].characters, newWatchListState, newWatchListCount) || updated;
                            } else {
                                updated = updateCachedDataArray(oldData.pages[i], newWatchListState, newWatchListCount) || updated;
                            }
                        }
                        return oldData;
                    }
                    if (oldData.inTheaters) {
                        updated = updateCachedDataArray(oldData.inTheaters, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData.comingSoon) {
                        updated = updateCachedDataArray(oldData.comingSoon, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData.news) {
                        updated = updateCachedDataArray(oldData.news, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData.update) {
                        updated = updateCachedDataArray(oldData.update, newWatchListState, newWatchListCount) || updated;
                    }
                    if (oldData._id && oldData._id.toString() === movieId.toString() && oldData.userStats) {
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

    const _onWatchList = useCallback(async (groupName = "default") => {
        const newWatchListState = !prevState.current.watchlist;
        const newWatchListCount = newWatchListState
            ? prevState.current.watchlist_count + 1
            : prevState.current.watchlist_count - 1;

        setIsWatchListLoading(true);
        await updateCachedData(
            newWatchListState,
            newWatchListCount,
        );

        let result = await userStatsApi.watchListMovieApi(movieId, {remove: !newWatchListState, groupName});
        if (result === 'ok' && isMounted.current) {
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
                prevState.current.watchlist,
                prevState.current.watchlist_count,
            );
        }
        setIsWatchListLoading(false);
    }, [movieId, prevState.current]);

    return {
        _onWatchList,
        isWatchListLoading,
    }
}

export default useWatchList;
