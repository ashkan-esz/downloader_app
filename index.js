import 'react-native-gesture-handler';
import 'expo-asset';
import React from 'react';
import {registerRootComponent} from 'expo';

// if (process.env.NODE_ENV !== 'production') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {
//         trackAllPureComponents: true,
//     });
// }


import App from './src/App';
import {Provider} from "react-redux";
import {store, persistor} from "./src/redux/store";
import {PersistGate} from 'redux-persist/integration/react';
import {injectStore} from "./src/api/setupInterceptors";

injectStore(store);

const AppEntry = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
        </Provider>
    );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(AppEntry);
