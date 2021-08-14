import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import { createAction, ActionType } from 'typesafe-actions';
import Config from 'react-native-config';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { setupAuthListener } from './AuthActions';
import { setupStatusListener, setupStatusRefresher } from './StatusActions';
import { getLastPost, setupPostListener, setTimeZone } from './PostActions';

const APP_INITIALIZED = 'APP_INITIALIZED';
const APP_INITIALIZING = 'APP_INITIALIZING';
const FATAL_ERROR = 'FATAL_ERROR';
const FIREBASE_INITIALIZING = 'FIREBASE_INITIALIZING';
const FIREBASE_INITIALIZED = 'FIREBASE_INITIALIZED';

export const appActions = {
    appInitializing: createAction(APP_INITIALIZING, actionCallback => {
        return actionCallback;
    }),
    appInitialized: createAction(APP_INITIALIZED, actionCallback => {
        return actionCallback;
    }),
    fatalError: createAction(FATAL_ERROR, actionCallback => {
        return (error: string) => actionCallback({
            error
        });
    }),
    firebaseInitializing: createAction(FIREBASE_INITIALIZING, actionCallback => {
        return actionCallback;
    }),
    firebaseInitialized: createAction(FIREBASE_INITIALIZED, actionCallback => {
        return actionCallback;
    })
};

export const initializeApp = () => (
    async (dispatch: ThunkDispatch<RootState, void, AnyAction>, getState: () => RootState) => {
        if (getState().app.appInitializing === false && getState().app.appInitialized === false) {
            dispatch(appActions.appInitializing());
            try {
                await dispatch(setTimeZone());
                await dispatch(getLastPost());
                await dispatch(setupPostListener());
                await dispatch(setupStatusRefresher());
                await dispatch(setupStatusListener());
            } catch (err) {
                dispatch(appActions.fatalError(err));
            }
            dispatch(appActions.appInitialized());
        }
    }
);

export const initializeFirebase = () => (
    async (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        if (!firebase.apps.length) { // if firebase not already initialized
            const firebaseConfig = {
                apiKey: Config.FIREBASE_API_KEY,
                authDomain: Config.FIREBASE_AUTH_DOMAIN,
                databaseURL: Config.FIREBASE_DATABASE_URL,
                projectId: Config.FIREBASE_PROJECT_ID,
                storageBucket: Config.IREBASE_STORAGE_BUCKET,
                messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
                appId: Config.FIREBASE_APP_ID
            }
            dispatch(appActions.firebaseInitializing());
            try {
                firebase.initializeApp(firebaseConfig);
                await dispatch(setupAuthListener());
            } catch (err) {
                dispatch(appActions.fatalError(err));
            }
            dispatch(appActions.firebaseInitialized());
        }
    }
);

export type appActionType = ActionType<typeof appActions>;