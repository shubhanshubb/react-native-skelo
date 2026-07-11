const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pak = require('../package.json');

const modules = [
  ...Object.keys(pak.peerDependencies),
  // Deduped so the library's offline-render engine uses the app's matching
  // React copy (react-reconciler must match the app's react version).
  'react-reconciler',
];

// Regex-escape a filesystem path for use inside a RegExp.
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],

  resolver: {
    // Only block the *peer* modules from the library root's node_modules so
    // Metro doesn't resolve a second copy of react/react-native (haste
    // collision) and instead uses the example's copies (see extraNodeModules).
    // Other transitive deps (e.g. @babel/runtime) must still resolve from root.
    blockList: new RegExp(
      `(${modules
        .map(m => `^${escapeRegExp(path.join(root, 'node_modules', m))}\\/.*$`)
        .join('|')})`
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
};

module.exports = mergeConfig(defaultConfig, config);
