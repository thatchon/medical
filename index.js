// index.js
import { AppRegistry } from 'react-native';
import App from './App'; // เรียกใช้คอมโพเนนต์หลักของคุณ
import { medical as appName } from './app.json';

// Register the app
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });