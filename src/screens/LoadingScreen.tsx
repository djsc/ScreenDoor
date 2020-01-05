import React from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import Spinner from '../components/Spinner';

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
        flex: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});