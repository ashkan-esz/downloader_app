import API, {CHAT_API} from "./index";
import {authEndpoints, tokenEndPoint} from "./authApis";
import DeviceInfo from 'react-native-device-info';
import Toast from "react-native-toast-message";

let store;
let tokenServerError = false;

//todo : do not print error on (401 | network) error and keep state as loading

//todo : handle errors again


//todo : check again, need remove and change
const errorMessages = {
    '401': 'Error: Request failed with status code 401',
    '403': 'Error: Request failed with status code 403',
    '500': 'Error: Request failed with status code 500',
}

export const injectStore = _store => {
    store = _store;
}

const accessTokenShouldBeRefreshed = () => (
    !store.getState().auth.accessToken ||
    store.getState().auth.accessToken_expire - Date.now() < 15000
);

const getNewToken = async () => {
    return await CHAT_API.put(tokenEndPoint, {}, {
        headers: {
            refreshToken: store.getState().auth.refreshToken,
        }
    });
}

const enableForceLogoutIfNeeded = (error) => {
    if (
        error.response && error.response.status === 401 ||
        error.toString() === 'Error: Request failed with status code 401') {
        console.log('--- here 1: ', error.response?.status, error.toString());
        store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
    }
}

const addDeviceInfo = (config) => {
    try {
        if (!config.data) {
            config.data = {};
        }
        config.data.deviceInfo = {
            appName: DeviceInfo.getApplicationName(),
            appVersion: DeviceInfo.getVersion(),
            os: DeviceInfo.getSystemName().replace('iPhone OS', 'iOS'),
            deviceModel: DeviceInfo.getModel(),
        };
        config.data = {
            ...config.data,
            ...config.data.deviceInfo,
        }
    } catch (error) {
        if (!config.data) {
            config.data = {};
        }
        config.data.deviceInfo = null;
    }
}

const showToast = () => {
    Toast.show({
        type: 'error',
        text1: 'Server side error',
        position: 'bottom',
        onPress: () => {
            Toast.hide();
        },
        visibilityTime: 10000,
    });
}

