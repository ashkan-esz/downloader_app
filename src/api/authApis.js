import {CHAT_API} from "./index";


export const authEndpoints_all = [
    '/v1/user/login?noCookie=true',
    '/v1/user/signup?noCookie=true',
    '/v1/user/getToken?noCookie=true',
    '/v1/user/logout?noCookie=true'
];
export const authEndpoints = [
    '/v1/user/login?noCookie=true',
    '/v1/user/signup?noCookie=true',
    '/v1/user/getToken?noCookie=true',
];

export const tokenEndPoint = '/v1/user/getToken?noCookie=true';

//---------------------------------------------------------------
//---------------------------------------------------------------

export const loginApi = async (data) => {
    try {
        const response = await CHAT_API.post('/v1/user/login?noCookie=true', data);
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage) {
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const signupApi = async (data) => {
    try {
        const response = await CHAT_API.post('/v1/user/signup?noCookie=true', data);
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage) {
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const getTokenApi = async ({profileImages = false}) => {
    try {
        const response = await CHAT_API.put(tokenEndPoint, {
        },{
            params:{
                profileImages: profileImages,
                noCookie: true,
            }
        });
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage) {
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const logoutApi = async () => {
    try {
        const response = await CHAT_API.put('/v1/user/logout?noCookie=true');
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage || error.response && error.response.status === 403) {
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const forceLogoutApi = async (deviceId) => {
    try {
        const response = await CHAT_API.put(`/v1/user/forceLogout/${deviceId}`);
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage || error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (!error.response.data || !error.response.data.errorMessage) {
                error.response.data = {errorMessage: 'unknown error'};
            }
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const forceLogoutAllApi = async () => {
    try {
        const response = await CHAT_API.put('/v1/user/forceLogoutAll');
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage || error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (!error.response.data || !error.response.data.errorMessage) {
                error.response.data = {errorMessage: 'unknown error'};
            }
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const getActiveSessionsApi = async () => {
    try {
        const response = await CHAT_API.get('/v1/user/activeSessions');
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

export const sendVerifyEmailApi = async () => {
    try {
        const response = await CHAT_API.get('/v1/user/sendVerifyEmail');
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