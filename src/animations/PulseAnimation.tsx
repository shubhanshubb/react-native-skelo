import React, { useEffect, useRef } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { Animated, Easing, StyleSheet } from 'react-native';

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

// Breathing opacity loop using React Native's built-in Animated (native driver).
export function PulseAnimation({
  width,
  height,
  baseColor = '#E1E9EE',
  duration = 1000,
  borderRadius = 4,
  style,
  children,
}: PulseProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [duration, opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height, borderRadius, backgroundColor: baseColor, opacity },
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
