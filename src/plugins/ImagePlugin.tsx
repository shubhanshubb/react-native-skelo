import React from 'react';
import { Image } from 'react-native';
import type { SkeletonPlugin } from '../types';
import type { ImageProps } from 'react-native';

/**
 * Built-in plugin for React Native Image component
 *
 * Renders Image as:
 * - SkeletonCircle if circular (avatar-like)
 * - SkeletonImage otherwise
 */
export const ImagePlugin: SkeletonPlugin<ImageProps> = {
  name: 'Image',
  component: Image,
  version: '1.0.0',

  strategy: (props, context) => {
    const { primitives, config } = context;
    const style = props.style || {};
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    const width = flatStyle.width ?? 100;
    const height = flatStyle.height ?? 100;
    const borderRadius = flatStyle.borderRadius ?? 0;

    // Check if it's a circular image (avatar)
    const isCircle =
      typeof width === 'number' &&
      typeof height === 'number' &&
      width === height &&
      borderRadius === width / 2;

    if (isCircle) {
      return (
        <primitives.Circle
          size={width as number}
          animation={config.animation}
          baseColor={config.baseColor}
          highlightColor={config.highlightColor}
          duration={config.duration}
          style={flatStyle}
        />
      );
    }

    return (
      <primitives.Image
        width={width}
        height={height}
        borderRadius={borderRadius as number}
        animation={config.animation}
        baseColor={config.baseColor}
        highlightColor={config.highlightColor}
        duration={config.duration}
        style={flatStyle}
      />
    );
  },

  metadata: {
    description: 'Automatic skeleton generation for Image components',
    author: 'Skelo',
  },
};
