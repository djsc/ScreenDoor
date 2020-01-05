import { getType } from 'typesafe-actions';
import { appActions, appActionType, authActionType, authActions } from '../actions';

export interface AppState {
    appInitializing: boolean;
    appInitialized: boolean;
    fatalError?: any;
    firebaseInitializing: boolean;
    firebaseInitialized: boolean;
}

const initialState: AppState = {
    appInitializing: false,
    appInitialized: false,
    firebaseInitializing: false,
    firebaseInitialized: false
};

const AppReducer = (
    state: AppState = initialState,
    action: appActionType | authActionType
) => {
    switch (action.type) {
        case getType(authActions.deauthorizeUserSucceeded): {
            return {
                ...initialState
            };
        }
        case getType(appActions.appInitializing): {
            return {
                ...state,
                appInitializing: true,
                appInitialized: false
            };
        }
        case getType(appActions.appInitialized): {
            return {
                ...state,
                appInitializing: false,
                appInitialized: true
            };
        }
        case getType(appActions.fatalError): {
            return {
                ...state,
                fatalError: action.payload.error
            };
        }
        case getType(appActions.firebaseInitializing): {
            return {
                ...state,
                firebaseInitializing: true,
                firebaseInitialized: false
            };
        }
        case getType(appActions.firebaseInitialized): {
            return {
                ...state,
                firebaseInitializing: false,
                firebaseInitialized: true
            };
        }
        default: return state;
    }
};

export default AppReducer;