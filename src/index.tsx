import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './config/store';
import App from './screens/App';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from './screens/LoadingScreen';

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