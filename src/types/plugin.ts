import type { ComponentType, ReactElement, ReactNode } from 'react';
import type { DimensionValue } from 'react-native';
import type { SkeletonConfig, ResolvedStyle } from './skeleton';

/**
 * Plugin for custom component skeleton generation
 *
 * @example
 * ```tsx
 * const AvatarPlugin: SkeletonPlugin<AvatarProps> = {
 *   name: 'Avatar',
 *   component: Avatar,
 *   strategy: (props, { primitives }) => {
 *     return <primitives.Circle size={props.size || 40} />;
 *   },
 * };
 * ```
 */
export interface SkeletonPlugin<P = any> {
  /**
   * Unique identifier for the plugin
   */
  name: string;

  /**
   * Component type this plugin handles
   */
  component: ComponentType<P>;

  /**
   * Strategy function to generate skeleton
   */
  strategy: SkeletonStrategy<P>;

  /**
   * Optional: Plugin version
   */
  version?: string;

  /**
   * Optional: Plugin metadata
   */
  metadata?: PluginMetadata;
}

/**
 * Strategy function signature
 */
export type SkeletonStrategy<P = any> = (props: P, context: SkeletonContext) => ReactElement | null;

/**
 * Context provided to plugin strategies
 */
export interface SkeletonContext {
  /**
   * Configuration from parent Skeleton component
   */
  config: SkeletonConfig;

  /**
   * Theme information (light/dark)
   */
  theme: 'light' | 'dark';

  /**
   * Recursively parse children
   */
  parseChildren: (children: ReactNode) => ReactNode;

  /**
   * Access to skeleton primitives
   */
  primitives: SkeletonPrimitives;

  /**
   * Utility functions
   */
  utils: SkeletonUtils;
}

/**
 * Skeleton primitive components
 */
export interface SkeletonPrimitives {
  Box: ComponentType<BoxProps>;
  Text: ComponentType<TextProps>;
  Image: ComponentType<ImageProps>;
  Circle: ComponentType<CircleProps>;
}

/**
 * Utility functions for plugins
 */
export interface SkeletonUtils {
  /**
   * Flatten and resolve styles
   */
  resolveStyle: (style: any) => ResolvedStyle;

  /**
   * Extract dimensions from a resolved style
   */
  extractDimensions: (style: ResolvedStyle) => {
    width?: DimensionValue;
    height?: DimensionValue;
  };

  /**
   * Generate random width for natural look
   */
  randomWidth: (min?: number, max?: number) => string;
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  author?: string;
  description?: string;
  repository?: string;
  license?: string;
}

/**
 * Animation and color props shared by all skeleton primitives
 */
export interface SkeletonAnimationProps {
  animation?: 'shimmer' | 'pulse' | 'none';
  baseColor?: string;
  highlightColor?: string;
  duration?: number;
}

/**
 * Props for skeleton primitives
 */
export interface BoxProps extends SkeletonAnimationProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
  children?: ReactNode;
}

export interface TextProps extends SkeletonAnimationProps {
  lines?: number;
  fontSize?: number;
  lineHeight?: number;
  width?: DimensionValue;
  lastLineWidth?: DimensionValue;
  style?: any;
}

export interface ImageProps extends SkeletonAnimationProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
}

export interface CircleProps extends SkeletonAnimationProps {
  size?: number;
  style?: any;
}
