import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import {
  isValidElement,
  isFragment,
  getComponentName,
  flattenChildren,
  randomWidth,
} from '../../utils/componentUtils';

describe('componentUtils', () => {
  describe('isValidElement', () => {
    it('should return true for React elements', () => {
      const element = <View />;
      expect(isValidElement(element)).toBe(true);
    });

    it('should return false for non-elements', () => {
      expect(isValidElement('string')).toBe(false);
      expect(isValidElement(123)).toBe(false);
      expect(isValidElement(null)).toBe(false);
      expect(isValidElement(undefined)).toBe(false);
    });
  });

  describe('isFragment', () => {
    it('should return true for fragments', () => {
      const fragment = <></>;
      expect(isFragment(fragment)).toBe(true);
    });

    it('should return false for non-fragments', () => {
      const element = <View />;
      expect(isFragment(element)).toBe(false);
    });
  });

  describe('getComponentName', () => {
    it('should get name from View component', () => {
      const element = <View />;
      expect(getComponentName(element)).toBe('View');
    });

    it('should get name from Text component', () => {
      const element = <Text />;
      expect(getComponentName(element)).toBe('Text');
    });

    it('should identify host components by reference (forwardRef/memo safe)', () => {
      // Regression: modern RN host components are forwardRef/memo objects, not
      // functions/strings. They must still resolve to their canonical names so
      // the parser treats them as host elements rather than opaque components.
      expect(getComponentName(<Image source={{ uri: 'x' }} />)).toBe('Image');
      expect(getComponentName(<ScrollView />)).toBe('ScrollView');
    });

    it('should return Unknown for anonymous components', () => {
      const element = React.createElement(() => <View />);
      const name = getComponentName(element);
      expect(name).toMatch(/^(Unknown|Anonymous)/);
    });
  });

  describe('flattenChildren', () => {
    it('should flatten single child', () => {
      const children = <Text>Hello</Text>;
      const flattened = flattenChildren(children);

      expect(flattened).toHaveLength(1);
    });

    it('should flatten multiple children', () => {
      const children = (
        <>
          <Text>First</Text>
          <Text>Second</Text>
        </>
      );
      const flattened = flattenChildren(children);

      expect(flattened).toHaveLength(2);
    });

    it('should flatten nested fragments', () => {
      const children = (
        <>
          <Text>First</Text>
          <>
            <Text>Second</Text>
            <Text>Third</Text>
          </>
        </>
      );
      const flattened = flattenChildren(children);

      expect(flattened).toHaveLength(3);
    });

    it('should handle null and undefined children', () => {
      const flattened1 = flattenChildren(null);
      const flattened2 = flattenChildren(undefined);

      expect(flattened1).toEqual([]);
      expect(flattened2).toEqual([]);
    });
  });

  describe('randomWidth', () => {
    it('should generate width within default range', () => {
      const width = randomWidth();
      const value = parseInt(width);

      expect(value).toBeGreaterThanOrEqual(60);
      expect(value).toBeLessThanOrEqual(90);
      expect(width).toMatch(/%$/);
    });

    it('should generate width within custom range', () => {
      const width = randomWidth(50, 80);
      const value = parseInt(width);

      expect(value).toBeGreaterThanOrEqual(50);
      expect(value).toBeLessThanOrEqual(80);
    });

    it('should return percentage format', () => {
      const width = randomWidth();
      expect(width).toMatch(/^\d+%$/);
    });
  });
});
