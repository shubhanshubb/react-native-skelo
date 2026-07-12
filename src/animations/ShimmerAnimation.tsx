import React, { useEffect, useRef, useState } from 'react';
import type { DimensionValue, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { Animated, Easing, StyleSheet, View } from 'react-native';

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

// Zero-dependency shimmer: a highlight band (dim/bright/dim segments to fake a
// soft gradient) sweeps across the base, driven by React Native's built-in
// Animated native driver. Plain Views only — guaranteed to render and animate.
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
  const progress = useRef(new Animated.Value(0)).current;
  const [measuredWidth, setMeasuredWidth] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [duration, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    const w = event.nativeEvent.layout.width;
    setMeasuredWidth(prev => (prev === w ? prev : w));
  };

  const containerWidth = typeof width === 'number' ? width : measuredWidth || 200;
  const bandWidth = Math.max(containerWidth * 0.6, 80);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-bandWidth, containerWidth],
  });

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { width, height, borderRadius, backgroundColor: baseColor }, style]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.band, { width: bandWidth, transform: [{ translateX }] }]}
      >
        <View style={[styles.segment, { backgroundColor: highlightColor, opacity: 0.25 }]} />
        <View style={[styles.segment, { backgroundColor: highlightColor, opacity: 0.9 }]} />
        <View style={[styles.segment, { backgroundColor: highlightColor, opacity: 0.25 }]} />
      </Animated.View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
  },
});
