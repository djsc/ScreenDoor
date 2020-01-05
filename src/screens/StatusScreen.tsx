import React from 'react';
import DisplayContainer from '../components/DisplayContainer';
import { View, StyleSheet, Text, Keyboard, TouchableOpacity } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { Status, StatusColor, StatusType } from '../types';
import { fontSizes, whitespace, iconSizes } from '../config/globalStyles';
import { RootState } from '../reducers';

interface Props {
    navigation: NavigationScreenProp<any>;
    status: Status;
}

class StatusScreen extends React.Component<Props> {
    static navigationOptions = () => {
        return {
            title: 'STATUS'
        };
    };

    getStatus = () => {
        const { statusType, timeSinceLastHeartbeat } = this.props.status;

        return (
            <View style={styles.statusContainer}>
                <Icon
                    name={'fiber-manual-record'}
                    size={iconSizes.m}
                    color={StatusColor[statusType]}
                />
                <Text style={styles.status}>{statusType.toString()}</Text>
                {
                    statusType === StatusType.OFFLINE ?
                        (timeSinceLastHeartbeat === '' ?
                            undefined :
                            <Text style={styles.status}> - {timeSinceLastHeartbeat} HOURS</Text>) :
                        undefined
                }
            </View>
        );
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.touchableContainer}>
                <View style={styles.container}>
                    <Header headerText='Status' />
                    {this.getStatus()}
                    <DisplayContainer />
                    <View style={styles.container} />
                    <View style={styles.container} />
                </View>
            </TouchableOpacity>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        status: state.status.status
    };
};

const styles = StyleSheet.create({
    touchableContainer: {
        flex: 1
    },
    statusContainer: {
        marginTop: whitespace.s,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    status: {
        fontSize: fontSizes.l
    },
    container: {
        flex: 1
    }
});

export default connect(mapStateToProps)(StatusScreen);
