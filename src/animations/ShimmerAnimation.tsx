import React, { useEffect, useState } from 'react';
import type {
  DimensionValue,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

interface ShimmerProps {
  width?: DimensionValue;
  height?: DimensionValue;
  baseColor?: string;
  highlightColor?: string;
  duration?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// Shimmer with no gradient library: the sweeping overlay uses React Native's
// built-in `experimental_backgroundImage` CSS gradient (New Architecture),
// animated on the UI thread with Reanimated.
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
  const progress = useSharedValue(0);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, [duration, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    const w = event.nativeEvent.layout.width;
    setMeasuredWidth(prev => (prev === w ? prev : w));
  };

  const containerWidth = typeof width === 'number' ? width : measuredWidth;

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-containerWidth, containerWidth]
    );
    return { transform: [{ translateX }] };
  }, [containerWidth]);

  // `experimental_backgroundImage` isn't in the ViewStyle types yet.
  const gradientStyle = {
    ...StyleSheet.absoluteFillObject,
    experimental_backgroundImage: `linear-gradient(to right, ${baseColor}, ${highlightColor}, ${baseColor})`,
  } as unknown as ViewStyle;

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        { width, height, borderRadius, backgroundColor: baseColor },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, animatedStyle]}
      >
        <View style={gradientStyle} />
      </Animated.View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
