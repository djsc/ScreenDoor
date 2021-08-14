import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, Keyboard, Text } from 'react-native';
import { RootState } from '../reducers';
import { fontSizes, colors } from '../config/globalStyles';

interface Props {
    fatalError?: any;
}

class ErrorScreen extends React.Component<Props> {
    getFatalError = () => {
        const err = this.props.fatalError;
        if (err === undefined) {
            return '';
        }
        if (typeof err === 'string') {
            return err;
        }
        if (err.message !== undefined) {
            return err.message;
        }
        if (err.reason !== undefined) {
            return err.reason;
        }
        if (err.msg !== undefined) {
            return err.msg;
        }
        return JSON.stringify(err);
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.touchableContainer}>
                <View style={styles.container}>
                    <Text style={styles.errorTitle}>Fatal error. Swipe away app before retrying.</Text>
                    <Text style={styles.error}>{this.getFatalError()}</Text>
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
        backgroundColor: colors.appWhite,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorTitle: {
        alignSelf: 'center',
        fontSize: fontSizes.m,
        color: colors.appRed
    },
    error: {
        fontSize: fontSizes.s
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        fatalError: state.app.fatalError
    };
};

export default connect(mapStateToProps)(ErrorScreen);