import { StyleSheet } from 'react-native';
import type { DimensionValue } from 'react-native';
import type { ResolvedStyle } from '../types';

/**
 * Flatten and resolve styles from React Native style prop
 *
 * @param style - Style prop (can be object, array, or StyleSheet reference)
 * @returns Flattened style object
 */
export function resolveStyle(style: any): ResolvedStyle {
  if (!style) {
    return {};
  }

  try {
    const flattened = StyleSheet.flatten(style);
    return flattened as ResolvedStyle;
  } catch (error) {
    // Handle invalid styles gracefully
    if (__DEV__) {
      console.warn('[Skelo] Failed to resolve style:', error);
    }
    return {};
  }
}

/**
 * Extract dimensions from resolved style
 *
 * @param style - Resolved style object
 * @returns Object with width and height (if present)
 */
export function extractDimensions(style: ResolvedStyle): {
  width?: DimensionValue;
  height?: DimensionValue;
} {
  return {
    width: style.width,
    height: style.height,
  };
}

/**
 * Check if a resolved style declares both an explicit width and height
 *
 * @param style - Resolved style object
 * @returns True if both width and height are defined
 */
export function hasExplicitSize(style: ResolvedStyle): boolean {
  return style.width !== undefined && style.height !== undefined;
}

/**
 * Check if a value is a percentage string
 *
 * @param value - Value to check
 * @returns True if value is a percentage string
 */
export function isPercentage(value: any): boolean {
  return typeof value === 'string' && value.includes('%');
}

/**
 * Convert percentage to number (strips %)
 *
 * @param value - Percentage string (e.g., "50%")
 * @returns Number without % sign
 */
export function percentageToNumber(value: string): number {
  return parseFloat(value.replace('%', ''));
}
