import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getProfileDataApi} from "../../api";


const profile_api = createAsyncThunk(
    'user/profile_api',
    async (_, thunkAPI) => {
        let result = await getProfileDataApi();
        if (typeof result !== 'string') {
            thunkAPI.dispatch({
                type: 'auth/setDeviceSessionAndUsername',
                payload: {
                    thisDevice: result.thisDevice,
                    username: result.username,
                }
            });
        }
        return result;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        internet: true,
        connectionType: '',
        profileImages: [],
        profileImage: '',
        emailVerified: false,
        isLoading: false,
        userError: '',
        //----ota update
        updateExist: false,
        isDownloadingUpdate: false,
        showUpdateOverlay: true,
        //-------------
        closeAppFlag: false,
    },
    reducers: {
        setInternet: (state, action) => {
            state.internet = action.payload.internet;
            state.connectionType = action.payload.connectionType;
        },
        setProfileImages: (state, action) => {
            state.profileImages = action.payload;
        },
        setEmailVerifiedFlag: (state, action) => {
            state.emailVerified = action.payload;
        },
        resetUserError: (state, action) => {
            state.userError = '';
        },
        setUpdateFlag: (state, action) => {
            state.updateExist = action.payload;
        },
        setDownloadingUpdateFlag: (state, action) => {
            state.isDownloadingUpdate = action.payload;
        },
        setShowUpdateOverlayFlag: (state, action) => {
            state.showUpdateOverlay = action.payload;
        },
        setCloseAppFlag: (state, action) => {
            state.closeAppFlag = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(profile_api.pending, (state, action) => {
            state.isLoading = true;
            state.userError = '';
        });
        builder.addCase(profile_api.fulfilled, (state, action) => {
            setProfileData(state, action);
        });
    },
});


const setProfileData = (state, action) => {
    if (typeof action.payload === 'string') {
        state.userError = action.payload.toString();
    } else {
        const {
            profileImages, defaultProfile, emailVerified,
        } = action.payload;
        state.profileImages = profileImages;
        state.profileImage = defaultProfile;
        state.emailVerified = emailVerified;
        state.userError = '';
    }
    state.isLoading = false;
}

export const userPersistStates = ['profileImages', 'profileImage', 'emailVerified'];

export const {
    setInternet,
    setProfileImages,
    setEmailVerifiedFlag,
    resetUserError,
    setUpdateFlag,
    setDownloadingUpdateFlag,
    setShowUpdateOverlayFlag,
    setCloseAppFlag,
} = userSlice.actions;

export {
    profile_api,
};

export default userSlice.reducer;
