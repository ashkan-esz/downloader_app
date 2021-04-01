import axios from 'axios';
import {setupCache} from 'axios-cache-adapter';


const cache = setupCache({
    maxAge: 3 * 60 * 1000
});

const api_withoutCache = axios.create({
    baseURL: 'https://downloader-node-api.herokuapp.com',
});

const api_withCache = axios.create({
    baseURL: 'https://downloader-node-api.herokuapp.com',
    adapter: cache.adapter
});

export const searchAll = async (title, dataLevel, page, count = 1) => {
    try {
        title = title.toLowerCase();
        let response = await api_withoutCache.get(`/search/searchAll/${title}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const searchSingleType = async (type, title, dataLevel, page, count = 1) => {
    try {
        title = title.toLowerCase();
        let response = await api_withoutCache.get(`/search/searchSingleType/${type}/${title}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}
//--------------------------------
export const searchByID = async (type, id, dataLevel) => {
    try {
        let response = await api_withoutCache.get(`/search/searchByID/${type}/${id}/${dataLevel}/`);
        return response.data || null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}
//--------------------------------
export const getNews_all = async (dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/news/getAll/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getNews_singleType = async (type, dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/news/getSingleType/${type}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (e) {
        return 'error';
    }
}
//--------------------------------
export const getUpdates_all = async (dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/updates/getAll/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getUpdates_singleType = async (type, dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/updates/getSingleType/${type}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (e) {
        return 'error';
    }
}
//--------------------------------
export const getTops_byLike_all = async (dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/tops/byLikes/getAll/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getTops_byLike_singleType = async (type, dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/tops/byLikes/getSingleType/${type}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (e) {
        return 'error';
    }
}

export const getTops_popularShows = async (dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/tops/popularShows/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}
//--------------------------------
export const getTrailers_all = async (page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/trailers/getAll/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getTrailers_singleType = async (type, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/trailers/getSingleType/${type}/${page}/${count}`);
        return response.data || [];
    } catch (e) {
        return 'error';
    }
}
//--------------------------------
export const getTimeLine_today = async (page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/timeLine/today/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const getTimeLine_week = async (weekCounter) => {
    try {
        let response = await api_withoutCache.get(`/timeLine/week/${weekCounter}/`);
        return response.data || [];
    } catch (e) {
        return 'error';
    }
}
//--------------------------------
