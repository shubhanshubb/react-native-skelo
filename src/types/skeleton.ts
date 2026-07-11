import type { ReactElement, ReactNode } from 'react';
import type { DimensionValue, FlexAlignType } from 'react-native';

/**
 * Props for the main Skeleton component
 *
 * @example
 * ```tsx
 * <Skeleton loading={true} animation="shimmer">
 *   <YourComponent />
 * </Skeleton>
 * ```
 */
export interface SkeletonProps {
  /**
   * Whether to show skeleton (true) or actual content (false)
   */
  loading: boolean;

  /**
   * Animation type
   * - 'shimmer': Moving gradient animation (default)
   * - 'pulse': Fade in/out animation
   * - 'none': Static skeleton
   *
   * @default 'shimmer'
   */
  animation?: 'shimmer' | 'pulse' | 'none';

  /**
   * Animation duration in milliseconds
   * @default 1200
   */
  duration?: number;

  /**
   * Base skeleton color
   * @default Auto-detected based on color scheme (light/dark)
   */
  baseColor?: string;

  /**
   * Shimmer highlight color
   * @default Auto-detected based on color scheme (light/dark)
   */
  highlightColor?: string;

  /**
   * Default border radius for skeleton elements
   * @default 4
   */
  borderRadius?: number;

  /**
   * Components to render
   */
  children: ReactNode;

  /**
   * Enable accessibility features
   * @default true
   */
  accessible?: boolean;

  /**
   * Screen reader label
   * @default "Loading content"
   */
  accessibilityLabel?: string;

  /**
   * Debug mode (development only)
   * Shows component boundaries and names
   * @default false
   */
  debug?: boolean;
}

/**
 * Configuration options for SkeletonProvider
 */
export interface SkeletonConfig {
  /**
   * Default animation type
   * @default 'shimmer'
   */
  animation?: 'shimmer' | 'pulse' | 'none';

  /**
   * Default animation duration in milliseconds
   * @default 1200
   */
  duration?: number;

  /**
   * Default base color
   */
  baseColor?: string;

  /**
   * Default highlight color
   */
  highlightColor?: string;

  /**
   * Default border radius
   * @default 4
   */
  borderRadius?: number;

  /**
   * Enable debug mode globally
   * @default false
   */
  debug?: boolean;
}

/**
 * Resolved style properties extracted from React Native styles
 */
export interface ResolvedStyle {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  backgroundColor?: string;
  fontSize?: number;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  flexDirection?: 'row' | 'column';
  alignItems?: FlexAlignType;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

/**
 * Parsed component node in the tree
 */
export interface ComponentNode {
  type: string;
  props: any;
  style: ResolvedStyle;
  children: ComponentNode[];
  /**
   * The original React element this node was parsed from.
   *
   * Retained so the renderer can fall back to rendering-and-measuring the
   * real element when it is an opaque (non-host) component the parser can't
   * introspect. Excluded from debug serialization.
   */
  element?: ReactElement;
}
