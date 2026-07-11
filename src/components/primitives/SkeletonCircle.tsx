import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { CircleProps } from '../../types';

/**
 * Circle skeleton primitive (useful for avatars)
 *
 * @example
 * ```tsx
 * <SkeletonCircle size={40} />
 * ```
 */
export function SkeletonCircle({ size = 40, style }: CircleProps) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
  },
});

SkeletonCircle.displayName = 'Skeleton.Circle';
