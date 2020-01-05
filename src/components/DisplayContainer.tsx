import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import { Post } from '../types';
import { View, StyleSheet } from 'react-native';
import Display from './Display';
import { fontSizes, whitespace } from '../config/globalStyles';

interface Props {
    displayWidthChars?: number;
    displayHeightChars?: number;
    currentPost?: Post;
}

class DisplayContainer extends React.PureComponent<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Display
                    currentPost={this.props.currentPost}
                    displayWidthChars={this.props.displayWidthChars}
                    displayHeightChars={this.props.displayHeightChars}
                />
            </View>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        displayWidthChars: state.settings.displayWidthChars,
        displayHeightChars: state.settings.displayHeightChars,
        currentPost: (state.posts.postHistory.length > 0 ? state.posts.postHistory[0] : undefined)
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: whitespace.s,
        marginBottom: whitespace.s,
        marginRight: whitespace.m,
        marginLeft: whitespace.m
    },
    label: {
        alignSelf: 'center',
        fontSize: fontSizes.m
    }
});

export default connect(mapStateToProps)(DisplayContainer);