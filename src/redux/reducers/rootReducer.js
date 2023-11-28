import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from 'redux-persist';
import * as SecureStore from "expo-secure-store";
import { MMKV } from 'react-native-mmkv';
import userReducer, {userPersistStates} from '../slices/user.slice';
import authReducer, {authPersistStates} from '../slices/auth.slice';

const mmkStorage = new MMKV();

const reduxMmkStorage= {
    setItem: (key, value) => {
        mmkStorage.set(key, value);
        return Promise.resolve(true);
    },
    getItem: (key) => {
        const value = mmkStorage.getString(key);
        return Promise.resolve(value);
    },
    removeItem: (key) => {
        mmkStorage.delete(key);
        return Promise.resolve();
    },
}


function createSecureStorage(options = {}) {
    const replaceCharacter = options.replaceCharacter || "_";
    const replacer = options.replacer || defaultReplacer;

    return {
        getItem: key =>
            SecureStore.getItemAsync(replacer(key, replaceCharacter), options),
        setItem: (key, value) =>
            SecureStore.setItemAsync(replacer(key, replaceCharacter), value, options),
        removeItem: key =>
            SecureStore.deleteItemAsync(replacer(key, replaceCharacter), options)
    };
}

function defaultReplacer(key, replaceCharacter) {
    return key.replace(/[^a-z0-9.\-_]/gi, replaceCharacter);
}


const secureStorage = createSecureStorage();

export const authPersistConfig = {
    timeout: 2000,
    key: 'auth',
    storage: secureStorage,
    whitelist: authPersistStates,
}

export const userPersistConfig = {
    timeout: 1000,
    key: 'user',
    storage: reduxMmkStorage,
    whitelist: userPersistStates,
}

const appReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    user: persistReducer(userPersistConfig, userReducer),
});

export default (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        //reset all states
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}
