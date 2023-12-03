import {Platform} from 'react-native';
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getProfileDataApi} from "../../api";
import {checkUpdateExist, getServerMessage} from "../../api/others";


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

const checkAppUpdate_thunk = createAsyncThunk(
    'user/checkAppUpdate_thunk',
    async (_, thunkAPI) => {
        try {
            if (Platform.OS === 'android') {
                if (process.env.NODE_ENV === 'production') {
                    let result = await checkUpdateExist();
                    if (result?.hasUpdate) {
                        thunkAPI.dispatch({
                            type: 'user/setUpdateFlag',
                            payload: {
                                exist: true,
                                isForce: result.isForceUpdate,
                                fileData: result.fileData,
                                version: result.version,
                                minVersion: result.minVersion,
                                versionName: result.versionName,
                            },
                        });
                    }
                    if (result?.message) {
                        thunkAPI.dispatch({
                            type: 'user/setServerMessage',
                            payload: result.message,
                        });
                    }
                } else {
                    let result = await getServerMessage();
                    if (result?.message) {
                        thunkAPI.dispatch({
                            type: 'user/setServerMessage',
                            payload: result.message,
                        });
                    }
                }

            } else if (Platform.OS === 'ios') {
                let result = await getServerMessage();
                if (result?.message) {
                    thunkAPI.dispatch({
                        type: 'user/setServerMessage',
                        payload: result.message,
                    });
                }
            }
        } catch (e) {
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: {
        internet: true,
        connectionType: '',
        profileImages: [],
        defaultProfileImage: '',
        emailVerified: false,
        isLoading: false,
        userError: '',
        //----Ota Update
        update: {
            isChecking: false,
            exist: false,
            isForce: false,
            fileData: null,//addDate, sha256checksum, size, url
            isDownloading: false,
            showOverlay: true,
            minVersion: '',
            version: '',
            versionName: '',
        },
        //----Message
        serverMessage: '',
        prevServerMessage: '',
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
            if (action.payload.exist) {
                state.update.exist = true;
                state.update.isForce = action.payload.isForce;
                state.update.fileData = action.payload.fileData;
                state.update.fileData.size = ((action.payload.fileData.size || 0) / 1024 / 1024).toFixed(0);
                state.update.version = action.payload.version;
                state.update.minVersion = action.payload.minVersion;
                state.update.versionName = action.payload.versionName;
            } else {
                state.update = {
                    isChecking: false,
                    exist: false,
                    isForce: false,
                    fileData: null,
                    isDownloading: false,
                    showOverlay: false,
                    minVersion: '',
                    version: '',
                    versionName: '',
                }
            }
        },
        setDownloadingUpdateFlag: (state, action) => {
            state.update.isDownloading = action.payload;
        },
        setShowUpdateOverlayFlag: (state, action) => {
            state.update.showOverlay = action.payload;
        },
        setCloseAppFlag: (state, action) => {
            state.closeAppFlag = action.payload;
        },
        setServerMessage: (state, action) => {
            state.prevServerMessage = state.serverMessage;
            state.serverMessage = action.payload;
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
        builder.addCase(checkAppUpdate_thunk.pending, (state, action) => {
            state.update.isChecking = true;
        });
        builder.addCase(checkAppUpdate_thunk.fulfilled, (state, action) => {
            state.update.isChecking = false;
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
        state.defaultProfileImage = defaultProfile;
        state.emailVerified = emailVerified;
        state.userError = '';
    }
    state.isLoading = false;
}

export const userPersistStates = ['profileImages', 'defaultProfileImage', 'emailVerified', 'serverMessage', 'prevServerMessage'];

export const {
    setInternet,
    setProfileImages,
    setEmailVerifiedFlag,
    resetUserError,
    setUpdateFlag,
    setDownloadingUpdateFlag,
    setShowUpdateOverlayFlag,
    setCloseAppFlag,
    setServerMessage,
} = userSlice.actions;

export {
    profile_api,
    checkAppUpdate_thunk,
};

export default userSlice.reducer;
