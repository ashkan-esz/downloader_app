import axios from 'axios';
import {BASE_URL} from '@env';

const api_withoutCache = axios.create({
    baseURL: BASE_URL,
});

export const searchTitle = async (title, types, dataLevel, page, years = '1900-2025', imdbScores = '0-10', malScores = '0-10') => {
    try {
        title = title.toLowerCase();
        types = types.join('-');
        let response = await api_withoutCache.get(
            `/movies/searchByTitle/${title}/${types}/${dataLevel}/${years}/${imdbScores}/${malScores}/${page}`
        );
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

export const searchByID = async (id, dataLevel) => {
    try {
        let response = await api_withoutCache.get(`/movies/searchByID/${id}/${dataLevel}/`);
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
        let response = await api_withoutCache.get(`/movies/news/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
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
        let response = await api_withoutCache.get(`/movies/updates/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
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
        let response = await api_withoutCache.get(`/movies/topsByLikes/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
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
        let response = await api_withoutCache.get(`/movies/trailers/${types}/${dataLevel}/${imdbScores}/${malScores}/${page}`);
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
        let response = await api_withoutCache.get(`/movies/seriesOfDay/${spacing}/${types}/${imdbScores}/${malScores}/${page}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}
