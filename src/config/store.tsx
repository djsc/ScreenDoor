import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import PostReducer from '../reducers/PostReducer';
import AppReducer from '../reducers/AppReducer';
import SettingsReducer from '../reducers/SettingsReducer';
import AuthReducer from '../reducers/AuthReducer';
import StatusReducer from '../reducers/StatusReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsPersistConfig = {
    key: 'settings',
    storage: AsyncStorage
};

const rootReducer = combineReducers({
    settings: persistReducer(settingsPersistConfig, SettingsReducer),
    posts: PostReducer,
    app: AppReducer,
    auth: AuthReducer,
    status: StatusReducer
});

const configureStore = () => {
    const store = createStore(
        rootReducer,
        applyMiddleware(ReduxThunk));
    const persistor = persistStore(store);
    return { store, persistor };
};

export default configureStore;