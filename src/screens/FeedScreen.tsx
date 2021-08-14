import React from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Feed from '../components/Feed';
import { colors } from '../config/globalStyles';

interface Props {
    navigation: NavigationScreenProp<any>;
}

export default class FeedScreen extends React.Component<Props> {

    static navigationOptions = () => {
        return {
            title: 'Posts'
        };
    };

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.touchableContainer}>
                <View style={styles.container}>
                    <Feed navigation={this.props.navigation} />
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
        backgroundColor: colors.appWhite
    }
});