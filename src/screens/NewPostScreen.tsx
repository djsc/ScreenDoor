import React from 'react';
import { View, Text, StyleSheet, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addPost, updateNewPostInput } from '../actions';
import { NavigationScreenProp } from 'react-navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { getLines } from '../lib/text';
import Header from '../components/Header';
import { fontSizes, whitespace, dimensions, colors } from '../config/globalStyles';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';

interface Props {
    navigation: NavigationScreenProp<any>;
    addingPost: boolean;
    newPostInput: string;
    displayWidthChars?: number;
    displayHeightChars?: number;
    newPostLength: number;
    updateNewPostInput(text: string): void;
    addPost(text: string): Promise<void>;
}

class NewPostScreen extends React.Component<Props> {
    static navigationOptions = () => {
        return {
            title: 'New'
        };
    };

    getCharIndicator = () => {
        const { displayWidthChars, displayHeightChars, newPostLength } = this.props;
        const maxChars = displayWidthChars === undefined || displayHeightChars === undefined ? 0 :
            displayWidthChars * displayHeightChars;
        const overLimit = newPostLength > maxChars;
        return (
            <Text style={overLimit ? styles.charCountOver : styles.charCountNormal}>{newPostLength}/{maxChars}</Text>
        );
    }

    getSubmitButton = () => {
        return (
            <View style={styles.buttonView}>
                {
                    this.props.addingPost === true ?
                        <Spinner /> :
                        <Button onPress={this.submitButtonPressed}>
                            SUBMIT
                        </Button>
                }
            </View>
        );
    }

    submitButtonPressed = () => {
        const { newPostInput, displayHeightChars, displayWidthChars, navigation } = this.props;
        Keyboard.dismiss();
        setTimeout(() => { // without this 0ms timeout, keyboard will pop back up on iOS.
            Alert.alert(
                'Add new post?',
                getLines(newPostInput, displayHeightChars, displayWidthChars).join('\n'),
                [
                    { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                    {
                        text: 'OK', onPress: () => {
                            this.props.addPost(newPostInput)
                                .then(() => navigation.navigate('StatusScreen'))
                                .catch(err => Alert.alert('Failed to add the post: ' + err));
                        }
                    }
                ]
            );
        }, 0);
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.touchableContainer}>
                <View>
                    <Header headerText='New Post' />
                    <View style={styles.inputContainer}>
                        <Input
                            border={true}
                            multiline={true}
                            numberOfLines={3}
                            secureTextEntry={false}
                            value={this.props.newPostInput}
                            onChangeText={this.props.updateNewPostInput}
                        />
                    </View>
                    <View style={styles.inputFooter}>
                        {this.getCharIndicator()}
                    </View>
                    {this.getSubmitButton()}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchableContainer: {
        flex: 1,
        backgroundColor: colors.appWhite
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        height: dimensions.s
    },
    inputContainer: {
        backgroundColor: colors.appWhite,
        paddingBottom: whitespace.xs
    },
    inputFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: whitespace.s,
        paddingRight: whitespace.s,
        paddingBottom: whitespace.s,
        justifyContent: 'flex-end'
    },
    charCountNormal: {
        alignSelf: 'center',
        fontSize: fontSizes.m
    },
    charCountOver: {
        alignSelf: 'center',
        fontSize: fontSizes.m,
        color: colors.appRed
    },
    buttonView: {
        paddingTop: whitespace.s,
        paddingBottom: whitespace.s,
        marginRight: whitespace.xxl,
        marginLeft: whitespace.xxl,
        justifyContent: 'center'
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        addingPost: state.posts.addingPost,
        newPostInput: state.posts.newPostInput,
        displayWidthChars: state.settings.displayWidthChars,
        displayHeightChars: state.settings.displayHeightChars,
        newPostLength: state.posts.newPostLength
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
    return {
        addPost: (text: string) => dispatch(addPost(text)),
        updateNewPostInput: (text: string) => dispatch(updateNewPostInput(text))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPostScreen);