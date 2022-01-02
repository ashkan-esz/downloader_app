import API, {authEndpoints, tokenEndPoint} from "./index";
import DeviceInfo from 'react-native-device-info';

let store;

export const injectStore = _store => {
    store = _store;
}

const accessTokenShouldBeRefreshed = () => (
    !store.getState().auth.accessToken ||
    store.getState().auth.accessToken_expire - Date.now() < 15000
);

const getNewToken = async () => {
    return await API.post(tokenEndPoint, {}, {
        headers: {
            refreshToken: store.getState().auth.refreshToken,
        }
    });
}

const enableForceLogoutIfNeeded = (error) => {
    if (
        error.response && error.response.status === 401 ||
        error.toString() === 'Error: Request failed with status code 401') {
        store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
    }
}

//todo : fix : false forceLogout when internet reconnect

API.interceptors.request.use(async (config) => {
    if (!authEndpoints.includes(config.url)) {
        if (!store.getState().auth.refreshToken) {
            //no refreshToken is available, logout
            store.dispatch({type: "USER_LOGOUT"});
            return config;
        }
        if (!store.getState().auth.isFetchingToken && accessTokenShouldBeRefreshed()) {
            store.dispatch({type: "auth/setIsFetchingToken", payload: true});
            try {
                const rs = await getNewToken();
                //stale refreshToken or refreshToken doesn't match (force logout)
                if (rs.toString() === 'Error: Request failed with status code 401') {
                    store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
                } else {
                    store.dispatch({type: "auth/updateTokens", payload: rs.data});
                    store.dispatch({type: "user/setProfileImages", payload: rs.data.profileImages});
                }
            } catch (_error) {
                store.dispatch({type: "auth/setIsFetchingToken", payload: false});
                enableForceLogoutIfNeeded(_error);
            }
        }

        while (store.getState().auth.isFetchingToken) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    if (authEndpoints.includes(config.url)) {
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
        } catch (error) {
            if (!config.data) {
                config.data = {};
            }
            config.data.deviceInfo = null;
        }
    }

    config.headers.authorization = `Bearer ${store.getState().auth.accessToken}`;
    config.headers.refreshToken = store.getState().auth.refreshToken;
    return config;
});

API.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (!authEndpoints.includes(originalConfig.url)) {
            if (
                !store.getState().auth.refreshToken ||
                err.response && err.response.status === 401 ||
                err.toString() === 'Error: Request failed with status code 401') {
                //stale refreshToken or refreshToken doesn't match (force logout)
                store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
                return Promise.reject(err);
            }
            if (!store.getState().auth.isFetchingToken && err.response.status === 403 && !originalConfig._retry) {
                originalConfig._retry = true;
                store.dispatch({type: "auth/setIsFetchingToken", payload: true});
                try {
                    const rs = await getNewToken();
                    //stale refreshToken or refreshToken doesn't match (force logout)
                    if (rs.toString() === 'Error: Request failed with status code 401') {
                        store.dispatch({type: "auth/setForceLoggedOutFlag", payload: true});
                    } else {
                        store.dispatch({type: "auth/updateTokens", payload: rs.data});
                        store.dispatch({type: "user/setProfileImages", payload: rs.data.profileImages});
                        return API(originalConfig);
                    }
                } catch (_error) {
                    store.dispatch({type: "auth/setIsFetchingToken", payload: false});
                    enableForceLogoutIfNeeded(_error);
                    return Promise.reject(_error);
                }
                while (store.getState().auth.isFetchingToken) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        return Promise.reject(err);
    }
);
