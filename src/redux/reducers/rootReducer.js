import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from 'redux-persist';
import createSecureStore from "redux-persist-expo-securestore";
import userReducer, {persistStates} from '../slices/user.slice';

const secureStorage = createSecureStore();

export const userPersistConfig = {
    timeout: 2000,
    key: 'user',
    storage: secureStorage,
    whitelist: persistStates,
}

const appReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
});

export default (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        //reset all states
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
}
