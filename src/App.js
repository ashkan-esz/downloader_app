import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {AppState, I18nManager, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {enableFreeze} from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import {Asset} from 'expo-asset';
import {AuthNavigations, AppStackNavigations} from "./navigation";
import {StatusBar} from 'expo-status-bar';
import {RootToast} from './components/atoms';
import {GlobalOverlays, OfflineStatusBar} from "./components/molecules";
import {useDispatch, useSelector} from "react-redux";
import {profile_api} from "./redux/slices/user.slice";
import {QueryClient, QueryClientProvider, focusManager} from '@tanstack/react-query';
import {useKeepAwake} from 'expo-keep-awake';
import {LogBox} from 'react-native';
import {Colors} from "./styles";
import {ThemeProvider} from "@rneui/themed";

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
//todo : save app password
//todo : fix auth forms

//todo : add offline usage

//todo : fuse icons in gradle

//todo : add gesture
//todo : fix splash screen jump up before end
//todo : fix keyboard in auth screens forms

//todo : fix 'MyOverlay' style

//todo : show no update available on icon click
//todo : check for update option in profile screen
//todo : ota update dont come again after cancel
//todo : why app update on restart

//todo : app starts soo slow
//todo : use proguard

//------------------------------------------------

enableFreeze(true);

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
    const subscription = AppState.addEventListener('change', handleFocus)
    return () => {
        subscription.remove();
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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    useKeepAwake();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                const imageAssets = cacheImages([
                    require('./assets/images/loadingImage.png'),
                    require('./assets/images/noImage.png'),
                ]);
                // Pre-load fonts, make any API calls you need to do here
                //todo : check adding 'MaterialIcons' performance
                const fontAssets = [FontAwesome.font, AntDesign.font].map(font => Font.loadAsync(font));

                await Promise.all([...imageAssets, ...fontAssets]);
            } catch (error) {
                console.warn(error);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(profile_api());
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn && appIsReady) {
            dispatch(profile_api());
        }
    }, [isLoggedIn]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View style={style.container} onLayout={onLayoutRootView}>
            <StatusBar style="light"/>
            <NavigationContainer>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
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
