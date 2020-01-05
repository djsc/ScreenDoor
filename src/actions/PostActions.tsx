import firebase from '@firebase/app';
import { database } from 'firebase';
import { createAction, ActionType } from 'typesafe-actions';
import { Post } from '../types';
import moment from 'moment';
import 'moment-timezone';
import uuidv4 from 'uuid/v4';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { Vibration } from 'react-native';

const FETCHING_POST = 'FETCHING_POST';
const POST_FETCHED = 'POST_FETCHED';
const LAST_POST_OBTAINED = 'LAST_POST_OBTAINED';
const DELETING_POST = 'DELETING_POST';
const DELETE_POST_SUCCEEDED = 'DELETE_POST_SUCCEEDED';
const DELETE_POST_FAILED = 'DELETE_POST_FAILED';
const REPOSTING_POST = 'REPOSTING_POST';
const REPOST_POST_SUCCEEDED = 'REPOST_POST_SUCCEEDED';
const REPOST_POST_FAILED = 'REPOST_POST_FAILED';
const ADDING_POST = 'ADDING_POST';
const ADD_POST_SUCCEEDED = 'ADD_POST_SUCCEEDED';
const ADD_POST_FAILED = 'ADD_POST_FAILED';
const ADD_POST_DETECTED = 'ADD_POST_DETECTED';
const DELETE_POST_DETECTED = 'DELETE_POST_DETECTED';
const CHANGE_POST_DETECTED = 'CHANGE_POST_DETECTED';
const TIME_ZONE_SET = 'TIME_ZONE_SET';
const SELECTED_POST_CHANGED = 'SELECTED_POST_CHANGED';
const SORT_BUTTON_SET = 'SORT_BUTTON_SET';
const NEW_POST_INPUT_UPDATED = 'NEW_POST_INPUT_UPDATED';

export const postActions = {
    fetchingPost: createAction(FETCHING_POST, actionCallback => {
        return actionCallback;
    }),
    postFetched: createAction(POST_FETCHED, actionCallback => {
        return actionCallback;
    }),
    lastPostObtained: createAction(LAST_POST_OBTAINED, actionCallback => {
        return actionCallback;
    }),
    deletingPost: createAction(DELETING_POST, actionCallback => {
        return actionCallback;
    }),
    deletePostSucceeded: createAction(DELETE_POST_SUCCEEDED, actionCallback => {
        return actionCallback;
    }),
    deletePostFailed: createAction(DELETE_POST_FAILED, actionCallback => {
        return actionCallback;
    }),
    repostingPost: createAction(REPOSTING_POST, actionCallback => {
        return actionCallback;
    }),
    repostPostSucceeded: createAction(REPOST_POST_SUCCEEDED, actionCallback => {
        return actionCallback;
    }),
    repostPostFailed: createAction(REPOST_POST_FAILED, actionCallback => {
        return actionCallback;
    }),
    addingPost: createAction(ADDING_POST, actionCallback => {
        return actionCallback;
    }),
    addPostSucceeded: createAction(ADD_POST_SUCCEEDED, actionCallback => {
        return actionCallback;
    }),
    addPostFailed: createAction(ADD_POST_FAILED, actionCallback => {
        return actionCallback;
    }),
    addPostDetected: createAction(ADD_POST_DETECTED, actionCallback => { //triggered by Firebase
        return (post: Post) => actionCallback({
            post
        });
    }),
    deletePostDetected: createAction(DELETE_POST_DETECTED, actionCallback => { //triggered by Firebase
        return (post: Post) => actionCallback({
            post
        });
    }),
    changePostDetected: createAction(CHANGE_POST_DETECTED, actionCallback => { //triggered by Firebase
        return (post: Post) => actionCallback({
            post
        });
    }),
    timeZoneSet: createAction(TIME_ZONE_SET, actionCallback => {
        return (timeZone: string) => actionCallback({
            timeZone
        });
    }),
    selectedPostChanged: createAction(SELECTED_POST_CHANGED, actionCallback => {
        return (selectedPostUuid?: string) => actionCallback({
            selectedPostUuid
        });
    }),
    sortButtonSet: createAction(SORT_BUTTON_SET, actionCallback => {
        return (sortByNewest: boolean) => actionCallback({
            sortByNewest
        });
    }),
    newPostInputUpdated: createAction(NEW_POST_INPUT_UPDATED, actionCallback => {
        return (text: string) => actionCallback({
            text
        });
    })
};