const waitForTokenFetch = async () => {
    while (store.getState().auth.isFetchingToken) {
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}

const waitForTokenErrorFix = async () => {
    while (tokenServerError) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

const handleTokenServerError = async (originalConfig) => {
    if (!originalConfig._retryCounter) {
        tokenServerError = true;
    }
    originalConfig._retryCounter = (originalConfig._retryCounter || 0) + 1;
    if (originalConfig._retryCounter < 5) {
        showToast();
        await new Promise(resolve => setTimeout(resolve, 5000));
        return 'retry';
    }
    Toast.hide();
    store.dispatch({type: "user/setCloseAppFlag", payload: true});
    return null;
}

const handleTokenRequest = async () => {
    try {
        store.dispatch({type: "auth/setIsFetchingToken", payload: true});
        const rs = await getNewToken();
        tokenServerError = false;
        //stale refreshToken or refreshToken doesn't match (force logout)
        if (rs.toString() === errorMessages["401"]) {
            console.log('--- here 2: ', rs.response?.status, rs.toString());
            store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
            return 'logout';
        } else {
            store.dispatch({type: "auth/updateTokens", payload: rs.data});
            // store.dispatch({type: "user/setProfileImages", payload: rs.data.data.profileImages});
            return 'retry';
        }
    } catch (_error) {
        store.dispatch({type: "auth/setIsFetchingToken", payload: false});
        enableForceLogoutIfNeeded(_error);
        return _error;
    }
}

//todo : handle 429
//todo : fix error with waiting on logout overlay
//todo : fix : false forceLogout when internet reconnect

API.interceptors.request.use(async (config) => {
    if (!authEndpoints.includes(config.url)) {
        await waitForTokenErrorFix();

        if (!store.getState().auth.refreshToken) {
            //no refreshToken is available, logout
            store.dispatch({type: "USER_LOGOUT"});
            return config;
        }

        if (!store.getState().auth.isFetchingToken && accessTokenShouldBeRefreshed()) {
            await handleTokenRequest();
        }

        await waitForTokenFetch();
        await waitForTokenErrorFix();
    }

    if (authEndpoints.includes(config.url)) {
        addDeviceInfo(config);
    }

    config.headers.authorization = `Bearer ${store.getState().auth.accessToken}`;
    config.headers.refreshToken = store.getState().auth.refreshToken;
    return config;
});

API.interceptors.response.use(
    //todo : handle isGuest=true in response
    (res) => {
        return res;
    },
    async (err) => {
        // console.log(err,  err.config); //todo :
        const originalConfig = err.config;

        if (!authEndpoints.includes(originalConfig.url)) {
            await waitForTokenErrorFix();

            if (
                !store.getState().auth.refreshToken ||
                err.response && err.response.status === 401 ||
                err.toString() === errorMessages["401"]) {
                //stale refreshToken or refreshToken doesn't match (force logout)
                console.log('--- here 3: ', err.response?.status, err.toString());
                // console.log('--- here 3: ', err.toString(), originalConfig.url);
                // console.log(JSON.stringify(err.response, null, 4));
                store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
                return Promise.reject(err);
            }
            if (!store.getState().auth.isFetchingToken && err.response?.status === 403 && !originalConfig._retry) {
                originalConfig._retry = true;
                let result = await handleTokenRequest();
                if (result === 'retry') {
                    return API(originalConfig);
                }
                if (result !== 'logout') {
                    return Promise.reject(result);
                }
            }

            await waitForTokenFetch();
            await waitForTokenErrorFix();
        }

        if (originalConfig.url === tokenEndPoint && err.toString() === errorMessages["500"]) {
            let result = await handleTokenServerError(originalConfig);
            if (result === 'retry') {
                return API(originalConfig);
            }
        }

        return Promise.reject(err);
    }
);

//----------------------------------------------
//----------------------------------------------

CHAT_API.interceptors.request.use(async (config) => {
    if (!authEndpoints.includes(config.url)) {
        await waitForTokenErrorFix();

        if (!store.getState().auth.refreshToken) {
            //no refreshToken is available, logout
            store.dispatch({type: "USER_LOGOUT"});
            return config;
        }

        if (!store.getState().auth.isFetchingToken && accessTokenShouldBeRefreshed()) {
            await handleTokenRequest();
        }

        await waitForTokenFetch();
        await waitForTokenErrorFix();
    }

    if (authEndpoints.includes(config.url)) {
        addDeviceInfo(config);
    }

    config.headers.authorization = `Bearer ${store.getState().auth.accessToken}`;
    config.headers.refreshToken = store.getState().auth.refreshToken;
    return config;
});

CHAT_API.interceptors.response.use(
    //todo : handle isGuest=true in response
    (res) => {
        return res;
    },
    async (err) => {
        // console.log(err,  err.config); //todo :
        const originalConfig = err.config;

        if (!authEndpoints.includes(originalConfig.url)) {
            await waitForTokenErrorFix();

            if (
                !store.getState().auth.refreshToken ||
                err.response && err.response.status === 401 ||
                err.toString() === errorMessages["401"]) {
                //stale refreshToken or refreshToken doesn't match (force logout)
                console.log('--- here 3: ', err.response?.status, err.toString());
                // console.log('--- here 3: ', err.toString(), originalConfig.url);
                // console.log(JSON.stringify(err.response, null, 4));
                store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
                return Promise.reject(err);
            }
            if (!store.getState().auth.isFetchingToken && err.response?.status === 403 && !originalConfig._retry) {
                originalConfig._retry = true;
                let result = await handleTokenRequest();
                if (result === 'retry') {
                    return API(originalConfig);
                }
                if (result !== 'logout') {
                    return Promise.reject(result);
                }
            }

            await waitForTokenFetch();
            await waitForTokenErrorFix();
        }

        if (originalConfig.url === tokenEndPoint && err.toString() === errorMessages["500"]) {
            let result = await handleTokenServerError(originalConfig);
            if (result === 'retry') {
                return API(originalConfig);
            }
        }

        return Promise.reject(err);
    }
);
