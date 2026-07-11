import React from 'react';
import { StyleSheet } from 'react-native';
import type { CircleProps } from '../../types';
import { AnimationWrapper } from '../../animations';
import type { AnimationType } from '../../animations';

/**
 * Circle skeleton primitive (useful for avatars)
 *
 * @example
 * ```tsx
 * <SkeletonCircle size={40} />
 * ```
 */
export function SkeletonCircle({
  size = 40,
  style,
  animation = 'shimmer',
  baseColor,
  highlightColor,
  duration,
}: CircleProps & {
  animation?: AnimationType;
  baseColor?: string;
  highlightColor?: string;
  duration?: number;
}) {
  return (
    <AnimationWrapper
      animation={animation}
      width={size}
      height={size}
      borderRadius={size / 2}
      baseColor={baseColor}
      highlightColor={highlightColor}
      duration={duration}
      style={[styles.circle, style]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
  },
});

SkeletonCircle.displayName = 'Skeleton.Circle';
