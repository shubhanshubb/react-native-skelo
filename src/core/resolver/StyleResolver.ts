import type { ReactElement } from 'react';
import type { DimensionValue } from 'react-native';
import type { ResolvedStyle } from '../../types';
import { resolveStyle, extractDimensions } from '../../utils';

/**
 * StyleResolver class for extracting and resolving component styles
 */
export class StyleResolver {
  /**
   * Resolve styles from a React element
   *
   * @param element - React element
   * @returns Resolved style object
   */
  static resolve(element: ReactElement): ResolvedStyle {
    const props = element.props || {};
    const style = props.style;

    return resolveStyle(style);
  }

  /**
   * Get dimensions from element props and style
   *
   * @param element - React element
   * @returns Object with width and height
   */
  static getDimensions(element: ReactElement): {
    width?: DimensionValue;
    height?: DimensionValue;
  } {
    const style = this.resolve(element);
    return extractDimensions(style);
  }

  /**
   * Check if element has explicit dimensions
   *
   * @param element - React element
   * @returns True if both width and height are defined
   */
  static hasExplicitDimensions(element: ReactElement): boolean {
    const { width, height } = this.getDimensions(element);
    return width !== undefined && height !== undefined;
  }

  /**
   * Get border radius from style
   *
   * @param element - React element
   * @returns Border radius value or undefined
   */
  static getBorderRadius(element: ReactElement): number | undefined {
    const style = this.resolve(element);
    return style.borderRadius;
  }

  /**
   * Get font size from style
   *
   * @param element - React element
   * @returns Font size value or undefined
   */
  static getFontSize(element: ReactElement): number | undefined {
    const style = this.resolve(element);
    return style.fontSize;
  }

  /**
   * Get line height from style
   *
   * @param element - React element
   * @returns Line height value or undefined
   */
  static getLineHeight(element: ReactElement): number | undefined {
    const style = this.resolve(element);
    return style.lineHeight;
  }
}
