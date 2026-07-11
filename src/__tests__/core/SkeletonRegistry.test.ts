import React from 'react';
import { View } from 'react-native';
import { SkeletonRegistry } from '../../core/registry/SkeletonRegistry';
import type { SkeletonPlugin } from '../../types';

describe('SkeletonRegistry', () => {
  let registry: SkeletonRegistry;

  beforeEach(() => {
    registry = new SkeletonRegistry();
  });

  const mockPlugin: SkeletonPlugin = {
    name: 'TestComponent',
    component: View,
    strategy: () => React.createElement(View),
  };

  it('should register a plugin', () => {
    registry.register(mockPlugin);

    expect(registry.hasPlugin(View)).toBe(true);
    expect(registry.getPlugin(View)).toBe(mockPlugin);
  });

  it('should get plugin by name', () => {
    registry.register(mockPlugin);

    const plugin = registry.getPluginByName('TestComponent');
    expect(plugin).toBe(mockPlugin);
  });

  it('should unregister a plugin', () => {
    registry.register(mockPlugin);
    expect(registry.hasPlugin(View)).toBe(true);

    registry.unregister(View);
    expect(registry.hasPlugin(View)).toBe(false);
  });

  it('should get all plugins', () => {
    const plugin1 = { ...mockPlugin, name: 'Plugin1' };
    const plugin2 = { ...mockPlugin, name: 'Plugin2', component: React.Component };

    registry.register(plugin1);
    registry.register(plugin2);

    const allPlugins = registry.getAllPlugins();
    expect(allPlugins).toHaveLength(2);
  });

  it('should clear all plugins', () => {
    registry.register(mockPlugin);
    expect(registry.hasPlugin(View)).toBe(true);

    registry.clear();
    expect(registry.hasPlugin(View)).toBe(false);
    expect(registry.getAllPlugins()).toHaveLength(0);
  });

  it('should throw error for invalid plugin (no name)', () => {
    const invalidPlugin = { ...mockPlugin, name: '' };

    expect(() => registry.register(invalidPlugin)).toThrow('[Skelo] Plugin must have a name');
  });

  it('should throw error for invalid plugin (no component)', () => {
    const invalidPlugin = { ...mockPlugin, component: null as any };

    expect(() => registry.register(invalidPlugin)).toThrow(
      '[Skelo] Plugin must specify a component'
    );
  });

  it('should throw error for invalid plugin (no strategy)', () => {
    const invalidPlugin = { ...mockPlugin, strategy: null as any };

    expect(() => registry.register(invalidPlugin)).toThrow(
      '[Skelo] Plugin must have a strategy function'
    );
  });

  it('should override existing plugin with warning in dev', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    registry.register(mockPlugin);
    registry.register(mockPlugin); // Register again

    expect(registry.hasPlugin(View)).toBe(true);
    consoleSpy.mockRestore();
  });
});
