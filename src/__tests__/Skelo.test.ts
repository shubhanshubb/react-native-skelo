import React from 'react';
import { View } from 'react-native';
import { Skelo } from '../Skelo';
import type { SkeletonPlugin } from '../types';

describe('Skelo API', () => {
  beforeEach(() => {
    Skelo.clearPlugins();
  });

  const mockPlugin: SkeletonPlugin = {
    name: 'TestComponent',
    component: View,
    strategy: () => React.createElement(View),
  };

  it('should have correct version', () => {
    expect(Skelo.version).toBe('0.1.0');
  });

  it('should register a plugin', () => {
    Skelo.register(mockPlugin);

    expect(Skelo.hasPlugin(View)).toBe(true);
    expect(Skelo.getPlugin(View)).toBe(mockPlugin);
  });

  it('should unregister a plugin', () => {
    Skelo.register(mockPlugin);
    expect(Skelo.hasPlugin(View)).toBe(true);

    Skelo.unregister(View);
    expect(Skelo.hasPlugin(View)).toBe(false);
  });

  it('should get all plugins', () => {
    Skelo.register(mockPlugin);

    const allPlugins = Skelo.getAllPlugins();
    expect(allPlugins).toHaveLength(1);
    expect(allPlugins[0]).toBe(mockPlugin);
  });

  it('should clear all plugins', () => {
    Skelo.register(mockPlugin);
    expect(Skelo.hasPlugin(View)).toBe(true);

    Skelo.clearPlugins();
    expect(Skelo.hasPlugin(View)).toBe(false);
    expect(Skelo.getAllPlugins()).toHaveLength(0);
  });
});
