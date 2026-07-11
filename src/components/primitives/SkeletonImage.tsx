import React from 'react';
import { StyleSheet } from 'react-native';
import type { ImageProps } from '../../types';
import { AnimationWrapper } from '../../animations';
import type { AnimationType } from '../../animations';

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
  animation = 'shimmer',
  baseColor,
  highlightColor,
  duration,
}: ImageProps & {
  animation?: AnimationType;
  baseColor?: string;
  highlightColor?: string;
  duration?: number;
}) {
  return (
    <AnimationWrapper
      animation={animation}
      width={width}
      height={height}
      borderRadius={borderRadius}
      baseColor={baseColor}
      highlightColor={highlightColor}
      duration={duration}
      style={[styles.image, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
});

SkeletonImage.displayName = 'Skeleton.Image';
