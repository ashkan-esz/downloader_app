import {useEffect, useState} from "react";
import {useQueryClient} from "react-query";
import useIsMounted from './useIsMounted';
import {likeOrDislikeApi} from "../api";

const useLikeOrDislike = (movieId, likesCount, dislikesCount, likeOrDislike, activeFlag = true) => {
    const queryClient = useQueryClient();
    const [isLike, setIsLike] = useState(likeOrDislike === 'like');
    const [isDisLike, setIsDisLike] = useState(likeOrDislike === 'dislike');
    const isMounted = useIsMounted();

    useEffect(() => {
        setIsLike(likeOrDislike === 'like');
        setIsDisLike(likeOrDislike === 'dislike');
    }, [likeOrDislike]);

    const updateCachedDataArray = (dataArray, newLikeOrDislike, newLikesCount, newDisLikesCount) => {
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]._id.toString() === movieId.toString()) {
                dataArray[i].likeOrDislike = newLikeOrDislike;
                dataArray[i].likesCount = newLikesCount;
                dataArray[i].dislikesCount = newDisLikesCount;
            }
        }
    }

    const updateCachedData = async (newLikeOrDislike, newLikesCount, newDisLikesCount) => {
        await queryClient.setQueriesData({active: true, stale: false}, oldData => {
            try {
                if (Array.isArray(oldData)) {
                    updateCachedDataArray(oldData, newLikeOrDislike, newLikesCount, newDisLikesCount);
                    return oldData;
                } else if (typeof oldData === 'object') {
                    if (oldData.pages && Array.isArray(oldData.pages)) {
                        for (let i = 0; i < oldData.pages.length; i++) {
                            if (oldData.pages[i].movies) {
                                updateCachedDataArray(oldData.pages[i].movies, newLikeOrDislike, newLikesCount, newDisLikesCount);
                                updateCachedDataArray(oldData.pages[i].staff, newLikeOrDislike, newLikesCount, newDisLikesCount);
                                updateCachedDataArray(oldData.pages[i].characters, newLikeOrDislike, newLikesCount, newDisLikesCount);
                            } else {
                                updateCachedDataArray(oldData.pages[i], newLikeOrDislike, newLikesCount, newDisLikesCount);
                            }
                        }
                        return oldData;
                    }
                    if (oldData.inTheaters) {
                        updateCachedDataArray(oldData.inTheaters, newLikeOrDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData.comingSoon) {
                        updateCachedDataArray(oldData.comingSoon, newLikeOrDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData.news) {
                        updateCachedDataArray(oldData.news, newLikeOrDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData.update) {
                        updateCachedDataArray(oldData.update, newLikeOrDislike, newLikesCount, newDisLikesCount);
                    }
                    if (oldData._id && oldData._id.toString() === movieId.toString()) {
                        oldData.likeOrDislike = newLikeOrDislike;
                        oldData.likesCount = newLikesCount;
                        oldData.dislikesCount = newDisLikesCount;
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
        const saveLikeNumber = likesCount;
        const saveDislikeNumber = dislikesCount;
        setIsLike(!saveIsLike);
        await updateCachedData(
            !saveIsLike ? 'like' : '',
            !saveIsLike ? likesCount + 1 : likesCount - 1,
            !saveIsLike && isDisLike ? dislikesCount - 1 : dislikesCount,
        );

        let result = await likeOrDislikeApi('movies', movieId, 'like', saveIsLike);
        if (result === 'error' && isMounted.current) {
            await updateCachedData(
                saveIsLike ? 'like' : isDisLike ? 'dislike' : '',
                saveLikeNumber,
                saveDislikeNumber,
            );
        }
    }

    const _onDisLike = async () => {
        if (!activeFlag) {
            return;
        }
        const saveIsDislike = isDisLike;
        const saveLikeNumber = likesCount;
        const saveDislikeNumber = dislikesCount;
        setIsDisLike(!saveIsDislike);
        await updateCachedData(
            !saveIsDislike ? 'dislike' : '',
            !saveIsDislike && isLike ? likesCount - 1 : likesCount,
            !saveIsDislike ? dislikesCount + 1 : dislikesCount - 1,
        );

        let result = await likeOrDislikeApi('movies', movieId, 'dislike', saveIsDislike);
        if (result === 'error' && isMounted.current) {
            await updateCachedData(
                saveIsDislike ? 'dislike' : isLike ? 'like' : '',
                saveLikeNumber,
                saveDislikeNumber,
            );
        }
    }

    return {
        _onLike,
        _onDisLike,
        isLike,
        isDisLike
    }
}

export default useLikeOrDislike;
