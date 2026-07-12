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
  width?: DimensionValue;
  height?: DimensionValue;
  baseColor?: string;
  highlightColor?: string;
  duration?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// Breathing opacity loop on the UI thread with Reanimated.
export function PulseAnimation({
  width,
  height,
  baseColor = '#E1E9EE',
  duration = 1000,
  borderRadius = 4,
  style,
  children,
}: PulseProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
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
      -1,
      false
    );
  }, [duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: opacity.value };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height, borderRadius, backgroundColor: baseColor },
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
