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
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'error';
        }
        if (error.response.data.errorMessage) {
            return error.response.data.errorMessage;
        }
        return error.response.data;
    }
}

//------------------------------------------------
//------------------------------------------------

export const notificationEntityTypeIds = Object.freeze({
    user: 1,
    message: 2,
    movie: 3,
});

export const getNotification = async (skip, limit, {
    entityTypeId = 0,
    status = 0,
    autoUpdateStatus = false,
}) => {
    try {
        const response = await CHAT_API.get(`/v1/user/notifications/${skip}/${limit}`, {
            params: {
                entityTypeId: entityTypeId,
                status: status,
                autoUpdateStatus: autoUpdateStatus,
            },
        });
        return response.data.data;
    } catch (error) {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'error';
        }
        if (error.response.data.errorMessage) {
            // return error.response.data.errorMessage;
            return "error";
        }
        return error.response.data;
    }
}

export const batchUpdateNotificationStatus = async (id, {
    entityTypeId = 0,
    status = 2,
}) => {
    try {
        const response = await CHAT_API.put(`/v1/user/notifications/batchUpdateStatus/${id}/${entityTypeId}/${status}`);
        return response.data.data;
    } catch (error) {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'error';
        }
        if (error.response.data.errorMessage) {
            return error.response.data.errorMessage;
        }
        return error.response.data;
    }
}

//------------------------------------------------
//------------------------------------------------