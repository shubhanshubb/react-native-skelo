import { StyleSheet } from 'react-native';
import { resolveStyle, extractDimensions, hasExplicitSize } from '../../utils/styleUtils';

describe('styleUtils', () => {
  describe('resolveStyle', () => {
    it('should resolve single style object', () => {
      const style = { width: 100, height: 50 };
      const resolved = resolveStyle(style);

      expect(resolved.width).toBe(100);
      expect(resolved.height).toBe(50);
    });

    it('should resolve StyleSheet style', () => {
      const styles = StyleSheet.create({
        box: {
          width: 100,
          height: 50,
        },
      });

      const resolved = resolveStyle(styles.box);
      expect(resolved.width).toBe(100);
      expect(resolved.height).toBe(50);
    });

    it('should return empty object for undefined style', () => {
      const resolved = resolveStyle(undefined);
      expect(resolved).toEqual({});
    });

    it('should handle null style', () => {
      const resolved = resolveStyle(null);
      expect(resolved).toEqual({});
    });
  });

  describe('extractDimensions', () => {
    it('should extract width and height', () => {
      const style = { width: 100, height: 50, backgroundColor: 'red' };
      const dimensions = extractDimensions(style);

      expect(dimensions.width).toBe(100);
      expect(dimensions.height).toBe(50);
      expect(dimensions).not.toHaveProperty('backgroundColor');
    });

    it('should handle missing dimensions', () => {
      const style = { backgroundColor: 'red' };
      const dimensions = extractDimensions(style);

      expect(dimensions.width).toBeUndefined();
      expect(dimensions.height).toBeUndefined();
    });

    it('should handle percentage dimensions', () => {
      const style = { width: '100%', height: '50%' } as const;
      const dimensions = extractDimensions(style);

      expect(dimensions.width).toBe('100%');
      expect(dimensions.height).toBe('50%');
    });
  });

  describe('hasExplicitSize', () => {
    it('should return true when both width and height exist', () => {
      const style = { width: 100, height: 50 };
      expect(hasExplicitSize(style)).toBe(true);
    });

    it('should return false when width is missing', () => {
      const style = { height: 50 };
      expect(hasExplicitSize(style)).toBe(false);
    });

    it('should return false when height is missing', () => {
      const style = { width: 100 };
      expect(hasExplicitSize(style)).toBe(false);
    });

    it('should return false when both are missing', () => {
      const style = { backgroundColor: 'red' };
      expect(hasExplicitSize(style)).toBe(false);
    });
  });
});
