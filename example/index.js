import { AppRegistry } from 'react-native';
// Enables `<Skeleton deep>` (requires react-reconciler).
import 'react-native-skelo/deep';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
