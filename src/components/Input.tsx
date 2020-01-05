import React from 'react';
import {
    TextInput, View, StyleSheet, ReturnKeyType, TouchableOpacity, KeyboardTypeOptions, ImageStyle, TextStyle, ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fontSizes, whitespace, dimensions, iconSizes } from '../config/globalStyles';

interface Props {
    containerStyle?: ImageStyle | TextStyle | ViewStyle;
    border: boolean;
    multiline: boolean;
    maxLength?: number;
    numberOfLines?: number;
    secureTextEntry: boolean;
    placeholder?: string;
    value: string | undefined;
    returnKeyType?: ReturnKeyType;
    removeClearButton?: boolean;
    textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' |
    'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' |
    'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' |
    'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' |
    'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' |
    'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' |
    'password';
    keyboardType?: KeyboardTypeOptions;
    onChangeText(text: string): void;
    onSubmitEditing?(): void;
    onEndEditing?(): void;
    onFocus?(): void;
}

interface State {
    focused: boolean;
}

export default class Input extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            focused: false
        };
    }

    clearInput = () => {
        this.props.onChangeText('');
    }

    renderClearButton = () => {
        const hideClearButton = this.props.removeClearButton === true || this.state.focused === false ||
            this.props.value === undefined || this.props.value === '';
        return (
            <TouchableOpacity onPress={this.clearInput} disabled={hideClearButton}>
                <Icon
                    name={'clear'}
                    size={iconSizes.s}
                    style={styles.clearIcon}
                    color={hideClearButton === true ? colors.appTransparent : colors.appGrey}
                />
            </TouchableOpacity>
        );
    };

    handleOnFocus = () => {
        this.setState({ focused: true });
        if (this.props.onFocus !== undefined) {
            this.props.onFocus();
        }
    };

    handleOnEndEditing = () => {
        this.setState({ focused: false });
        if (this.props.onEndEditing !== undefined) {
            this.props.onEndEditing();
        }
    };

    handleOnSubmitEditing = () => {
        this.setState({ focused: false });
        if (this.props.onSubmitEditing !== undefined) {
            this.props.onSubmitEditing();
        }
    };

    render() {
        const { border, containerStyle, numberOfLines, secureTextEntry, placeholder, value,
            onChangeText, returnKeyType, multiline, maxLength, textContentType, keyboardType } = this.props;
        return (
            <View style={[border === true ? styles.containerStyleBorder : styles.containerStyleNoBorder,
            containerStyle]}>
                <TextInput
                    //@ts-ignore
                    minHeight={numberOfLines === undefined ? undefined : numberOfLines * 27}
                    underlineColorAndroid='transparent'
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                    autoCorrect={false}
                    style={styles.inputStyle}
                    value={value}
                    onChangeText={onChangeText}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={this.handleOnSubmitEditing}
                    onEndEditing={this.handleOnEndEditing}
                    onFocus={this.handleOnFocus}
                    multiline={multiline}
                    maxLength={maxLength}
                    numberOfLines={numberOfLines}
                    textContentType={textContentType}
                    keyboardType={keyboardType}
                />
                {this.renderClearButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        textAlignVertical: 'top',
        padding: whitespace.s,
        fontSize: fontSizes.m,
        flex: 1
    },
    containerStyleBorder: {
        borderColor: colors.appLightGrey,
        borderWidth: dimensions.xs,
        backgroundColor: colors.appWhite,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.appGrey,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    containerStyleNoBorder: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.appDarkGrey,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    clearIcon: {
        marginRight: whitespace.s
    }
});