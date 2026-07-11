import React, { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'react-native-linear-gradient';

interface ShimmerProps {
  /**
   * Width of the shimmer container
   */
  width?: DimensionValue;

  /**
   * Height of the shimmer container
   */
  height?: DimensionValue;

  /**
   * Base color of the skeleton
   * @default '#E1E9EE'
   */
  baseColor?: string;

  /**
   * Highlight color that shimmers across
   * @default '#F2F8FC'
   */
  highlightColor?: string;

  /**
   * Animation duration in milliseconds
   * @default 1500
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
   * Child content (rendered on top of shimmer)
   */
  children?: React.ReactNode;
}

/**
 * Shimmer animation component using Reanimated 3
 *
 * Creates a smooth left-to-right shimmer effect using:
 * - Shared values for performance
 * - Worklets for 60 FPS on UI thread
 * - Linear gradient for shimmer effect
 *
 * @example
 * ```tsx
 * <ShimmerAnimation
 *   width={200}
 *   height={20}
 *   borderRadius={4}
 * />
 * ```
 */
export function ShimmerAnimation({
  width,
  height,
  baseColor = '#E1E9EE',
  highlightColor = '#F2F8FC',
  duration = 1500,
  borderRadius = 4,
  style,
  children,
}: ShimmerProps) {
  // Shared value for animation progress (0 to 1)
  const progress = useSharedValue(0);

  useEffect(() => {
    // Start infinite shimmer animation
    progress.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [duration, progress]);

  // Animated style for shimmer overlay
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';

    // Calculate shimmer position
    // Interpolate from -100% to 100% to create left-to-right sweep
    const translateX = interpolate(progress.value, [0, 1], [-1, 1]);

    return {
      transform: [{ translateX: translateX * (typeof width === 'number' ? width : 200) }],
    };
  }, [width]);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      {/* Shimmer gradient overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            overflow: 'hidden',
            borderRadius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.shimmer,
            {
              width: typeof width === 'number' ? width : '100%',
              height: '100%',
            },
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={[baseColor, highlightColor, highlightColor, baseColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>

      {/* Child content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
  },
});
