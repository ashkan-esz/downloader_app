import {CHAT_API} from "./index";

export const getProfileDataApi = async ({
                                            userId = null,
                                            loadProfileImages = false,
                                            loadDevice = false,
                                            loadFollowersCount = false,
                                            loadSettings = false,
                                            loadComputedFavoriteGenres = false,
                                        }) => {
    try {
        const response = await CHAT_API.get('/v1/user/profile', {
            params: {
                userId: userId,
                loadProfileImages: loadProfileImages,
                loadDevice: loadDevice,
                loadFollowersCount: loadFollowersCount,
                loadSettings: loadSettings,
                loadComputedFavoriteGenres: loadComputedFavoriteGenres,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response.data.errorMessage) {
            return error.response.data.errorMessage;
        }
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'unknown error';
        }
        return error.response.data;
    }
}
