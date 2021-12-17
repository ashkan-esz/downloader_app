import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loginApi, signupApi, logoutApi, getProfileDataApi} from "../../api";
import {purgeStoredState} from "redux-persist";

const userLogin_api = createAsyncThunk(
    'user/userLogin_api',
    async (formData, thunkAPI) => {
        return await loginApi(formData);
    }
);

const userSignup_api = createAsyncThunk(
    'user/userSignup_api',
    async (formData, thunkAPI) => {
        return await signupApi(formData);
    }
);

const logout_api = createAsyncThunk(
    'user/logout_api',
    async (callLogoutApi, thunkAPI) => {
        thunkAPI.dispatch({type: 'user/setLoggingOutFlag', payload: true});
        let result = null;
        if (callLogoutApi) {
            result = await logoutApi();
        }
        if (!callLogoutApi || result && !result.errorMessage) {
            thunkAPI.dispatch({type: 'USER_LOGOUT'});
            try {
                await purgeStoredState(thunkAPI.extra.userPersistConfig);
            } catch (error) {
            }
        }
        thunkAPI.dispatch({type: 'user/setForceLogoutFlag', payload: false});
        thunkAPI.dispatch({type: 'user/setLoggingOutFlag', payload: false});
        return result;
    }
);

const profile_api = createAsyncThunk(
    'user/profile_api',
    async (thunkAPI) => {
        return await getProfileDataApi();
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profileData: {},
        username: '',
        userId: '',
        profileImages: [],
        profileImage: '',
        isLoggedIn: false,
        forceLogout: false,
        accessToken: '',
        accessToken_expire: 0,
        refreshToken: '',
        isFetchingToken: false,
        isLoading: false,
        isLoggingOut: false,
        serverError: '',
    },
    reducers: {
        setForceLogoutFlag: (state, action) => {
            state.forceLogout = action.payload;
        },
        setLoggingOutFlag: (state, action) => {
            state.isLoggingOut = action.payload;
        },
        setIsFetchingToken: (state, action) => {
            state.isFetchingToken = action.payload;
        },
        resetServerError: (state, action) => {
            state.serverError = '';
        },
        updateTokens: (state, action) => {
            updateTokensState(state, action);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin_api.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(userSignup_api.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(userLogin_api.fulfilled, (state, action) => {
            addUserData(state, action);
        });
        builder.addCase(userSignup_api.fulfilled, (state, action) => {
            addUserData(state, action);
        });
        builder.addCase(profile_api.fulfilled, (state, action) => {
            setProfileData(state, action);
        });
    },
});

const addUserData = (state, action) => {
    const {
        username, userId, errorMessage,
        accessToken, accessToken_expire, refreshToken
    } = action.payload;
    if (errorMessage) {
        state.serverError = errorMessage;
    } else {
        state.username = username;
        state.userId = userId;
        state.isLoggedIn = true;
        state.accessToken = accessToken;
        state.accessToken_expire = accessToken_expire;
        state.refreshToken = refreshToken;
    }
    state.isLoading = false;
}

const updateTokensState = (state, action) => {
    const {
        username, refreshToken,
        accessToken, accessToken_expire,
    } = action.payload;

    state.username = username;
    state.accessToken = accessToken;
    state.accessToken_expire = accessToken_expire;
    state.refreshToken = refreshToken;
    state.isFetchingToken = false;
}

const setProfileData = (state, action) => {
    if (typeof action.payload === 'string') {
        state.serverError = action.payload;
    } else {
        const {
            username, userId,
            profileImages, defaultProfile,
        } = action.payload;
        //todo :
        state.profileData = action.payload;
        state.username = username;
        state.userId = userId;
        state.profileImages = profileImages;
        state.profileImage = defaultProfile;
        state.serverError = '';
    }
    state.isLoading = false;
}

export const persistStates = ['username', 'userId', 'profileImage', 'isLoggedIn', 'refreshToken'];
export const {
    setForceLogoutFlag,
    setLoggingOutFlag,
    setIsFetchingToken,
    resetServerError,
    updateTokens
} = userSlice.actions;
export {userLogin_api, userSignup_api, logout_api, profile_api};
export default userSlice.reducer;
