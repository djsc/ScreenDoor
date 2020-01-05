import { getType } from 'typesafe-actions';
import { postActions, postActionType, authActionType, authActions } from '../actions';
import { Post } from '../types';
import { insertPost, removePost } from '../lib/posts';

export interface PostState {
    deletingPost: boolean;
    repostingPost: boolean;
    addingPost: boolean;
    fetchingPost: boolean;
    lastPostObtained: boolean; //the last post is obtained at the start of the app.
    postHistory: Post[];
    timeZone: string;
    selectedPostUuid?: string;
    sortByNewest: boolean;
    newPostInput: string;
    newPostLength: number;
}

const initialState: PostState = {
    deletingPost: false,
    repostingPost: false,
    addingPost: false,
    fetchingPost: false,
    lastPostObtained: false,
    postHistory: [],
    timeZone: 'UTC',
    sortByNewest: true,
    newPostInput: '',
    newPostLength: 0
};

const PostReducer = (
    state: PostState = initialState,
    action: postActionType | authActionType
) => {
    switch (action.type) {
        case getType(authActions.deauthorizeUserSucceeded): {
            return {
                ...initialState
            };
        }
        case getType(postActions.fetchingPost): {
            return {
                ...state,
                fetchingPost: true
            };
        }
        case getType(postActions.postFetched): {
            return {
                ...state,
                fetchingPost: false
            };
        }
        case getType(postActions.lastPostObtained): {
            return {
                ...state,
                lastPostObtained: true
            };
        }
        case getType(postActions.timeZoneSet): {
            return {
                ...state,
                timeZone: action.payload.timeZone
            };
        }
        case getType(postActions.selectedPostChanged): {
            return {
                ...state,
                selectedPostUuid: action.payload.selectedPostUuid
            };
        }
        case getType(postActions.sortButtonSet): {
            return {
                ...state,
                sortByNewest: action.payload.sortByNewest
            };
        }
        case getType(postActions.deletingPost): {
            return {
                ...state,
                deletingPost: true
            };
        }
        case getType(postActions.deletePostSucceeded): {
            return {
                ...state,
                selectedPostUuid: undefined,
                deletingPost: false
            };
        }
        case getType(postActions.deletePostFailed): {
            return {
                ...state,
                deletingPost: false
            };
        }
        case getType(postActions.repostingPost): {
            return {
                ...state,
                repostingPost: true
            };
        }
        case getType(postActions.repostPostSucceeded): {
            return {
                ...state,
                selectedPostUuid: undefined,
                repostingPost: false
            };
        }
        case getType(postActions.repostPostFailed): {
            return {
                ...state,
                repostingPost: false
            };
        }
        case getType(postActions.addingPost): {
            return {
                ...state,
                addingPost: true
            };
        }
        case getType(postActions.addPostSucceeded): {
            return {
                ...state,
                newPostInput: '',
                newPostLength: 0,
                addingPost: false
            };
        }
        case getType(postActions.addPostFailed): {
            return {
                ...state,
                addingPost: false
            };
        }
        case getType(postActions.addPostDetected): {
            const posts = [...state.postHistory];
            const post = action.payload.post;
            insertPost(posts, post); //inserts only if non-duplicate
            return {
                ...state,
                postHistory: posts
            };
        }
        case getType(postActions.deletePostDetected): {
            const posts = [...state.postHistory];
            const uuid = action.payload.post.uuid;
            removePost(posts, uuid);
            return {
                ...state,
                postHistory: posts
            };
        }
        case getType(postActions.changePostDetected): {
            const posts = [...state.postHistory];
            const post = action.payload.post;
            const uuid = post.uuid;
            removePost(posts, uuid);
            insertPost(posts, post);
            return {
                ...state,
                postHistory: posts
            };
        }
        case getType(postActions.newPostInputUpdated): {
            const { text } = action.payload;
            const numNewlineChars = (text.match(/\n/g) || []).length;
            return {
                ...state,
                newPostInput: text,
                newPostLength: text.length - numNewlineChars
            };
        }
        default: return state;
    }
};

export default PostReducer;