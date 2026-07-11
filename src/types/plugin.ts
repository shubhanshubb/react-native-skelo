import type { ComponentType, ReactElement, ReactNode } from 'react';
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
export type SkeletonStrategy<P = any> = (
  props: P,
  context: SkeletonContext
) => ReactElement | null;

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
   * Extract dimensions from props/style
   */
  extractDimensions: (element: ReactElement) => { width?: number; height?: number };

  /**
   * Generate random width for natural look
   */
  randomWidth: (min: number, max: number) => string;
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
 * Props for skeleton primitives
 */
export interface BoxProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
  children?: ReactNode;
}

export interface TextProps {
  lines?: number;
  fontSize?: number;
  lineHeight?: number;
  width?: number | string;
  lastLineWidth?: number | string;
  style?: any;
}

export interface ImageProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export interface CircleProps {
  size?: number;
  style?: any;
}
