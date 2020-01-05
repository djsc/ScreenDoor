import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { whitespace } from '../config/globalStyles';

interface Props {
    size?: number | 'small' | 'large';
    style?: ViewStyle | TextStyle | ImageStyle;
}

export default class Spinner extends React.PureComponent<Props> {
    render() {
        return (
            <View style={[styles.spinnerStyle, this.props.style]}>
                <ActivityIndicator size={this.props.size || 'large'} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    spinnerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: whitespace.s,
        marginRight: whitespace.s,
        marginTop: whitespace.s,
        marginBottom: whitespace.s
    }
});