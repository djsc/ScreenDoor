import { createAction, ActionType } from 'typesafe-actions';
import constants from '../config/constants';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';

const DISPLAY_WIDTH_CHARS_SET = 'DISPLAY_WIDTH_CHARS_SET';
const DISPLAY_HEIGHT_CHARS_SET = 'DISPLAY_HEIGHT_CHARS_SET';

export const settingsActions = {
    displayWidthCharsSet: createAction(DISPLAY_WIDTH_CHARS_SET, actionCallback => {
        return (widthChars: number | undefined) => actionCallback({
            widthChars
        });
    }),
    displayHeightCharsSet: createAction(DISPLAY_HEIGHT_CHARS_SET, actionCallback => {
        return (heightChars: number | undefined) => actionCallback({
            heightChars
        });
    })
};

export const setDisplayWidthChars = (widthCharsString: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        //replaces all non-numberals with an empty string and then parses the string to a number
        const widthChars = Number.parseInt(widthCharsString.replace(/\D/g, ''));
        if (!Number.isSafeInteger(widthChars)) {
            dispatch(settingsActions.displayWidthCharsSet(undefined));
        }
        //only update if not greater than max width
        if (widthChars <= constants.MAX_DISPLAY_WIDTH_CHARS) {
            dispatch(settingsActions.displayWidthCharsSet(widthChars));
        }
    }
);

export const setDisplayHeightChars = (heightCharsString: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        //replaces all non-numberals with an empty string and then parses the string to a number
        const heightChars: number = Number.parseInt(heightCharsString.replace(/\D/g, ''));
        if (!Number.isSafeInteger(heightChars)) {
            dispatch(settingsActions.displayHeightCharsSet(undefined));
        }
        //only update if not greater than max height
        if (heightChars <= constants.MAX_DISPLAY_HEIGHT_CHARS) {
            dispatch(settingsActions.displayHeightCharsSet(heightChars));
        }
    }
);

export type settingsActionType = ActionType<typeof settingsActions>;