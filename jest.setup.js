/* eslint-disable no-undef */

// Mock Reanimated with its official jest mock so worklets/animations
// don't require the native module during tests.
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Silence the native animation helper warning under Jest.
global.__reanimatedWorkletInit = () => {};
