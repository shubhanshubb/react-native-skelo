import React from 'react';
import { View } from 'react-native';
import type { SkeletonPlugin } from '../types';
import type { ViewProps } from 'react-native';

/**
 * Built-in plugin for React Native View component
 *
 * Renders View as:
 * - SkeletonBox if has explicit width/height
 * - Container with parsed children otherwise
 */
export const ViewPlugin: SkeletonPlugin<ViewProps> = {
  name: 'View',
  component: View,
  version: '1.0.0',

  strategy: (props, context) => {
    const { primitives, parseChildren, config } = context;
    const style = props.style || {};
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    const width = flatStyle.width;
    const height = flatStyle.height;
    const borderRadius = flatStyle.borderRadius ?? config.borderRadius;

    // If View has explicit dimensions, render as box
    if (width && height) {
      return (
        <primitives.Box
          width={width}
          height={height}
          borderRadius={borderRadius}
          animation={config.animation}
          baseColor={config.baseColor}
          highlightColor={config.highlightColor}
          duration={config.duration}
          style={flatStyle}
        />
      );
    }

    // If View has children, render as container
    if (props.children) {
      return <View style={flatStyle}>{parseChildren(props.children)}</View>;
    }

    // Empty View - render as small placeholder
    return (
      <primitives.Box
        width={width ?? 100}
        height={height ?? 20}
        borderRadius={borderRadius}
        animation={config.animation}
        baseColor={config.baseColor}
        highlightColor={config.highlightColor}
        duration={config.duration}
        style={flatStyle}
      />
    );
  },

  metadata: {
    description: 'Automatic skeleton generation for View components',
    author: 'Skelo',
  },
};
