import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {AppState, I18nManager, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import {Asset} from 'expo-asset';
import {enableScreens} from 'react-native-screens';
import {AuthNavigations, HomeStackNavigations} from "./navigation";
import {StatusBar} from 'expo-status-bar';
import {QueryClient, QueryClientProvider, focusManager} from 'react-query';
import {LogBox} from 'react-native';
import {Colors} from "./styles";

LogBox.ignoreLogs([
    'Setting a timer',
    '`flexWrap: `wrap`` is not supported with the `VirtualizedList',
    'VirtualizedLists should never be nested inside plain ScrollViews',
]);


//todo : force to download new version from store
//todo : bottom of page is white
//todo : stop rotation except trailer fullscreen
//todo : remove unused dependencies
//todo : handle error show in home screen
//todo : fix ram usage of stack navigation
//todo : load prev data while loading app
//todo : sort components

//todo : faster rating library

enableScreens();

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

function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
}


export default function App() {
    const [isReady, setIsReady] = useState(false);

    const _loadAssetsAsync = async () => {
        const imageAssets = cacheImages([]);

        //todo : replace icons with expo/vector-icons
        //todo : use less font family
        const fontAssets = cacheFonts([FontAwesome.font, AntDesign.font]);

        await Promise.all([...imageAssets, ...fontAssets]);
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
                    {/*<AuthNavigations/>*/}
                    <HomeStackNavigations/>
                </QueryClientProvider>
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
