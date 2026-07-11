import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ImageProps } from '../../types';

/**
 * Image skeleton primitive
 *
 * @example
 * ```tsx
 * <SkeletonImage width={80} height={80} borderRadius={40} />
 * ```
 */
export function SkeletonImage({
  width = 100,
  height = 100,
  borderRadius = 0,
  style,
}: ImageProps) {
  return (
    <View
      style={[
        styles.image,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
});

SkeletonImage.displayName = 'Skeleton.Image';
