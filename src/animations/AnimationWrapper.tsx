import React from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { ShimmerAnimation } from './ShimmerAnimation';
import { PulseAnimation } from './PulseAnimation';

export type AnimationType = 'shimmer' | 'pulse' | 'none';

interface AnimationWrapperProps {
  /**
   * Type of animation to use
   * @default 'shimmer'
   */
  animation?: AnimationType;

  /**
   * Width of the animated element
   */
  width?: DimensionValue;

  /**
   * Height of the animated element
   */
  height?: DimensionValue;

  /**
   * Base color of the skeleton
   * @default '#E1E9EE'
   */
  baseColor?: string;

  /**
   * Highlight color for animation
   * @default '#F2F8FC'
   */
  highlightColor?: string;

  /**
   * Animation duration in milliseconds
   * @default 1500 for shimmer, 1000 for pulse
   */
  duration?: number;

  /**
   * Border radius
   * @default 4
   */
  borderRadius?: number;

  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Child content
   */
  children?: React.ReactNode;
}

/**
 * Animation wrapper that selects the appropriate animation type
 *
 * Provides a unified interface for all skeleton animations:
 * - shimmer: Left-to-right shimmer effect
 * - pulse: Breathing/pulsing opacity
 * - none: Static skeleton (no animation)
 *
 * @example
 * ```tsx
 * <AnimationWrapper
 *   animation="shimmer"
 *   width={200}
 *   height={20}
 * />
 * ```
 */
export function AnimationWrapper({
  animation = 'shimmer',
  width,
  height,
  baseColor = '#E1E9EE',
  highlightColor = '#F2F8FC',
  duration,
  borderRadius = 4,
  style,
  children,
}: AnimationWrapperProps) {
  // No animation - static skeleton
  if (animation === 'none') {
    return (
      <View
        style={[
          {
            width,
            height,
            borderRadius,
            backgroundColor: baseColor,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Shimmer animation
  if (animation === 'shimmer') {
    return (
      <ShimmerAnimation
        width={width}
        height={height}
        baseColor={baseColor}
        highlightColor={highlightColor}
        duration={duration ?? 1500}
        borderRadius={borderRadius}
        style={style}
      >
        {children}
      </ShimmerAnimation>
    );
  }

  // Pulse animation
  return (
    <PulseAnimation
      width={width}
      height={height}
      baseColor={baseColor}
      highlightColor={highlightColor}
      duration={duration ?? 1000}
      borderRadius={borderRadius}
      style={style}
    >
      {children}
    </PulseAnimation>
  );
}
