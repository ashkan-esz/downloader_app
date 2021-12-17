import {configureStore} from '@reduxjs/toolkit'
import rootReducer, {userPersistConfig} from "../reducers/rootReducer";
import {
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';


const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            thunk: {extraArgument: {userPersistConfig}}
        }),
});

const persistor = persistStore(store);

export {store, persistor};