export const getLastPost = () => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>): Promise<void> => {
        //@ts-ignore
        const { currentUser } = firebase.auth();
        if (currentUser === null) {
            return Promise.reject('No user found');
        }
        //@ts-ignore
        firebase.database().ref(`/users/${currentUser.uid}/posts`).orderByChild('timePosted').limitToLast(1)
            .once('value', (snapshot: database.DataSnapshot | null) => {
                if (snapshot === null || snapshot.hasChildren() === false) {
                    dispatch(postActions.lastPostObtained());
                    return;
                }
                let lastPost: Post | undefined;
                snapshot.forEach(snap => {
                    const post = snap.val() as Post;
                    if (!isValidPost(post)) {
                        return false;
                    }
                    lastPost = post;
                    return false;
                });
                if (lastPost) {
                    dispatch(postActions.addPostDetected(lastPost));
                }
                dispatch(postActions.lastPostObtained());
                return;
            });
        return Promise.resolve();
    }
);

//TODO: before this gets called, there will already be one post. make sure not to double-add posts
export const setupPostListener = () => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>): Promise<void> => {
        //@ts-ignore
        const { currentUser } = firebase.auth();
        if (currentUser === null) {
            return Promise.reject('No user found');
        }
        //@ts-ignore
        const postsRef = firebase.database().ref(`/users/${currentUser.uid}/posts`);
        postsRef.on('child_added', (data: database.DataSnapshot | null) => {
            dispatch(postActions.fetchingPost());
            if (data === null) {
                dispatch(postActions.postFetched());
                return;
            }
            const post = data.val() as Post;
            if (!isValidPost(post)) {
                dispatch(postActions.postFetched());
                return;
            }
            dispatch(postActions.addPostDetected(post));
            dispatch(postActions.postFetched());
        });
        postsRef.on('child_changed', (data: database.DataSnapshot | null) => {
            dispatch(postActions.fetchingPost());
            if (data === null) {
                dispatch(postActions.postFetched());
                return;
            }
            const post = data.val() as Post;
            if (!isValidPost(post)) {
                dispatch(postActions.postFetched());
                return;
            }
            dispatch(postActions.changePostDetected(post));
            dispatch(postActions.postFetched());
        });
        postsRef.on('child_removed', (data: database.DataSnapshot | null) => {
            dispatch(postActions.fetchingPost());
            if (data === null) {
                dispatch(postActions.postFetched());
                return;
            }
            const post = data.val() as Post;
            if (!isValidPost(post)) {
                dispatch(postActions.postFetched());
                return;
            }
            dispatch(postActions.deletePostDetected(post));
            dispatch(postActions.postFetched());
        });
        return Promise.resolve();
    }
);

const isValidPost = (post: any) => {
    return (
        post !== undefined &&
        post.text !== undefined &&
        post.timePosted !== undefined &&
        post.uuid !== undefined &&
        typeof post.text === 'string' &&
        typeof post.timePosted === 'number' &&
        typeof post.uuid === 'string'
    );
};

export const deletePost = (postUuid: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>, getState: () => RootState): Promise<void> => {
        dispatch(postActions.deletingPost());
        const fetchingPost = getState().posts.fetchingPost;
        const repostingPost = getState().posts.repostingPost;
        const addingPost = getState().posts.addingPost;
        if (repostingPost === true || addingPost === true || fetchingPost === true) {
            dispatch(postActions.deletePostFailed());
            return Promise.reject('Action already in progress.');
        }
        //@ts-ignore
        const { currentUser } = firebase.auth();
        if (currentUser === null) {
            return Promise.reject('User not authenticated.');
        }
        //@ts-ignore
        const ref = firebase.database().ref(`/users/${currentUser.uid}/posts/${postUuid}`);
        if (ref.key === null) {
            return Promise.reject('Post not found.');
        }
        return ref.remove()
            .then(() => {
                dispatch(postActions.deletePostSucceeded());
                return Promise.resolve();
            })
            .catch((a: Error) => {
                dispatch(postActions.deletePostFailed());
                return Promise.reject(a);
            });
    }
);

