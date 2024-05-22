export default {
    "slug": "downloader_app",
    "runtimeVersion": "1.0.0",
    "updates": {
        "enabled": false,
        "fallbackToCacheTimeout": 0
    },
    "splash": {
        "image": "./src/assets/images/splashScreen.png",
        "backgroundColor": "#22222B",
        "resizeMode": "contain"
    },
    "assetBundlePatterns": [
        "assets/images/*"
    ],
    "name": 'downloader_app',
    "ios": {
        "bundleIdentifier": "com.ashkanaz2828.downloader-app",
        "buildNumber": "1.0.0",
        "jsEngine": "hermes"
    },
    "android": {
        "package": "com.ashkanaz2828.downloader_app",
        "versionCode": 1,
        "jsEngine": "hermes"
    },
    "plugins": [
        "expo-av",
        "expo-splash-screen",
        "expo-secure-store",
    ]
};
