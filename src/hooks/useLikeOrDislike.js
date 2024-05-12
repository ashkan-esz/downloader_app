import {useCallback, useEffect, useRef, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import useIsMounted from './useIsMounted';
import * as userStatsApi from "../api/userStatsApi";
import {showToastMessage} from "../utils";


const useLikeOrDislike = (movieId, likesCount, dislikesCount, like, dislike, updateCache = true) => {
    const queryClient = useQueryClient();
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isDislikeLoading, setIsDislikeLoading] = useState(false);
    const isMounted = useIsMounted();

    const prevState = useRef({
        isLike: false,
        isDislike: false,
        likesCount: 0,
        disLikesCount: 0,
    });

    useEffect(() => {
        prevState.current.isLike = like;
        prevState.current.isDislike = dislike;
        prevState.current.likesCount = likesCount;
        prevState.current.disLikesCount = dislikesCount;
    }, [movieId, like, dislike]);

    const updateCachedDataArray = (dataArray, newLike, newDislike, newLikesCount, newDisLikesCount) => {
        let updated = false;
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]._id.toString() === movieId.toString() && dataArray[i].userStats) {
                dataArray[i].userStats.like = newLike;
                dataArray[i].userStats.dislike = newDislike;
                dataArray[i].userStats.likes_count = newLikesCount;
                dataArray[i].userStats.dislikes_count = newDisLikesCount;
                updated = true;
            }
        }
        return updated;
    }

    const updateCachedData = async (newLike, newDislike, newLikesCount, newDisLikesCount) => {
        queryClient.setQueriesData({type: 'active', stale: false, queryKey: ['movie']}, oldData => {
            let updated = false;
            try {
                if (Array.isArray(oldData)) {
                    updated = updateCachedDataArray(oldData, newLike, newDislike, newLikesCount, newDisLikesCount);
                    if (!updated) {
                        return undefined;
                    }
                    return oldData;
                } else if (typeof oldData === 'object') {
                    if (oldData.pages && Array.isArray(oldData.pages)) {
                        for (let i = 0; i < oldData.pages.length; i++) {
                            if (oldData.pages[i].movies) {
                                updated = updateCachedDataArray(oldData.pages[i].movies, newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                                updated = updateCachedDataArray(oldData.pages[i].staff, newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                                updated = updateCachedDataArray(oldData.pages[i].characters, newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                            } else {
                                updated = updateCachedDataArray(oldData.pages[i], newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                            }
                        }
                        return oldData;
                    }
                    if (oldData.inTheaters) {
                        updated = updateCachedDataArray(oldData.inTheaters, newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                    }
                    if (oldData.comingSoon) {
                        updated = updateCachedDataArray(oldData.comingSoon, newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                    }
                    if (oldData.news) {
                        updated = updateCachedDataArray(oldData.news, newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                    }
                    if (oldData.update) {
                        updated = updateCachedDataArray(oldData.update, newLike, newDislike, newLikesCount, newDisLikesCount) || updated;
                    }
                    if (oldData._id && oldData._id.toString() === movieId.toString()) {
                        oldData.userStats.like = newLike;
                        oldData.userStats.dislike = newDislike;
                        oldData.userStats.likes_count = newLikesCount;
                        oldData.userStats.dislikes_count = newDisLikesCount;
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

    const _onLike = useCallback(async () => {
        const newLikeState = !prevState.current.isLike;
        const newLikesCount = newLikeState
            ? prevState.current.likesCount + 1
            : prevState.current.likesCount - 1;
        const newDisLikesCount = newLikeState && prevState.current.isDislike
            ? prevState.current.disLikesCount - 1
            : prevState.current.disLikesCount;

        setIsLikeLoading(true);
        if (updateCache) {
            await updateCachedData(
                newLikeState,
                false,
                newLikesCount,
                newDisLikesCount,
            );
        }

        let result = await userStatsApi.likeDislikeMovieApi(movieId, 'like_movie', !newLikeState);
        if (result === 'ok' && isMounted.current) {
            prevState.current.isLike = newLikeState;
            prevState.current.isDislike = false;
            prevState.current.likesCount = newLikesCount;
            prevState.current.disLikesCount = newDisLikesCount;
        }
        if (result === 'error' && isMounted.current) {
            showToastMessage({
                type: 'message',
                text1: "couldn't refresh feed",
                position: 'bottom',
                visibilityTime: 2000,
            });
            if (updateCache) {
                await updateCachedData(
                    prevState.current.isLike,
                    prevState.current.isDislike,
                    prevState.current.likesCount,
                    prevState.current.disLikesCount,
                );
            }

        }
        setIsLikeLoading(false);
    }, [movieId, prevState.current]);

    const _onDisLike = useCallback(async () => {
        const newDislikeState = !prevState.current.isDislike;
        const newLikesCount = newDislikeState && prevState.current.isLike
            ? prevState.current.likesCount - 1
            : prevState.current.likesCount;
        const newDisLikesCount = newDislikeState
            ? prevState.current.disLikesCount + 1
            : prevState.current.disLikesCount - 1;

        setIsDislikeLoading(true);
        if (updateCache) {
            await updateCachedData(
                false,
                newDislikeState,
                newLikesCount,
                newDisLikesCount,
            );
        }

        let result = await userStatsApi.likeDislikeMovieApi(movieId, 'dislike_movie', !newDislikeState);
        if (result === 'ok' && isMounted.current) {
            prevState.current.isLike = false;
            prevState.current.isDislike = newDislikeState;
            prevState.current.likesCount = newLikesCount;
            prevState.current.disLikesCount = newDisLikesCount;
        }
        if (result === 'error' && isMounted.current) {
            showToastMessage({
                type: 'message',
                text1: "couldn't refresh feed",
                position: 'bottom',
                visibilityTime: 2000,
            });
            if (updateCache) {
                await updateCachedData(
                    prevState.current.isLike,
                    prevState.current.isDislike,
                    prevState.current.likesCount,
                    prevState.current.disLikesCount,
                );
            }
        }
        setIsDislikeLoading(false);
    }, [movieId, prevState.current]);

    return {
        isLikeLoading,
        isDislikeLoading,
        _onLike,
        _onDisLike,
    }
}

export default useLikeOrDislike;
