import React, { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PulseProps {
  /**
   * Width of the pulse container
   */
  width?: DimensionValue;

  /**
   * Height of the pulse container
   */
  height?: DimensionValue;

  /**
   * Base color of the skeleton
   * @default '#E1E9EE'
   */
  baseColor?: string;

  /**
   * Highlight color for pulse
   * @default '#F2F8FC'
   */
  highlightColor?: string;

  /**
   * Animation duration in milliseconds
   * @default 1000
   */
  duration?: number;

  /**
   * Border radius
   */
  borderRadius?: number;

  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Child content (rendered inside pulse)
   */
  children?: React.ReactNode;
}

/**
 * Pulse animation component using Reanimated 3
 *
 * Creates a subtle breathing/pulsing effect using:
 * - Shared values for performance
 * - Worklets for 60 FPS on UI thread
 * - Opacity animation for pulse effect
 *
 * @example
 * ```tsx
 * <PulseAnimation
 *   width={200}
 *   height={20}
 *   borderRadius={4}
 * />
 * ```
 */
export function PulseAnimation({
  width,
  height,
  baseColor = '#E1E9EE',
  duration = 1000,
  borderRadius = 4,
  style,
  children,
}: PulseProps) {
  // Shared value for opacity (0 to 1)
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Start infinite pulse animation
    // Sequence: fade out -> fade in
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [duration, opacity]);

  // Animated style for pulse effect
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';

    return {
      opacity: opacity.value,
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
