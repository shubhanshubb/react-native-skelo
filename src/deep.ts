// Opt-in deep mode. Import once in your app entry to enable `<Skeleton deep>`:
//
//   import 'react-native-skelo/deep';
//
// This is the only module that pulls in react-reconciler, so apps that don't
// use deep mode never bundle it. Requires `react-reconciler` to be installed.
import { setDeepExpander } from './core/deepRegistry';
import { expandToComponentNodes } from './core/parser/expandOffline';

setDeepExpander(expandToComponentNodes);

export const deepEnabled = true;
