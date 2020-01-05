import firebase from '@firebase/app';
import { createAction, ActionType } from 'typesafe-actions';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { initializeApp } from './AppActions';

const AUTHORIZING_USER = 'AUTHORIZING_USER';
const AUTHORIZE_USER_SUCCEEDED = 'AUTHORIZE_USER_SUCCEEDED';
const AUTHORIZE_USER_FAILED = 'AUTHORIZE_USER_FAILED';
const DEAUTHORIZING_USER = 'DEAUTHORIZING_USER';
const DEAUTHORIZE_USER_SUCCEEDED = 'DEAUTHORIZE_USER_SUCCEEDED';
const USERNAME_INPUT_UPDATED = 'USERNAME_INPUT_UPDATED';
const PASSWORD_INPUT_UPDATED = 'PASSWORD_INPUT_UPDATED';

export const authActions = {
    authorizingUser: createAction(AUTHORIZING_USER, actionCallback => {
        return actionCallback;
    }),
    authorizeUserSucceeded: createAction(AUTHORIZE_USER_SUCCEEDED, actionCallback => {
        return actionCallback;
    }),
    authorizeUserFailed: createAction(AUTHORIZE_USER_FAILED, actionCallback => {
        return (error: string) => actionCallback({
            error
        });
    }),
    deauthorizingUser: createAction(DEAUTHORIZING_USER, actionCallback => {
        return actionCallback;
    }),
    deauthorizeUserSucceeded: createAction(DEAUTHORIZE_USER_SUCCEEDED, actionCallback => {
        return actionCallback;
    }),
    usernameInputUpdated: createAction(USERNAME_INPUT_UPDATED, actionCallback => {
        return (text: string) => actionCallback({
            text
        });
    }),
    passwordInputUpdated: createAction(PASSWORD_INPUT_UPDATED, actionCallback => {
        return (text: string) => actionCallback({
            text
        });
    })
};

export const setupAuthListener = () => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>): Promise<void> => {
        //@ts-ignore
        firebase.auth().onAuthStateChanged((user) => {
            if (user === null) {
                dispatch(authActions.deauthorizeUserSucceeded());
            } else {
                dispatch(authActions.authorizeUserSucceeded());
                dispatch(initializeApp());
            }
        });
        return Promise.resolve();
    }
);

export const authorizeUser = (username: string, password: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        dispatch(authActions.authorizingUser());
        //@ts-ignore
        firebase.auth().signInWithEmailAndPassword(username, password)
            .then(() => {
                dispatch(authActions.authorizeUserSucceeded());
                dispatch(initializeApp());
            })
            .catch((err) => {
                if (err.code === 'auth/network-request-failed') {
                    dispatch(authActions.authorizeUserFailed('Network error'));
                } else {
                    dispatch(authActions.authorizeUserFailed('Invalid email/password'));
                }
            });
    }
);

export const deauthorizeUser = () => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        dispatch(authActions.deauthorizingUser());
        //@ts-ignore
        firebase.auth().signOut()
            .finally(() => {
                dispatch(authActions.deauthorizeUserSucceeded());
            });
    }
);

export const updateUsernameInput = (text: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        dispatch(authActions.usernameInputUpdated(text));
    }
);

export const updatePasswordInput = (text: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        dispatch(authActions.passwordInputUpdated(text));
    }
);

export type authActionType = ActionType<typeof authActions>;