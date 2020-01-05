import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './config/store';
import { YellowBox } from 'react-native';
import App from './screens/App';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from './screens/LoadingScreen';

YellowBox.ignoreWarnings([
    'Warning: isMounted', 'Module RCTImageLoader requires', 'Class RCTCxxModule was not exported', 'Setting a timer'
]);

const { store, persistor } = configureStore();

class AppContainer extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        );
    }
}

export default AppContainer;