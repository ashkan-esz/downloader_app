import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from 'redux-persist';
import createSecureStore from "redux-persist-expo-securestore";
import FilesystemStorage from 'redux-persist-filesystem-storage'
import userReducer from '../slices/user.slice';
import authReducer, {authPersistStates} from '../slices/auth.slice';

const secureStorage = createSecureStore();

export const authPersistConfig = {
    timeout: 2000,
    key: 'auth',
    storage: secureStorage,
    whitelist: authPersistStates,
}

export const userPersistConfig = {
    timeout: 3000,
    key: 'user',
    storage: FilesystemStorage,
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
