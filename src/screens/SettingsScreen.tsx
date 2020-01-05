import React from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { setDisplayWidthChars, setDisplayHeightChars, deauthorizeUser } from '../actions';
import { NavigationScreenProp } from 'react-navigation';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { fontSizes, whitespace, dimensions } from '../config/globalStyles';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';

interface Props {
    navigation: NavigationScreenProp<any>;
    displayWidthChars?: number;
    displayHeightChars?: number;
    setDisplayWidthChars(widthCharsString: string): void;
    setDisplayHeightChars(heightCharsString: string): void;
    deauthorizeUser(): void;
}

class SettingsScreen extends React.Component<Props> {
    static navigationOptions = () => {
        return {
            title: 'Config'
        };
    };

    getLogoutButton = () => {
        return (
            <View style={styles.buttonView}>
                <Button onPress={this.props.deauthorizeUser}>
                    LOG OUT
                </Button>
            </View>
        );
    }

    getDimensionsSetting = () => {
        const { displayWidthChars, displayHeightChars } = this.props;

        return (
            <View style={styles.settingContainer}>
                <Text style={styles.settingName}>LCD WxH:</Text>
                <Input
                    containerStyle={styles.dimensionsInput}
                    border={false}
                    multiline={false}
                    placeholder='Width'
                    secureTextEntry={false}
                    value={displayWidthChars === undefined ? '' : displayWidthChars.toString()}
                    onChangeText={this.props.setDisplayWidthChars}
                    keyboardType='numeric'
                />
                <Input
                    containerStyle={styles.dimensionsInput}
                    border={false}
                    multiline={false}
                    placeholder='Height'
                    secureTextEntry={false}
                    value={displayHeightChars === undefined ? '' : displayHeightChars.toString()}
                    onChangeText={this.props.setDisplayHeightChars}
                    keyboardType='numeric'
                />
            </View>
        );
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.touchableContainer}>
                <View style={styles.container}>
                    <Header headerText='Config' />
                    {this.getDimensionsSetting()}
                    {this.getLogoutButton()}
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
        flexDirection: 'column'
    },
    settingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: dimensions.m
    },
    settingName: {
        fontSize: fontSizes.m,
        marginLeft: whitespace.m,
        alignSelf: 'center'
    },
    dimensionsInput: {
        flex: 1,
        height: dimensions.s,
        marginLeft: whitespace.s,
        marginRight: whitespace.s,
        alignSelf: 'center'
    },
    buttonView: {
        marginTop: whitespace.s,
        paddingTop: whitespace.s,
        paddingBottom: whitespace.s,
        marginRight: whitespace.xxl,
        marginLeft: whitespace.xxl,
        justifyContent: 'center'
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        displayWidthChars: state.settings.displayWidthChars,
        displayHeightChars: state.settings.displayHeightChars
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
    return {
        setDisplayWidthChars: (widthCharsString: string) => dispatch(setDisplayWidthChars(widthCharsString)),
        setDisplayHeightChars: (heightCharsString: string) => dispatch(setDisplayHeightChars(heightCharsString)),
        deauthorizeUser: () => dispatch(deauthorizeUser())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
