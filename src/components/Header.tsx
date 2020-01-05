import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, fontSizes, whitespace } from '../config/globalStyles';

interface Props {
    headerText: string;
}

export default class Header extends React.PureComponent<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.headerText}</Text>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.appOffWhite,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.appBlack,
        shadowColor: colors.appBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2
    },
    text: {
        fontSize: fontSizes.xl,
        paddingTop: whitespace.s,
        paddingBottom: whitespace.s,
        paddingLeft: whitespace.s,
        fontWeight: 'bold'
    }
});