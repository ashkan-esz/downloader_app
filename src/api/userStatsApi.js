import API from "./index";

export const likeDislikeMovieApi = async (movieId, type = "like_movie", remove = false) => {
    try {
        let url = `/movies/addUserStats/likeOrDislike/${type}/${movieId}`;
        let response = await API.put(url, null, {
            params: {
                remove: remove,
            }
        });
        return 'ok';
    } catch (error) {
        if (error.response && error.response.status === 409) {
            return 'ok'; //already liked
        }
        return 'error';
    }
}


export const followMovieApi = async (movieId, {remove = false, score = 0, watch_season = 1, watch_episode = 0}) => {
    try {
        let url = `/movies/addUserStats/follow_movie/${movieId}`;
        let response = await API.put(url, null, {
            params: {
                remove: remove,
                score: score,
                watch_season: watch_season,
                watch_episode: watch_episode,
            }
        });
        return 'ok';
    } catch (error) {
        if (error.response && error.response.status === 409) {
            return 'ok'; //already liked
        }
        return 'error';
    }
}

