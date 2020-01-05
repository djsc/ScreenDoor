import React from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Feed from '../components/Feed';

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
        flex: 1
    },
    container: {
        flex: 1
    }
});