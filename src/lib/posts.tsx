import { Post } from '../types';

/**
 * Inserts a post into a posts array which is ordered by descending timePosted.
 * NOTE: The original array is modified.
 * @param posts array or posts presorted in descending order or timePosted
 * @param post post to insert
 * @return true if post was inserted. false if not inserted due to duplicate post
 */
export const insertPost = (posts: Post[], post: Post): boolean => {
    const timestamp = post.timePosted;
    let low = 0;
    let high = posts.length;
    while (low < high) {
        // tslint:disable-next-line:no-bitwise
        const mid = (low + high) >>> 1;
        const midTimestamp = posts[mid].timePosted;
        if (timestamp === midTimestamp) {
            if (posts[mid].uuid !== post.uuid) {
                posts.splice(mid, 0, post);
                return true;
            }
            return false;
        } else if (timestamp < midTimestamp) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    posts.splice(low, 0, post);
    return true;
};

/**
 * Removed a post from a posts array.
 * NOTE: The original array is modified.
 * @param posts posts array
 * @param post post to remove
 * @return true if post removed. false if not found
 */
export const removePost = (posts: Post[], uuid: string): boolean => {
    const index = posts.map(p => p.uuid).indexOf(uuid);
    if (index === -1) {
        return false;
    }
    posts.splice(index, 1);
    return true;
};