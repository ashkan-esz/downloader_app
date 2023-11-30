import React, {useCallback, useEffect, useState} from 'react';
import {AppState, I18nManager, View, StyleSheet, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {enableFreeze} from 'react-native-screens';
// import * as SplashScreen from 'expo-splash-screen';
// import {Asset} from 'expo-asset';
import {AuthNavigations, AppStackNavigations} from "./navigation";
import {StatusBar} from 'expo-status-bar';
import {RootToast} from './components/atoms';
import {GlobalOverlays, OfflineStatusBar} from "./components/molecules";
import {useDispatch, useSelector} from "react-redux";
import {profile_api} from "./redux/slices/user.slice";
import {QueryClient, QueryClientProvider, focusManager, onlineManager} from '@tanstack/react-query';
import {useKeepAwake} from 'expo-keep-awake';
import {LogBox} from 'react-native';
import {Colors} from "./styles";
import {createTheme, ThemeProvider} from "@rneui/themed";
import NetInfo from '@react-native-community/netinfo';

LogBox.ignoreLogs([
    'Setting a timer',
    '`flexWrap: `wrap`` is not supported with the `VirtualizedList',
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'new NativeEventEmitter()',
]);

//todo : handle error show in home screen
//todo : sort components

//todo : load prev data while loading app

//todo : fix 'MyOverlay' style

//todo : show no update available on icon click
//todo : check for update option in profile screen

//todo : re check react-query loading/pending/fetching flags
//todo : re check infinite scrolling api call + react-query + redux

//------------------------------------------------

enableFreeze(true);

const theme = createTheme({});

try {
    I18nManager.allowRTL(false);
} catch (e) {
    // console.log(e);
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 3.2 * 60 * 1000,
            staleTime: 3.2 * 60 * 1000
        }
    }
});

onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected)
    })
});

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync().catch(() => {
//     /* reloading the app might trigger some race conditions, ignore them */
// });

export default function App() {
    useKeepAwake();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    // const [appIsReady, setAppIsReady] = useState(false);

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         dispatch(profile_api());
    //     }
    // }, []);

    function onAppStateChange(status) {
        if (Platform.OS !== 'web') {
            focusManager.setFocused(status === 'active')
        }
    }

    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange);
        return () => subscription.remove()
    }, []);

    // useEffect(() => {
    //     async function prepare() {
    //         try {
    //             const imageAssets = [
    //                 require('./assets/icons/logo.png'),
    //                 require('./assets/icons/imdb.png'),
    //                 require('./assets/icons/mal.png'),
    //             ];
    //             const imageAssetsPromise = imageAssets.map(image => {
    //                 if (typeof image === 'string') {
    //                     return Image.prefetch(image);
    //                 } else {
    //                     return Asset.fromModule(image).downloadAsync();
    //                 }
    //             });
    //             await Promise.all(imageAssetsPromise);
    //         } catch (error) {
    //             console.warn(error);
    //         } finally {
    //             // Tell the application to render
    //             setAppIsReady(true);
    //         }
    //     }
    //
    //     prepare();
    // }, []);

    // const onLayoutRootView = useCallback(async () => {
    //     if (appIsReady) {
    //         // This tells the splash screen to hide immediately! If we call this after
    //         // `setAppIsReady`, then we may see a blank screen while the app is
    //         // loading its initial state and rendering its first pixels. So instead,
    //         // we hide the splash screen once we know the root view has already
    //         // performed layout.
    //         await SplashScreen.hideAsync();
    //     }
    // }, [appIsReady]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(profile_api());
        }
    }, [isLoggedIn]);

    // useEffect(() => {
    //     if (isLoggedIn && appIsReady) {
    //         dispatch(profile_api());
    //     }
    // }, [isLoggedIn]);
    //
    // if (!appIsReady) {
    //     return null;
    // }

    return (
        // <View style={style.container} onLayout={onLayoutRootView}>
        <View style={style.container}>
            <StatusBar style="light"
                // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                // backgroundColor={backgroundStyle.backgroundColor}
            />
            <NavigationContainer>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        <OfflineStatusBar/>
                        <GlobalOverlays/>
                        {
                            isLoggedIn ? <AppStackNavigations/> : <AuthNavigations/>
                        }
                    </ThemeProvider>
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
