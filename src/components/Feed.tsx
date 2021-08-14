import React from 'react';
import { FlatList, StyleSheet, ListRenderItemInfo, Alert, TouchableOpacity } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { Post } from '../types';
import { postClicked, deletePost, repostPost, toggleSortButton } from '../actions';
import PostItem from './PostItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from './Header';
import { iconSizes } from '../config/globalStyles';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';

interface Props {
    navigation: NavigationScreenProp<any>;
    deletingPost: boolean;
    repostingPost: boolean;
    postHistory: Post[];
    activePostUuid?: string;
    timeZone: string;
    displayWidthChars?: number;
    displayHeightChars?: number;
    selectedPostUuid?: string;
    sortByNewest: boolean;
    postClicked(postUuid?: string): void;
    deletePost(postUuid: string): Promise<void>;
    repostPost(postUuid: string): Promise<void>;
    toggleSortButton(): void;
}

class Feed extends React.Component<Props> {

    renderItem = (info: ListRenderItemInfo<Post>) => {
        const { displayWidthChars, displayHeightChars, deletingPost,
            repostingPost, activePostUuid, selectedPostUuid, timeZone } = this.props;
        const post = info.item;
        const { uuid } = post;
        const active = activePostUuid === uuid;
        const selected = selectedPostUuid === uuid;

        return (
            <PostItem
                post={info.item}
                displayWidthChars={displayWidthChars}
                displayHeightChars={displayHeightChars}
                deletingPost={deletingPost && selected} //only true when selected or else all items will rerender
                repostingPost={repostingPost && selected} //only true when selected or else all items will rerender
                active={active}
                selected={selected}
                timeZone={timeZone}
                onPress={this.props.postClicked}
                onPressDelete={this.deleteButtonPressed}
                onPressRepost={this.repostButtonPressed}
            />
        );
    };

    keyExtractor = (item: Post) => item.uuid;

    sortButtonPressed = () => {
        this.props.postClicked();
        this.props.toggleSortButton();
    }

    deleteButtonPressed = (uuid: string) => {
        Alert.alert(
            '',
            'Delete the post?',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                { text: 'OK', onPress: () => this.props.deletePost(uuid).catch(err => { Alert.alert('Failed to delete the post: ' + err); }) }
            ]
        );
    }

    repostButtonPressed = (uuid: string) => {
        Alert.alert(
            '',
            'Repost the post?',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        this.props.repostPost(uuid)
                            .then(() => this.props.navigation.navigate('StatusScreen'))
                            .catch(err => { Alert.alert('Failed to repost the post: ' + err); });
                    }
                }
            ]
        );
    }

    getListHeader = () => {
        return (
            <Header headerText='Post History'>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={this.sortButtonPressed}
                    hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
                >
                    <Icon
                        name={this.props.sortByNewest === true ? 'arrow-drop-down' : 'arrow-drop-up'}
                        size={iconSizes.l}
                    />
                </TouchableOpacity>
            </Header>
        );
    }

    getData = () => {
        if (this.props.sortByNewest === true) {
            return this.props.postHistory;
        } else {
            return this.props.postHistory.slice().reverse();
        }
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={this.getData()}
                extraData={{
                    displayWidthChars: this.props.displayWidthChars,
                    displayHeightChars: this.props.displayHeightChars,
                    selectedPostUuid: this.props.selectedPostUuid
                }}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListHeaderComponent={this.getListHeader}
            />
        );
    }
}

const styles = StyleSheet.create({
    sortButton: {
        alignSelf: 'center'
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        deletingPost: state.posts.deletingPost,
        repostingPost: state.posts.repostingPost,
        postHistory: state.posts.postHistory,
        activePostUuid: state.posts.postHistory.length > 0 ? state.posts.postHistory[0].uuid : undefined,
        timeZone: state.posts.timeZone,
        displayWidthChars: state.settings.displayWidthChars,
        displayHeightChars: state.settings.displayHeightChars,
        selectedPostUuid: state.posts.selectedPostUuid,
        sortByNewest: state.posts.sortByNewest
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
    return {
        postClicked: (postUuid?: string) => dispatch(postClicked(postUuid)),
        deletePost: (postUuid: string) => dispatch(deletePost(postUuid)),
        repostPost: (postUuid: string) => dispatch(repostPost(postUuid)),
        toggleSortButton: () => dispatch(toggleSortButton())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);