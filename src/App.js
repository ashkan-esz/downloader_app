import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {AppState, I18nManager, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import {Asset} from 'expo-asset';
import {AuthNavigations, AppStackNavigations} from "./navigation";
import {StatusBar} from 'expo-status-bar';
import {RootToast, LoggedOutModal, MyOverlay} from './components/atoms';
import {OfflineStatusBar} from "./components/molecules";
import {useDispatch, useSelector} from "react-redux";
import {profile_api, setShowUpdateOverlayFlag} from "./redux/slices/user.slice";
import {QueryClient, QueryClientProvider, focusManager} from 'react-query';
import {useKeepAwake} from 'expo-keep-awake';
import {LogBox} from 'react-native';
import {Colors} from "./styles";
import {useCheckUpdate} from "./hooks";

LogBox.ignoreLogs([
    'Setting a timer',
    '`flexWrap: `wrap`` is not supported with the `VirtualizedList',
    'VirtualizedLists should never be nested inside plain ScrollViews',
]);

//todo : check build commands
//todo : force to download new version from store
//todo : bottom of page is white
//todo : stop rotation except trailer fullscreen
//todo : remove unused dependencies
//todo : handle error show in home screen
//todo : fix ram usage of stack navigation
//todo : load prev data while loading app
//todo : sort components

//todo : add offline usage

//todo : add gesture
//todo : fix splash screen jump up before end

//todo : faster rating library


try {
    I18nManager.allowRTL(false);
} catch (e) {
    // todo : use sentry
    // console.log(e);
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 3.2 * 60 * 1000,
            staleTime: 3.2 * 60 * 1000
        }
    }
});

focusManager.setEventListener(handleFocus => {
    AppState.addEventListener('change', handleFocus)
    return () => {
        AppState.removeEventListener('change', handleFocus)
    }
});

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}

export default function App() {
    useKeepAwake();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const updateExist = useSelector(state => state.user.updateExist);
    const isDownloadingUpdate = useSelector(state => state.user.isDownloadingUpdate);
    const showUpdateOverlay = useSelector(state => state.user.showUpdateOverlay);
    const [isReady, setIsReady] = useState(false);
    const {downloadUpdate} = useCheckUpdate();

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(profile_api());
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn && isReady) {
            dispatch(profile_api());
        }
    }, [isLoggedIn]);

    const _loadAssetsAsync = async () => {
        try {
            const imageAssets = cacheImages([
                require('./assets/images/loadingImage.png'),
                require('./assets/images/noImage.png'),
            ]);

            const fontAssets = [FontAwesome.font, AntDesign.font].map(font => Font.loadAsync(font));

            await Promise.all([...imageAssets, ...fontAssets]);
        } catch (error) {

        }
    }

    if (!isReady) {
        return (
            <AppLoading
                startAsync={_loadAssetsAsync}
                onFinish={() => setIsReady(true)}
                onError={console.warn}
            />
        );
    }

    return (
        <View style={style.container}>
            <StatusBar style="light"/>
            <NavigationContainer>
                <QueryClientProvider client={queryClient}>
                    <OfflineStatusBar/>
                    <MyOverlay
                        overlay={(showUpdateOverlay && updateExist) || isDownloadingUpdate}
                        setOverlay={(value) => dispatch(setShowUpdateOverlayFlag(value))}
                        message={'There is a minor update (1mb)'}
                        leftOption={'CANCEL'}
                        rightOption={'UPDATE'}
                        rightColor={"green"}
                        isLoading={isDownloadingUpdate}
                        onRightClick={downloadUpdate}
                    />
                    <LoggedOutModal/>
                    {
                        isLoggedIn ? <AppStackNavigations/> : <AuthNavigations/>
                    }
                </QueryClientProvider>
                <RootToast/>
            </NavigationContainer>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.PRIMARY,
    }
});
