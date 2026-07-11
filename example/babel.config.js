module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Reanimated 4 ships its Babel plugin from react-native-worklets.
    // This must remain the last plugin in the list.
    'react-native-worklets/plugin',
  ],
};
