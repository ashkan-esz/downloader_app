import axios from 'axios';
import {BASE_URL, BASE_URL_DEV} from '@env';

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? BASE_URL : BASE_URL_DEV,
});

export default API;

//except logout route
export const authEndpoints = ['/users/login?noCookie=true', '/users/signup?noCookie=true', '/users/getToken?noCookie=true'];
export const tokenEndPoint = '/users/getToken?noCookie=true';

//todo : do not print error on (401 | network) error and keep state as loading

//auth
export const loginApi = async (data) => {
    try {
        const response = await API.post('/users/login?noCookie=true', data);
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
        const response = await API.post('/users/signup?noCookie=true', data);
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
        const response = await API.post('/users/logout?noCookie=true');
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage || error.response && error.response.status === 403) {
            error.response.data.errorMessage = 'unknown error';
        }
        return error.response.data;
    }
}

export const getProfileDataApi = async () => {
    try {
        const response = await API.get('/users/profile');
        return response.data;
    } catch (error) {
        if (!error.response.data.errorMessage || error.response && (error.response.status === 403 || error.response.status === 401)) {
            return 'unknown error';
        }
        return error.response.data;
    }
}

export const searchTitle = async (title, types, dataLevel, page, years = '1900-2025', imdbScores = '0-10', malScores = '0-10') => {
    try {
        title = title.toLowerCase();
        types = types.join('-');
        let response = await API.get(
            `/movies/searchByTitle/${title}/${types}/${dataLevel}/${years}/${imdbScores}/${malScores}/${page}`
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {
                movies: [],
                staff: [],
                characters: [],
            };
        }
        return 'error';
    }
}

export const searchByID = async (id, dataLevel) => {
    try {
        let response = await API.get(`/movies/searchByID/${id}/${dataLevel}/`);
        return response.data || null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

//--------------------------------
//--------------------------------

export const getNews = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/news/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getUpdates = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/updates/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getTopLikes = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/topsByLikes/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getTrailers = async (types, dataLevel, page, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/trailers/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getSeriesOfDay = async (spacing, page, types, imdbScores = '0-10', malScores = '0-10') => {
    try {
        types = types.join('-');
        let response = await API.get(`/movies/seriesOfDay/${spacing}/${types}/${imdbScores}/${malScores}/${page}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}
