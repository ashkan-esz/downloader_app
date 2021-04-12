import axios from 'axios';

const api_withoutCache = axios.create({
    baseURL: 'https://downloader-node-api.herokuapp.com',
});

export const searchTitle = async (title, types, dataLevel, page, count = 1) => {
    try {
        title = title.toLowerCase();
        types = JSON.stringify(types);
        let response = await api_withoutCache.get(`/search/searchByTitle/${title}/${types}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

//--------------------------------
export const searchByID = async (id, dataLevel) => {
    try {
        let response = await api_withoutCache.get(`/search/searchByID/${id}/${dataLevel}/`);
        return response.data || null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        return 'error';
    }
}

//--------------------------------
export const getNews = async (types, dataLevel, page, count = 1) => {
    try {
        types = JSON.stringify(types);
        let response = await api_withoutCache.get(`/news/${types}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

//--------------------------------
export const getUpdates = async (types, dataLevel, page, count = 1) => {
    try {
        types = JSON.stringify(types);
        let response = await api_withoutCache.get(`/updates/${types}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

//--------------------------------
export const getTopLikes = async (types, dataLevel, page, count = 1) => {
    try {
        types = JSON.stringify(types);
        let response = await api_withoutCache.get(`/tops/byLikes/${types}/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

//--------------------------------
export const getPopularIMDBShows = async (dataLevel, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/tops/IMDBShows/${dataLevel}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}
//--------------------------------
export const getTrailers = async (types, page, count = 1) => {
    try {
        types = JSON.stringify(types);
        let response = await api_withoutCache.get(`/trailers/${types}/${page}/${count}`);
        return response.data || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        return 'error';
    }
}

//--------------------------------
export const getTimeLine_day = async (spacing, page, count = 1) => {
    try {
        let response = await api_withoutCache.get(`/timeLine/day/${spacing}/${page}/${count}`);
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
