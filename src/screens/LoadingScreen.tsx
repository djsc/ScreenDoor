import React from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import Spinner from '../components/Spinner';
import { colors } from '../config/globalStyles';

export default class LoadingScreen extends React.Component {

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.touchableContainer}>
                <View style={styles.container}>
                    <Spinner size='large' />
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
    }
});