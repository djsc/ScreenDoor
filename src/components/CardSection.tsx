import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors, whitespace } from '../config/globalStyles';

interface Props {
    style?: ViewStyle | TextStyle | ImageStyle;
}

export default class CardSection extends React.PureComponent<Props> {
    render() {
        return (
            <View style={[styles.containerStyle, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: whitespace.s,
        backgroundColor: colors.appWhite,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        borderColor: colors.appGrey,
        position: 'relative'
    }
});