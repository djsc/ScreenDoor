import { getType } from 'typesafe-actions';
import { authActions, authActionType } from '../actions';

export interface AuthState {
    authorizingUser: boolean;
    deauthorizingUser: boolean;
    userAuthorized?: boolean;
    authError?: string;
    usernameInput: string;
    passwordInput: string;
}

const initialState: AuthState = {
    authorizingUser: false,
    deauthorizingUser: false,
    usernameInput: '',
    passwordInput: ''
};

const AuthReducer = (
    state: AuthState = initialState,
    action: authActionType
) => {
    switch (action.type) {
        case getType(authActions.deauthorizeUserSucceeded): {
            return {
                ...initialState,
                userAuthorized: false
            };
        }
        case getType(authActions.usernameInputUpdated): {
            return {
                ...state,
                usernameInput: action.payload.text
            };
        }
        case getType(authActions.passwordInputUpdated): {
            return {
                ...state,
                passwordInput: action.payload.text
            };
        }
        case getType(authActions.authorizingUser): {
            return {
                ...state,
                authError: undefined,
                authorizingUser: true
            };
        }
        case getType(authActions.authorizeUserSucceeded): {
            return {
                ...state,
                authError: undefined,
                userAuthorized: true,
                authorizingUser: false,
                usernameInput: '',
                passwordInput: ''
            };
        }
        case getType(authActions.authorizeUserFailed): {
            return {
                ...state,
                authError: action.payload.error,
                authorizingUser: false
            };
        }
        case getType(authActions.deauthorizingUser): {
            return {
                ...state,
                deauthError: undefined,
                deauthorizingUser: true
            };
        }
        default: return state;
    }
};

export default AuthReducer;