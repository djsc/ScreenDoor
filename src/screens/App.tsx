import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { MainNavigator, LoginNavigator } from './Router';
import LoadingScreen from './LoadingScreen';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../reducers';
import { AnyAction } from 'redux';
import { initializeFirebase } from '../actions';
import ErrorScreen from './ErrorScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../config/globalStyles';

interface Props {
    userAuthorized?: boolean;
    appInitialized: boolean;
    lastPostObtained: boolean;
    statusInitialized: boolean;
    firebaseInitializing: boolean;
    firebaseInitialized: boolean;
    fatalError?: any;
    initializeFirebase(): void;
}

class App extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        if (this.props.firebaseInitializing === false && this.props.firebaseInitialized === false) {
            this.props.initializeFirebase();
        }
    }

    getContent = () => {
        const { userAuthorized, appInitialized, lastPostObtained, statusInitialized, fatalError } = this.props;

        if (fatalError !== undefined) {
            return <ErrorScreen />;
        } else if (userAuthorized === undefined) {
            return <LoadingScreen />;
        } else if (userAuthorized === true) {
            return appInitialized === true && lastPostObtained === true && statusInitialized === true ?
                <MainNavigator /> : <LoadingScreen />;
        } else {
            return <LoginNavigator />;
        }
    }

    render() {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    {this.getContent()}
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.appWhite
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        userAuthorized: state.auth.userAuthorized,
        appInitialized: state.app.appInitialized,
        lastPostObtained: state.posts.lastPostObtained,
        statusInitialized: state.status.statusInitialized,
        firebaseInitializing: state.app.firebaseInitializing,
        firebaseInitialized: state.app.firebaseInitialized,
        fatalError: state.app.fatalError
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, AnyAction>) => {
    return {
        initializeFirebase: () => dispatch(initializeFirebase())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
