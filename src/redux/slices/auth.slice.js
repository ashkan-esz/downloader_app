import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import * as authApis from "../../api/authApis";
import {purgeStoredState} from "redux-persist";

const userLogin_api = createAsyncThunk(
    'auth/userLogin_api',
    async (formData, thunkAPI) => {
        return await authApis.loginApi(formData);
    }
);

const userSignup_api = createAsyncThunk(
    'auth/userSignup_api',
    async (formData, thunkAPI) => {
        return await authApis.signupApi(formData);
    }
);

const logout_api = createAsyncThunk(
    'auth/logout_api',
    async (callLogoutApi, thunkAPI) => {
        thunkAPI.dispatch({type: 'auth/setLoggingOutFlag', payload: true});
        let result = null;
        if (callLogoutApi) {
            result = await authApis.logoutApi();
        }
        if (!callLogoutApi || result && !result.errorMessage) {
            thunkAPI.dispatch({type: 'USER_LOGOUT'});
            try {
                await purgeStoredState(thunkAPI.extra.authPersistConfig);
                await purgeStoredState(thunkAPI.extra.userPersistConfig);
            } catch (error) {
            }
        }
        thunkAPI.dispatch({type: 'auth/setForceLoggedOutFlag', payload: false});
        thunkAPI.dispatch({type: 'auth/setLoggingOutFlag', payload: false});
        return result;
    }
);

const sendVerifyEmail_api = createAsyncThunk(
    'auth/sendVerifyEmail_api',
    async (_, thunkAPI) => {
        return await authApis.sendVerifyEmailApi();
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        thisDevice: null,
        username: '',
        userId: '',
        isLoggedIn: false,
        accessToken: '',
        accessToken_expire: 0,
        refreshToken: '',
        forceLoggedOut: false,
        isFetchingToken: false,
        isLoading: false,
        isLoggingOut: false,
        authError: '',
        message: '',
    },
    reducers: {
        updateTokens: (state, action) => {
            updateTokensState(state, action);
        },
        setDeviceSessionAndUsername: (state, action) => {
            state.thisDevice = action.payload.thisDevice;
            state.username = action.payload.username;
        },
        setIsFetchingToken: (state, action) => {
            state.isFetchingToken = action.payload;
        },
        setForceLoggedOutFlag: (state, action) => {
            state.forceLoggedOut = action.payload;
        },
        setLoggingOutFlag: (state, action) => {
            state.isLoggingOut = action.payload;
        },
        resetAuthError: (state, action) => {
            state.authError = '';
        },
        resetMessage: (state, action) => {
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin_api.pending, (state, action) => {
            state.isLoading = true;
            state.authError = '';
        });
        builder.addCase(userSignup_api.pending, (state, action) => {
            state.isLoading = true;
            state.authError = '';
        });
        builder.addCase(sendVerifyEmail_api.pending, (state, action) => {
            state.isLoading = true;
            state.authError = '';
        });
        builder.addCase(userLogin_api.fulfilled, (state, action) => {
            addUserData(state, action);
        });
        builder.addCase(userSignup_api.fulfilled, (state, action) => {
            addUserData(state, action);
        });
        builder.addCase(sendVerifyEmail_api.fulfilled, (state, action) => {
            if (typeof action.payload === 'string') {
                state.authError = action.payload.toString();
            } else {
                state.authError = '';
                state.message = 'verification email sent';
            }
            state.isLoading = false;
        });
    },
});

const addUserData = (state, action) => {
    let result = action.payload;
    if (result.errorMessage) {
        state.authError = result.errorMessage;
    } else {
        state.username = result.data.username;
        state.userId = result.data.userId;
        state.isLoggedIn = true;
        state.accessToken = result.data.token.accessToken;
        state.accessToken_expire = result.data.token.accessToken_expire;
        state.refreshToken = result.data.token.refreshToken;
    }
    state.isLoading = false;
}

const updateTokensState = (state, action) => {
    let result = action.payload;
    state.username = result.data.username;
    state.accessToken = result.data.token.accessToken;
    state.accessToken_expire = result.data.token.accessToken_expire;
    state.refreshToken = result.data.token.refreshToken;
    state.isFetchingToken = false;
}

export const authPersistStates = ['username', 'userId', 'isLoggedIn', 'refreshToken'];

export const {
    updateTokens,
    setDeviceSessionAndUsername,
    setIsFetchingToken,
    setForceLoggedOutFlag,
    setLoggingOutFlag,
    resetAuthError,
    resetMessage,
} = authSlice.actions;

export {
    userLogin_api,
    userSignup_api,
    logout_api,
    sendVerifyEmail_api,
};

export default authSlice.reducer;
