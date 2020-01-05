import React from 'react';
import { View, StyleSheet, Keyboard, Text, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { authorizeUser, updateUsernameInput, updatePasswordInput } from '../actions';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Input from '../components/Input';
import { colors, fontSizes, whitespace, dimensions } from '../config/globalStyles';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';

interface Props {
    usernameInput: string;
    passwordInput: string;
    authorizingUser: boolean;
    authError?: string;
    authorizeUser(username: string, password: string): void;
    updateUsernameInput(text: string): void;
    updatePasswordInput(text: string): void;
}

class LoginScreen extends React.Component<Props> {

    getAuthError = () => {
        const { authError } = this.props;
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.error}>{authError === undefined ? '' : authError}</Text>
            </View>
        );
    }

    getSubmitButton = () => {
        return (
            <View style={styles.buttonView}>
                {
                    this.props.authorizingUser === true ?
                        <Spinner /> :
                        <Button onPress={this.submitButtonPressed}>
                            LOG IN
                        </Button>
                }
            </View>
        );
    }

    submitButtonPressed = () => {
        this.props.authorizeUser(this.props.usernameInput, this.props.passwordInput);
        Keyboard.dismiss();
    }

    getUsernameTextInput = () => {
        return (
            <View style={styles.inputContainer}>
                <Input
                    border={false}
                    multiline={false}
                    placeholder='Email'
                    maxLength={100}
                    secureTextEntry={false}
                    value={this.props.usernameInput}
                    onChangeText={this.props.updateUsernameInput}
                    textContentType='emailAddress'
                    keyboardType='email-address'
                    onSubmitEditing={this.submitButtonPressed}
                />
            </View>
        );
    }

    getPasswordTextInput = () => {
        return (
            <View style={styles.inputContainer}>
                <Input
                    border={false}
                    multiline={false}
                    placeholder='Password'
                    maxLength={100}
                    secureTextEntry={true}
                    value={this.props.passwordInput}
                    onChangeText={this.props.updatePasswordInput}
                    textContentType='password'
                    onSubmitEditing={this.submitButtonPressed}
                />
            </View>
        );
    }

    getLogo = () => {
        return (
            <Image
                style={styles.image}
                /*tslint:disable-next-line: no-require-imports */
                source={require('../../res/images/screendoorlogo.png')}
            />
        );
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.touchableContainer}>
                <KeyboardAvoidingView style={styles.container} behavior='position'>
                    {this.getLogo()}
                    {this.getAuthError()}
                    {this.getUsernameTextInput()}
                    {this.getPasswordTextInput()}
                    {this.getSubmitButton()}
                </KeyboardAvoidingView>
            </TouchableOpacity>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        authorizingUser: state.auth.authorizingUser,
        authError: state.auth.authError,
        usernameInput: state.auth.usernameInput,
        passwordInput: state.auth.passwordInput
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
    return {
        authorizeUser: (username: string, password: string) => dispatch(authorizeUser(username, password)),
        updateUsernameInput: (text: string) => dispatch(updateUsernameInput(text)),
        updatePasswordInput: (text: string) => dispatch(updatePasswordInput(text))
    };
};

const styles = StyleSheet.create({
    touchableContainer: {
        flex: 1
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: whitespace.m
    },
    inputContainer: {
        marginLeft: whitespace.xl,
        marginRight: whitespace.xl
    },
    buttonView: {
        marginTop: whitespace.s,
        paddingTop: whitespace.s,
        paddingBottom: whitespace.s,
        marginRight: whitespace.xxl,
        marginLeft: whitespace.xxl,
        justifyContent: 'center'
    },
    error: {
        color: colors.appRed,
        fontSize: fontSizes.m,
        paddingTop: whitespace.xs,
        paddingBottom: whitespace.xs
    },
    errorContainer: {
        height: dimensions.s,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: whitespace.xs,
        marginBottom: whitespace.xs
    },
    image: {
        marginTop: whitespace.xl,
        marginBottom: whitespace.s,
        alignSelf: 'center',
        height: dimensions.xl,
        resizeMode: 'contain'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
