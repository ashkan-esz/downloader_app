import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    getProfileDataApi,
    loginApi,
    logoutApi,
    sendVerifyEmailApi,
    signupApi,
} from "../../api";
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

const sendVerifyEmail_api = createAsyncThunk(
    'user/sendVerifyEmail_api',
    async (thunkAPI) => {
        return await sendVerifyEmailApi();
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profileData: {},
        thisDevice: null,
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
        message: '',
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
        resetMessage: (state, action) => {
            state.message = '';
        },
        updateTokens: (state, action) => {
            updateTokensState(state, action);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin_api.pending, (state, action) => {
            state.isLoading = true;
            state.serverError = '';
        });
        builder.addCase(userSignup_api.pending, (state, action) => {
            state.isLoading = true;
            state.serverError = '';
        });
        builder.addCase(profile_api.pending, (state, action) => {
            state.isLoading = true;
            state.serverError = '';
        });
        builder.addCase(sendVerifyEmail_api.pending, (state, action) => {
            state.isLoading = true;
            state.serverError = '';
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
        builder.addCase(sendVerifyEmail_api.fulfilled, (state, action) => {
            if (typeof action.payload === 'string') {
                state.serverError = action.payload;
            } else {
                state.serverError = '';
                state.message = 'verification email sent';
            }
            state.isLoading = false;
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
        profileImages,
    } = action.payload;
    state.profileImages = profileImages;
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
            username, userId, thisDevice,
            profileImages, defaultProfile,
        } = action.payload;
        //todo :
        state.profileData = action.payload;
        state.thisDevice = thisDevice;
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
    resetMessage,
    updateTokens
} = userSlice.actions;

export {
    userLogin_api,
    userSignup_api,
    logout_api,
    profile_api,
    sendVerifyEmail_api,
};

export default userSlice.reducer;
