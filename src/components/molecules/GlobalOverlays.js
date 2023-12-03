import React, {useEffect, useState} from 'react';
import {StyleSheet, PermissionsAndroid} from 'react-native';
import {MyOverlay} from "../atoms";
import {useDispatch, useSelector} from "react-redux";
import {logout_api} from "../../redux/slices/auth.slice";
import {
    setDownloadingUpdateFlag,
    setShowUpdateOverlayFlag,
    setUpdateFlag
} from "../../redux/slices/user.slice";
import {Colors} from "../../styles";
import RNExitApp from 'react-native-exit-app';
import {showToast} from "../../utils";
import ReactNativeBlobUtil from 'react-native-blob-util';


const GlobalOverlays = () => {
    const dispatch = useDispatch();
    const internet = useSelector(state => state.user.internet);
    const appUpdateData = useSelector(state => state.user.update);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const forceLoggedOut = useSelector(state => state.auth.forceLoggedOut);
    const closeAppFlag = useSelector(state => state.user.closeAppFlag);
    const serverMessage = useSelector(state => state.user.serverMessage);
    const prevServerMessage = useSelector(state => state.user.prevServerMessage);
    const [downloadProgress, setDownloadProgress] = useState('');
    const [downloadButtonText, setDownloadButtonText] = useState('');
    const [showServerMessage, setShowServerMessage] = useState(false);

    useEffect(() => {
        if (serverMessage && serverMessage !== prevServerMessage) {
            setShowServerMessage(true);
        }
    }, [serverMessage, prevServerMessage]);

    useEffect(() => {
        handleAsyncCall();

        async function handleAsyncCall() {
            if (appUpdateData?.fileData) {
                if (appUpdateData.isDownloading) {
                    setDownloadButtonText(`Downloading ${downloadProgress}%`);
                } else {
                    let path = ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir + '/' + appUpdateData.fileData.url.split('/').pop();
                    let fileExist = await ReactNativeBlobUtil.fs.exists(path);
                    if (fileExist) {
                        setDownloadButtonText(`Install v${appUpdateData.version}`);
                    } else {
                        setDownloadButtonText(`UPDATE (${appUpdateData.fileData?.size}MB)`);
                    }
                }
            }
        }
    }, [downloadProgress, appUpdateData]);

    async function installApp() {
        if (appUpdateData.isDownloading) {
            return;
        }

        if (downloadButtonText.includes('Install')) {
            try {
                let path = ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir + '/' + appUpdateData.fileData.url.split('/').pop();
                await ReactNativeBlobUtil.android.actionViewIntent(
                    path, "application/vnd.android.package-archive"
                );
                dispatch(setUpdateFlag({exist: false}));
            } catch (error) {
                showToast({text: 'Error on installing apk file', time: 2000});
            }
            return;
        }

        const writeStoragePermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (writeStoragePermission !== PermissionsAndroid.RESULTS.GRANTED) {
            showToast({text: 'Permission denied', time: 2000});
            return;
        }

        dispatch(setDownloadingUpdateFlag(true));
        ReactNativeBlobUtil.config({
            addAndroidDownloads: {
                useDownloadManager: true,
                path: ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir + '/' + appUpdateData.fileData.url.split('/').pop(),
                title: appUpdateData.fileData.url.split('/').pop(),
                description: "Install manually if app didnt closed after download",
                mime: "application/vnd.android.package-archive",
                mediaScannable: true,
                notification: true,
            },
        })
            .fetch("GET", appUpdateData.fileData.url)
            .progress((received, total) => {
                setDownloadProgress((100 * received / total).toFixed(1));
            })
            .then(async (res) => {
                dispatch(setDownloadingUpdateFlag(false));
                await ReactNativeBlobUtil.android.actionViewIntent(
                    res.path(),
                    "application/vnd.android.package-archive"
                );
                dispatch(setUpdateFlag({exist: false}));
            }).catch((err) => {
            dispatch(setDownloadingUpdateFlag(false));
            dispatch(setUpdateFlag({exist: false}));
            showToast({text: 'Error on downloading apk file', time: 2000});
        });
    }

    return (
        <>
            <MyOverlay
                overlay={(appUpdateData.showOverlay && appUpdateData.exist) || appUpdateData.isDownloading}
                setOverlay={() => dispatch(setShowUpdateOverlayFlag(false))}
                message={`There is a${appUpdateData.isForce ? ' Force' : ''} update available:`}
                secondMessage={`version: ${appUpdateData.version} (${appUpdateData.versionName})`}
                leftOption={appUpdateData.isForce ? downloadButtonText : 'CANCEL'}
                leftColor={appUpdateData.isForce ? "green" : 'red'}
                rightOption={appUpdateData.isForce ? '' : downloadButtonText}
                rightColor={"green"}
                secondTitleFontSize={18}
                isLoading={appUpdateData.isDownloading}
                onLeftClick={appUpdateData.isForce ? installApp : null}
                onRightClick={installApp}
                backDropDisable={appUpdateData.isForce}
                persistentOnClick={true}
            />

            <MyOverlay
                overlay={showServerMessage}
                setOverlay={setShowServerMessage}
                message={serverMessage}
                titleFontSize={22}
                leftOption={'OK'}
                leftColor={'green'}
            />

            <MyOverlay
                overlay={isLoggedIn && forceLoggedOut}
                message={'You have been logged out'}
                titleColor={Colors.WARNING}
                leftOption={'OK'}
                leftColor={'red'}
                onLeftClick={() => dispatch(logout_api(false))}
                backDropDisable={true}
            />

            <MyOverlay
                overlay={internet && closeAppFlag}
                message={'Sorry! server doesnt respond, come back later'}
                titleFontSize={19}
                leftOption={'OK'}
                leftColor={'red'}
                onLeftClick={() => RNExitApp.exitApp()}
            />
        </>
    );
};

const style = StyleSheet.create({});


export default GlobalOverlays;
