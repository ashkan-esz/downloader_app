import {useCallback, useEffect, useRef, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import useIsMounted from './useIsMounted';
import {likeOrDislikeApi} from "../api";
import Toast from 'react-native-toast-message';


const useLikeOrDislike = (movieId, likesCount, dislikesCount, like, dislike, activeFlag = true) => {
    const queryClient = useQueryClient();
    const [isLike, setIsLike] = useState(like);
    const [isDisLike, setIsDisLike] = useState(dislike);
    const isMounted = useIsMounted();

    const prevState = useRef({
        isLike: false,
        isDislike: false,
        likeNumber: 0,
        dislikeNumber: 0,
    });

    useEffect(() => {
        if (activeFlag) {
            prevState.current.isLike = like;
            prevState.current.isDislike = dislike;
            prevState.current.likeNumber = likesCount;
            prevState.current.dislikeNumber = dislikesCount;
        }
    }, [activeFlag]);

    useEffect(() => {
        setIsLike(like);
        setIsDisLike(dislike);
    }, [like, dislike]);

    const updateCachedDataArray = (dataArray, newLike, newDislike, newLikesCount, newDisLikesCount) => {
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]._id.toString() === movieId.toString()) {
                dataArray[i].userStats.like_movie = newLike;
                dataArray[i].userStats.dislike_movie = newDislike;
                dataArray[i].userStats.like_movie_count = newLikesCount;
                dataArray[i].userStats.dislike_movie_count = newDisLikesCount;
            }
        }
    }

    const updateCachedData = async (newLike, newDislike, newLikesCount, newDisLikesCount) => {
        await queryClient.setQueriesData({type: 'active', stale: false}, oldData => {
            try {
                if (Array.isArray(oldData)) {
                    updateCachedDataArray(oldData, newLike, newDislike, newLikesCount, newDisLikesCount);
                    return oldData;
                } else if (typeof oldData === 'object') {
                    if (oldData.pages && Array.isArray(oldData.pages)) {
                        for (let i = 0; i < oldData.pages.length; i++) {
                            if (oldData.pages[i].movies) {
                                updateCachedDataArray(oldData.pages[i].movies, newLike, newDislike, newLikesCount, newDisLikesCount);
                                updateCachedDataArray(oldData.pages[i].staff, newLike, newDislike, newLikesCount, newDisLikesCount);
                                updateCachedDataArray(oldData.pages[i].characters, newLike, newDislike, newLikesCount, newDisLikesCount);
                            } else {
                                updateCachedDataArray(oldData.pages[i], newLike, newDislike, newLikesCount, newDisLikesCount);
                            }
                        }
                        return oldData;
                    }
                    if (oldData.inTheaters) {
                        updateCachedDataArray(oldData.inTheaters, newLike, newDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData.comingSoon) {
                        updateCachedDataArray(oldData.comingSoon, newLike, newDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData.news) {
                        updateCachedDataArray(oldData.news, newLike, newDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData.update) {
                        updateCachedDataArray(oldData.update, newLike, newDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData._id && oldData._id.toString() === movieId.toString()) {
                        oldData.userStats.like_movie = newLike;
                        oldData.userStats.dislike_movie = newDislike;
                        oldData.userStats.like_movie_count = newLikesCount;
                        oldData.userStats.dislike_movie_count = newDisLikesCount;
                    }
                }
            } catch (error) {
            }
            return oldData;
        });
    }

    const _onLike = async () => {
        if (!activeFlag) {
            return;
        }
        const saveIsLike = isLike;
        const saveIsDislike = isDisLike;
        setIsLike(!saveIsLike);
        if (saveIsDislike) {
            setIsDisLike(!saveIsDislike);
        }
        await updateCachedData(
            !saveIsLike,
            false,
            !saveIsLike ? likesCount + 1 : likesCount - 1,
            !saveIsLike && saveIsDislike ? dislikesCount - 1 : dislikesCount,
        );

        let result = await likeOrDislikeApi('movies', movieId, 'like', saveIsLike);
        if (result === 'ok' && isMounted.current) {
            prevState.current.isLike = !saveIsLike;
            prevState.current.isDislike = false;
            prevState.current.likeNumber = !saveIsLike ? likesCount + 1 : likesCount - 1;
            prevState.current.dislikeNumber = !saveIsLike && saveIsDislike ? dislikesCount - 1 : dislikesCount;
        }
        if (result === 'error' && isMounted.current) {
            showToast();
            await updateCachedData(
                prevState.current.isLike,
                prevState.current.isDislike,
                prevState.current.likeNumber,
                prevState.current.dislikeNumber,
            );
        }
    }

    const _onDisLike = async () => {
        if (!activeFlag) {
            return;
        }
        const saveIsLike = isLike;
        const saveIsDislike = isDisLike;
        setIsDisLike(!saveIsDislike);
        if (saveIsLike) {
            setIsLike(!saveIsLike);
        }
        await updateCachedData(
            false,
            !saveIsDislike,
            !saveIsDislike && saveIsLike ? likesCount - 1 : likesCount,
            !saveIsDislike ? dislikesCount + 1 : dislikesCount - 1,
        );

        let result = await likeOrDislikeApi('movies', movieId, 'dislike', saveIsDislike);
        if (result === 'ok' && isMounted.current) {
            prevState.current.isLike = false;
            prevState.current.isDislike = !saveIsDislike;
            prevState.current.likeNumber = !saveIsDislike && saveIsLike ? likesCount - 1 : likesCount;
            prevState.current.dislikeNumber = !saveIsDislike ? dislikesCount + 1 : dislikesCount - 1;
        }
        if (result === 'error' && isMounted.current) {
            showToast();
            await updateCachedData(
                prevState.current.isLike,
                prevState.current.isDislike,
                prevState.current.likeNumber,
                prevState.current.dislikeNumber,
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
        _onLike,
        _onDisLike,
        isLike,
        isDisLike
    }
}

export default useLikeOrDislike;
