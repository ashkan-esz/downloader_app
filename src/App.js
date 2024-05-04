import React, {useEffect} from 'react';
import {AppState, I18nManager, LogBox, PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {enableFreeze} from 'react-native-screens';
// import * as SplashScreen from 'expo-splash-screen';
// import {Asset} from 'expo-asset';
import {AppStackNavigations, AuthNavigations} from "./navigation";
import {StatusBar} from 'expo-status-bar';
import {RootToast} from './components/atoms';
import {GlobalOverlays, OfflineStatusBar} from "./components/molecules";
import {useDispatch, useSelector} from "react-redux";
import {checkAppUpdate_thunk, profile_api} from "./redux/slices/user.slice";
import {focusManager, onlineManager, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useKeepAwake} from 'expo-keep-awake';
import {Colors} from "./styles";
import {createTheme, ThemeProvider} from "@rneui/themed";
import NetInfo from '@react-native-community/netinfo';
import {persistor} from "./redux/store";
import messaging from '@react-native-firebase/messaging';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

LogBox.ignoreLogs([
    'Setting a timer',
    '`flexWrap: `wrap`` is not supported with the `VirtualizedList',
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'new NativeEventEmitter()',
]);

//todo : handle error show in home screen
//todo : sort components

//todo : fix 'MyOverlay' style

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


    //--------------------------------------------
    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            return (await messaging().getToken()).toString();
        } else {
            console.log('REQUEST PERMISSION DENIED');
            return null
        }
    };
    const getNewFCMToken = async () => {
        try {
            let token = await requestUserPermission();
            // console.log('Token:', token);
        } catch (error) {
            console.error('Error getting new FCM token:', error);
        }
    };

    //---------------------------------------------------
    //---------------------------------------------------
    // const Stack = createStackNavigator();
    const NAVIGATION_IDS = ['home', 'post', 'settings'];

    function buildDeepLinkFromNotificationData(data): string | null {
        const navigationId = data?.navigationId;
        if (!NAVIGATION_IDS.includes(navigationId)) {
            console.warn('Unverified navigationId', navigationId)
            return null;
        }
        if (navigationId === 'home') {
            return 'myapp://home';
        }
        if (navigationId === 'settings') {
            return 'myapp://settings';
        }
        const postId = data?.postId;
        if (typeof postId === 'string') {
            return `myapp://post/${postId}`
        }
        console.warn('Missing postId')
        return null
    }

    const linking = {
        prefixes: ['myapp://'],
        config: {
            initialRouteName: 'Home',
            screens: {
                Home: 'home',
                Post: 'post/:id',
                Settings: 'settings'
            }
        },
        async getInitialURL() {
            const url = await Linking.getInitialURL();
            if (typeof url === 'string') {
                return url;
            }
            //getInitialNotification: When the application is opened from a quit state.
            const message = await messaging().getInitialNotification();
            const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
            if (typeof deeplinkURL === 'string') {
                return deeplinkURL;
            }
        },
        subscribe(listener: (url: string) => void) {
            const onReceiveURL = ({url}: { url: string }) => listener(url);

            // Listen to incoming links from deep linking
            const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

            //onNotificationOpenedApp: When the application is running, but in the background.
            const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
                const url = buildDeepLinkFromNotificationData(remoteMessage.data)
                if (typeof url === 'string') {
                    listener(url)
                }
            });

            return () => {
                linkingSubscription.remove();
                unsubscribe();
            };
        },
    }
    //---------------------------------------------------
    //---------------------------------------------------


    useEffect(() => {
        //Handling Foreground Notifications
        messaging().onMessage((message) => {
            console.log('Foreground notification:', message);
        });

        //Handling Background Notifications
        messaging().setBackgroundMessageHandler((message) => {
            console.log('Background notification:', message);
            // Customize the handling of the notification based on your app's requirements
            return Promise.resolve();
        });
    }, []);

    useEffect(() => {
        // messaging().requestPermission().then(res => {
        //     console.log(res, messaging.AuthorizationStatus.AUTHORIZED, messaging.AuthorizationStatus.PROVISIONAL)
        // });
        messaging().getToken().then(token => {
        console.log("--- fcm token: ", token);
        })
        // messaging().onTokenRefresh(token => {
        //     console.log("--- fcm token2: ", token);
        // });

        //getInitialNotification: When the application is opened from a quit state.
        messaging().getInitialNotification().then(message => {
            if (message) {
                console.log(message.notification)
                console.log(message.data)
            }
        });

        //onNotificationOpenedApp: When the application is running, but in the background.
        messaging().onNotificationOpenedApp(message => {
            if (message) {
                console.log(message.notification)
                console.log(message.data)
            }
        });
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(checkAppUpdate_thunk());
            dispatch(profile_api());
            setTimeout(() => {
                persistor.flush();
            }, 2000);
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
