import firebase from '@firebase/app';
import { createAction, ActionType } from 'typesafe-actions';
import { Status, StatusType } from '../types';
import moment from 'moment-timezone';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import constants from '../config/constants';

const FETCHING_STATUS = 'FETCHING_STATUS';
const FETCH_STATUS_SUCCEEDED = 'FETCH_STATUS_SUCCEEDED';
const REFRESH_STATUS = 'UPDATE_TIME_SINCE_LAST_HEARTBEAT';

export const statusActions = {
    fetchingStatus: createAction(FETCHING_STATUS, actionCallback => {
        return actionCallback;
    }),
    fetchStatusSucceeded: createAction(FETCH_STATUS_SUCCEEDED, actionCallback => {
        return (status: Status) => actionCallback({
            status
        });
    }),
    refreshStatus: createAction(REFRESH_STATUS, actionCallback => {
        return (status: Status) => actionCallback({
            status
        });
    })
};

export const setupStatusListener = () => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>): Promise<void> => {
        //@ts-ignore
        const { currentUser } = firebase.auth();
        if (currentUser === null) {
            return Promise.reject('No user found');
        }
        //@ts-ignore
        firebase.database().ref(`/users/${currentUser.uid}/lastHeartbeat`)
            .on('value', (snapshot) => {
                dispatch(statusActions.fetchingStatus());
                if (snapshot === null || typeof snapshot.val() !== 'number') {
                    dispatch(statusActions.fetchStatusSucceeded(getStatus()));
                    return;
                }
                const lastHeartbeat: number = snapshot.val() as number;
                if (lastHeartbeat === undefined) {
                    dispatch(statusActions.fetchStatusSucceeded(getStatus()));
                    return;
                }
                dispatch(statusActions.fetchStatusSucceeded(getStatus(lastHeartbeat)));
                return;
            });
        return Promise.resolve();
    }
);

export const setupStatusRefresher = () => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>, getState: () => RootState): Promise<void> => {
        setInterval(() => {
            const lastHeartbeat = getState().status.status.lastHeartbeat;
            dispatch(statusActions.refreshStatus(getStatus(lastHeartbeat)));
        }, constants.STATUS_REFRESHER_INTERVAL_MS);
        return Promise.resolve();
    }
);

const getStatus = (lastHeartbeat?: number): Status => {
    return {
        statusType: getStatusType(lastHeartbeat),
        lastHeartbeat,
        timeSinceLastHeartbeat: getTimeSinceLastHeartbeat(lastHeartbeat)
    };
};

const getStatusType = (lastHeartbeat?: number): StatusType => {
    if (lastHeartbeat === undefined) {
        return StatusType.UNKNOWN;
    }
    return moment.now() - lastHeartbeat > constants.OLDEST_HEARTBEAT_MS_STILL_ONLINE ?
        StatusType.OFFLINE : StatusType.ONLINE;
};

const getTimeSinceLastHeartbeat = (lastHeartbeat?: number): string => {
    if (lastHeartbeat === undefined) {
        return '';
    }
    return moment.duration(moment.now() - lastHeartbeat).asHours().toFixed(1);
};

export type statusActionType = ActionType<typeof statusActions>;