import API, {authEndpoints, tokenEndPoint} from "./index";

let store;

export const injectStore = _store => {
    store = _store;
}

const accessTokenShouldBeRefreshed = () => (
    !store.getState().user.accessToken ||
    store.getState().user.accessToken_expire - Date.now() < 15000
);

const getNewToken = async () => {
    return await API.post(tokenEndPoint, {}, {
        headers: {
            refreshToken: store.getState().user.refreshToken,
        }
    });
}

const enableForceLogoutIfNeeded = (error) => {
    if (
        error.response && error.response.status === 401 ||
        error.toString() === 'Error: Request failed with status code 401') {
        store.dispatch({type: "user/setForceLogoutFlag", payload: true});
    }
}

//todo : fix : false forceLogout when internet reconnect

API.interceptors.request.use(async (config) => {
    if (!authEndpoints.includes(config.url)) {
        if (!store.getState().user.refreshToken) {
            //no refreshToken is available, logout
            store.dispatch({type: "USER_LOGOUT"});
            return config;
        }
        if (!store.getState().user.isFetchingToken && accessTokenShouldBeRefreshed()) {
            store.dispatch({type: "user/setIsFetchingToken", payload: true});
            try {
                const rs = await getNewToken();
                //stale refreshToken or refreshToken doesn't match (force logout)
                if (rs.toString() === 'Error: Request failed with status code 401') {
                    store.dispatch({type: "user/setForceLogoutFlag", payload: true});
                } else {
                    store.dispatch({type: "user/updateTokens", payload: rs.data});
                }
            } catch (_error) {
                store.dispatch({type: "user/setIsFetchingToken", payload: false});
                enableForceLogoutIfNeeded(_error);
            }
        }

        while (store.getState().user.isFetchingToken) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    config.headers.authorization = `Bearer ${store.getState().user.accessToken}`;
    config.headers.refreshToken = store.getState().user.refreshToken;
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
                !store.getState().user.refreshToken ||
                err.response && err.response.status === 401 ||
                err.toString() === 'Error: Request failed with status code 401') {
                //stale refreshToken or refreshToken doesn't match (force logout)
                store.dispatch({type: "user/setForceLogoutFlag", payload: true});
                return Promise.reject(err);
            }
            if (!store.getState().user.isFetchingToken && err.response.status === 403 && !originalConfig._retry) {
                originalConfig._retry = true;
                store.dispatch({type: "user/setIsFetchingToken", payload: true});
                try {
                    const rs = await getNewToken();
                    //stale refreshToken or refreshToken doesn't match (force logout)
                    if (rs.toString() === 'Error: Request failed with status code 401') {
                        store.dispatch({type: "user/setForceLogoutFlag", payload: true});
                    } else {
                        store.dispatch({type: "user/updateTokens", payload: rs.data});
                        return API(originalConfig);
                    }
                } catch (_error) {
                    store.dispatch({type: "user/setIsFetchingToken", payload: false});
                    enableForceLogoutIfNeeded(_error);
                    return Promise.reject(_error);
                }
                while (store.getState().user.isFetchingToken) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        return Promise.reject(err);
    }
);
