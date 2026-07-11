import type { ComponentType } from 'react';
import type { SkeletonPlugin } from '../../types';

/**
 * Registry for skeleton plugins
 *
 * Manages mapping between React components and their skeleton generation strategies
 */
export class SkeletonRegistry {
  private plugins: Map<ComponentType, SkeletonPlugin> = new Map();
  private nameIndex: Map<string, SkeletonPlugin> = new Map();

  /**
   * Register a plugin for a component
   *
   * @param plugin - Plugin configuration
   * @throws Error if plugin is invalid
   */
  register<P>(plugin: SkeletonPlugin<P>): void {
    // Validation
    if (!plugin.name) {
      throw new Error('[Skelo] Plugin must have a name');
    }

    if (!plugin.component) {
      throw new Error('[Skelo] Plugin must specify a component');
    }

    if (!plugin.strategy) {
      throw new Error('[Skelo] Plugin must have a strategy function');
    }

    // Check for conflicts
    if (this.plugins.has(plugin.component)) {
      if (__DEV__) {
        console.warn(
          `[Skelo] Plugin "${plugin.name}" is overriding existing plugin for component`
        );
      }
    }

    // Register
    this.plugins.set(plugin.component, plugin);
    this.nameIndex.set(plugin.name, plugin);

    if (__DEV__) {
      console.log(`[Skelo] Registered plugin: ${plugin.name}`);
    }
  }

  /**
   * Unregister a plugin
   *
   * @param component - Component to unregister
   */
  unregister(component: ComponentType): void {
    const plugin = this.plugins.get(component);
    if (plugin) {
      this.plugins.delete(component);
      this.nameIndex.delete(plugin.name);
    }
  }

  /**
   * Get plugin for a component
   *
   * @param component - Component type
   * @returns Plugin or undefined
   */
  getPlugin(component: ComponentType): SkeletonPlugin | undefined {
    return this.plugins.get(component);
  }

  /**
   * Get plugin by name
   *
   * @param name - Plugin name
   * @returns Plugin or undefined
   */
  getPluginByName(name: string): SkeletonPlugin | undefined {
    return this.nameIndex.get(name);
  }

  /**
   * Check if component has a plugin
   *
   * @param component - Component type
   * @returns True if plugin exists
   */
  hasPlugin(component: ComponentType): boolean {
    return this.plugins.has(component);
  }

  /**
   * Get all registered plugins
   *
   * @returns Array of all plugins
   */
  getAllPlugins(): SkeletonPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Clear all plugins
   */
  clear(): void {
    this.plugins.clear();
    this.nameIndex.clear();
  }
}

// Singleton instance
export const registry = new SkeletonRegistry();
