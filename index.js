import 'react-native-get-random-values' // required for uuid to work on the ios simulator
import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './build';
const sdoor = () => <App />;
AppRegistry.registerComponent('sdoor', () => sdoor);