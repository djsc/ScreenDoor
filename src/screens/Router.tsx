import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import StatusScreen from './StatusScreen';
import NewPostScreen from './NewPostScreen';
import FeedScreen from './FeedScreen';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './LoginScreen';
import { fontSizes, colors, whitespace } from '../config/globalStyles';
import { Platform } from 'react-native';

export const LoginNavigator = createStackNavigator(
    {
        LoginScreen: LoginScreen
    },
    {
        initialRouteName: 'LoginScreen',
        headerMode: 'none'
    }
);

export const MainNavigator = createMaterialTopTabNavigator(
    {
        StatusScreen: StatusScreen,
        NewPostScreen: NewPostScreen,
        FeedScreen: FeedScreen,
        SettingsScreen: SettingsScreen
    },
    {
        initialRouteName: 'StatusScreen',
        tabBarOptions: {
            labelStyle: {
                fontSize: fontSizes.xs
            },
            style: {
                paddingTop: Platform.OS === 'ios' ? whitespace.s : 0,
                backgroundColor: colors.appOrange
            }
        }
    }
);