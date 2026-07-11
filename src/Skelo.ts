import React from 'react';
import type { ComponentType, ReactElement } from 'react';
import type { SkeletonConfig, SkeletonPlugin } from './types';
import { registry } from './core/registry';
import {
  StyleSkeleton,
  type StyleInput,
} from './core/generator/StyleSkeleton';
import { DEFAULT_CONFIG } from './constants/defaults';

/**
 * Global Skelo API for plugin management
 *
 * @example
 * ```tsx
 * import { Skelo } from 'react-native-skelo';
 * import { Avatar } from 'my-ui-library';
 *
 * Skelo.register({
 *   name: 'Avatar',
 *   component: Avatar,
 *   strategy: (props, { primitives }) => {
 *     return <primitives.Circle size={props.size || 40} />;
 *   },
 * });
 * ```
 */
export const Skelo = {
  /**
   * Register a plugin
   *
   * @param plugin - Plugin configuration
   */
  register<P = any>(plugin: SkeletonPlugin<P>): void {
    registry.register(plugin);
  },

  /**
   * Unregister a plugin
   *
   * @param component - Component type to unregister
   */
  unregister(component: ComponentType): void {
    registry.unregister(component);
  },

  /**
   * Get plugin for component
   *
   * @param component - Component type
   * @returns Plugin or undefined
   */
  getPlugin(component: ComponentType): SkeletonPlugin | undefined {
    return registry.getPlugin(component);
  },

  /**
   * Check if plugin exists
   *
   * @param component - Component type
   * @returns True if plugin is registered
   */
  hasPlugin(component: ComponentType): boolean {
    return registry.hasPlugin(component);
  },

  /**
   * Get all plugins
   *
   * @returns Array of all registered plugins
   */
  getAllPlugins(): SkeletonPlugin[] {
    return registry.getAllPlugins();
  },

  /**
   * Clear all plugins (useful for testing)
   */
  clearPlugins(): void {
    registry.clear();
  },

  /**
   * Generate a skeleton element directly from a set of styles.
   *
   * @param styles - A `StyleSheet.create` object or an array of styles
   * @param config - Optional animation/color overrides
   * @returns A skeleton React element
   *
   * @example
   * ```tsx
   * {loading ? Skelo.fromStyles(styles) : <Screen />}
   * ```
   */
  fromStyles(styles: StyleInput, config: Partial<SkeletonConfig> = {}): ReactElement {
    return React.createElement(StyleSkeleton, {
      styles,
      config: { ...DEFAULT_CONFIG, ...config },
    });
  },

  /**
   * Library version
   */
  version: '0.1.0',
};
