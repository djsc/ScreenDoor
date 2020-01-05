import { getType } from 'typesafe-actions';
import { authActionType, authActions } from '../actions';
import { Status, StatusType } from '../types';
import { statusActionType, statusActions } from '../actions/StatusActions';

export interface StatusState {
    fetchingStatus: boolean;
    statusInitialized: boolean;
    status: Status;
}

const initialState: StatusState = {
    fetchingStatus: false,
    statusInitialized: false,
    status: { statusType: StatusType.UNKNOWN, timeSinceLastHeartbeat: ''}
};

const StatusReducer = (
    state: StatusState = initialState,
    action: statusActionType | authActionType
) => {
    switch (action.type) {
        case getType(authActions.deauthorizeUserSucceeded): {
            return {
                ...initialState
            };
        }
        case getType(statusActions.fetchingStatus): {
            return {
                ...state,
                fetchingStatus: true
            };
        }
        case getType(statusActions.fetchStatusSucceeded): {
            return {
                ...state,
                status: action.payload.status,
                fetchingStatus: false,
                statusInitialized: true
            };
        }
        case getType(statusActions.refreshStatus): {
            return {
                ...state,
                status: action.payload.status
            };
        }
        default: return state;
    }
};

export default StatusReducer;