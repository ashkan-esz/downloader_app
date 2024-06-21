import axios from 'axios';
import {BASE_URL, BASE_URL_DEV,CHAT_BASE_URL,CHAT_BASE_URL_DEV} from '@env';

const API = axios.create({
    // baseURL: process.env.NODE_ENV === 'production' ? BASE_URL : BASE_URL_DEV,
    baseURL: BASE_URL,
    // baseURL: BASE_URL_DEV,
    withCredentials: true,
});

export const CHAT_API = axios.create({
    // baseURL: process.env.NODE_ENV === 'production' ? CHAT_BASE_URL : CHAT_BASE_URL_DEV,
    baseURL: CHAT_BASE_URL,
    // baseURL: CHAT_BASE_URL_DEV,
    withCredentials: true,
});

export default API;
