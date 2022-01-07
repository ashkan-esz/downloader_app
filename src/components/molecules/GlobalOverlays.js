import React from 'react';
import {StyleSheet} from 'react-native';
import {MyOverlay} from "../atoms";
import {useDispatch, useSelector} from "react-redux";
import {logout_api} from "../../redux/slices/auth.slice";
import {setShowUpdateOverlayFlag} from "../../redux/slices/user.slice";
import {useCheckUpdate} from "../../hooks";
import {Colors} from "../../styles";
import RNExitApp from 'react-native-exit-app';

//todo : logout overlay --> reset flags on mount

const GlobalOverlays = () => {
    const dispatch = useDispatch();
    const internet = useSelector(state => state.user.internet);
    const updateExist = useSelector(state => state.user.updateExist);
    const isDownloadingUpdate = useSelector(state => state.user.isDownloadingUpdate);
    const showUpdateOverlay = useSelector(state => state.user.showUpdateOverlay);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const forceLoggedOut = useSelector(state => state.auth.forceLoggedOut);
    const closeAppFlag = useSelector(state => state.user.closeAppFlag);
    const {downloadUpdate} = useCheckUpdate();

    return (
        <>
            <MyOverlay
                overlay={(showUpdateOverlay && updateExist) || isDownloadingUpdate}
                setOverlay={() => dispatch(setShowUpdateOverlayFlag(false))}
                message={'There is a minor update (1mb)'}
                leftOption={'CANCEL'}
                rightOption={'UPDATE'}
                rightColor={"green"}
                isLoading={isDownloadingUpdate}
                onRightClick={downloadUpdate}
            />

            <MyOverlay
                overlay={isLoggedIn && forceLoggedOut}
                setOverlay={() => {
                }}
                message={'You have been logged out'}
                titleColor={Colors.WARNING}
                leftOption={'OK'}
                leftColor={'red'}
                onLeftClick={() => dispatch(logout_api(false))}
            />

            <MyOverlay
                overlay={internet && closeAppFlag}
                setOverlay={() => {
                }}
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