export const repostPost = (oldUuid: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>, getState: () => RootState): Promise<void> => {
        dispatch(postActions.repostingPost());
        const fetchingPost = getState().posts.fetchingPost;
        const deletingPost = getState().posts.deletingPost;
        const addingPost = getState().posts.addingPost;
        if (deletingPost === true || addingPost === true || fetchingPost === true) {
            dispatch(postActions.repostPostFailed());
            return Promise.reject('Action already in progress.');
        }
        const postIndex = getIndexFromUuid(getState(), oldUuid);
        const uuid = generateUuid();
        const timePosted = generateTimestamp();
        if (postIndex === undefined) {
            dispatch(postActions.repostPostFailed());
            return Promise.reject('Couldn\'t find the post.');
        }
        const text = getState().posts.postHistory[postIndex].text;
        const newPost: Post = { text, timePosted, uuid };
        //@ts-ignore
        const { currentUser } = firebase.auth();
        if (currentUser === null) {
            return Promise.reject('User not authenticated.');
        }
        //@ts-ignore
        return firebase.database().ref(`/users/${currentUser.uid}/posts/${newPost.uuid}`).set(newPost)
            .then(() => {
                dispatch(postActions.repostPostSucceeded());
                Promise.resolve();
            })
            .catch((a: Error) => {
                dispatch(postActions.repostPostFailed());
                return Promise.reject(a.message);
            });
    }
);

export const addPost = (text: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>, getState: () => RootState): Promise<void> => {
        dispatch(postActions.addingPost());
        const fetchingPost = getState().posts.fetchingPost;
        const deletingPost = getState().posts.deletingPost;
        const repostingPost = getState().posts.repostingPost;
        if (deletingPost === true || repostingPost === true || fetchingPost === true) {
            dispatch(postActions.addPostFailed());
            return Promise.reject('Action already in progress.');
        }
        const uuid = generateUuid();
        const timePosted = generateTimestamp();
        const newPost: Post = { text, timePosted, uuid };
        //@ts-ignore
        const { currentUser } = firebase.auth();
        if (currentUser === null) {
            return Promise.reject('User not authenticated.');
        }
        //@ts-ignore
        return firebase.database().ref(`/users/${currentUser.uid}/posts/${newPost.uuid}`).set(newPost)
            .then(() => {
                dispatch(postActions.addPostSucceeded());
                Promise.resolve();
            })
            .catch((a: Error) => {
                dispatch(postActions.addPostFailed());
                return Promise.reject(a.message);
            });
    }
);

/**
 * Sets the timezone so that post timestamps can be displayed in posts with local time
 * @param timeZone if not provided, uses best guess
 */
export const setTimeZone = (timeZone?: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>): Promise<void> => {
        if (timeZone === undefined) {
            dispatch(postActions.timeZoneSet(moment.tz.guess()));
        } else {
            dispatch(postActions.timeZoneSet(timeZone));
        }
        return Promise.resolve();
    }
);

export const postClicked = (postUuid?: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>, getState: () => RootState) => {
        const selectedPostUuid = getState().posts.selectedPostUuid;
        if (selectedPostUuid === undefined && postUuid === undefined) {
            return;
        } else if (selectedPostUuid === undefined && postUuid !== undefined) {
            dispatch(postActions.selectedPostChanged(postUuid));
            Vibration.vibrate(1, false);
        } else if (selectedPostUuid !== undefined && postUuid === undefined) {
            dispatch(postActions.selectedPostChanged());
        } else {
            dispatch(postActions.selectedPostChanged());
        }
    }
);

export const updateNewPostInput = (text: string) => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
        dispatch(postActions.newPostInputUpdated(text));
    }
);

export const toggleSortButton = () => (
    (dispatch: ThunkDispatch<RootState, void, AnyAction>, getState: () => RootState) => {
        dispatch(postActions.sortButtonSet(getState().posts.sortByNewest === true ? false : true));
    }
);

/**
 * returns the index in postHistory of the post with the provided uuid. undefined if not found.
 * @param state rootstate
 * @param postUuid uuid of post to get index of
 */
const getIndexFromUuid = (state: RootState, postUuid: string): number | undefined => {
    const posts = state.posts.postHistory;
    const index = posts.findIndex((post: Post) => {
        return post.uuid === postUuid;
    });
    return (index === -1 ? undefined : index);
};

const generateUuid = (): string => {
    return uuidv4();
};

const generateTimestamp = (): number => {
    return moment.now();
};

export type postActionType = ActionType<typeof postActions>;