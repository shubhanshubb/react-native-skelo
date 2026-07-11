import React from 'react';
import { StyleSheet } from 'react-native';
import type { BoxProps } from '../../types';
import { AnimationWrapper } from '../../animations';
import type { AnimationType } from '../../animations';

/**
 * Basic box skeleton primitive
 *
 * @example
 * ```tsx
 * <SkeletonBox width={100} height={50} borderRadius={8} />
 * ```
 */
export function SkeletonBox({
  width,
  height,
  borderRadius = 4,
  style,
  children,
  animation = 'shimmer',
  baseColor,
  highlightColor,
  duration,
}: BoxProps & {
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
      style={[styles.box, style]}
    >
      {children}
    </AnimationWrapper>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
  },
});

SkeletonBox.displayName = 'Skeleton.Box';
