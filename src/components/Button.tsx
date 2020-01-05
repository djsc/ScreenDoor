import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors, fontSizes, whitespace, dimensions } from '../config/globalStyles';

interface Props {
    onPress(): void;
    style?: ViewStyle | TextStyle | ImageStyle;
}

export default class Button extends React.PureComponent<Props> {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={[styles.buttonStyle, this.props.style]}>
                <Text style={styles.textStyle}>
                    {this.props.children}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        alignSelf: 'center',
        color: colors.appWhite,
        fontSize: fontSizes.s,
        fontWeight: '600',
        paddingTop: whitespace.s,
        paddingBottom: whitespace.s
    },
    buttonStyle: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        backgroundColor: colors.appDarkBlue,
        borderRadius: 5,
        borderWidth: dimensions.xs,
        borderColor: colors.appDarkBlue,
        marginLeft: whitespace.s,
        marginRight: whitespace.s,
        marginTop: whitespace.s,
        marginBottom: whitespace.s,
        paddingTop: whitespace.xs,
        paddingBottom: whitespace.xs
    }
});