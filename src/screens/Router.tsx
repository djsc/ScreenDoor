import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import StatusScreen from './StatusScreen';
import NewPostScreen from './NewPostScreen';
import FeedScreen from './FeedScreen';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './LoginScreen';
import { fontSizes, colors } from '../config/globalStyles';

export const LoginNavigator = createAppContainer(createStackNavigator(
    {
        LoginScreen: {
            screen: LoginScreen
        }
    },
    {
        initialRouteName: 'LoginScreen',
        headerMode: 'none'
    }
));

export const MainNavigator = createAppContainer(createMaterialTopTabNavigator(
    {
        StatusScreen: {
            screen: StatusScreen
        },
        NewPostScreen: {
            screen: NewPostScreen
        },
        FeedScreen: {
            screen: FeedScreen
        },
        SettingsScreen: {
            screen: SettingsScreen
        }
    },
    {
        initialRouteName: 'StatusScreen',
        tabBarOptions: {
            labelStyle: {
                fontSize: fontSizes.xs
            },
            style: {
                backgroundColor: colors.appOrange
            }
        }
    }
));