import { getType } from 'typesafe-actions';
import { settingsActions, settingsActionType } from '../actions';

export interface SettingsState {
    displayWidthChars?: number;
    displayHeightChars?: number;
}

const initialState: SettingsState = {
    displayWidthChars: 20,
    displayHeightChars: 4
};

const SettingsReducer = (
    state: SettingsState = initialState,
    action: settingsActionType
) => {
    switch (action.type) {
        case getType(settingsActions.displayWidthCharsSet): {
            return {
                ...state,
                displayWidthChars: action.payload.widthChars
            };
        }
        case getType(settingsActions.displayHeightCharsSet): {
            return {
                ...state,
                displayHeightChars: action.payload.heightChars
            };
        }
        default: return state;
    }
};

export default SettingsReducer;