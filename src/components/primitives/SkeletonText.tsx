import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { TextProps } from '../../types';
import { AnimationWrapper } from '../../animations';
import type { AnimationType } from '../../animations';

/**
 * Text skeleton primitive with multiple lines
 *
 * @example
 * ```tsx
 * <SkeletonText lines={3} fontSize={16} lastLineWidth="70%" />
 * ```
 */
export function SkeletonText({
  lines = 1,
  fontSize = 14,
  lineHeight,
  width = '100%',
  lastLineWidth = '60%',
  style,
  animation = 'shimmer',
  baseColor,
  highlightColor,
  duration,
}: TextProps & {
  animation?: AnimationType;
  baseColor?: string;
  highlightColor?: string;
  duration?: number;
}) {
  const calculatedLineHeight = lineHeight || fontSize * 1.4;

  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLastLine = index === lines - 1;
        const lineWidth = isLastLine && lines > 1 ? lastLineWidth : width;

        return (
          <AnimationWrapper
            key={index}
            animation={animation}
            width={lineWidth}
            height={fontSize}
            borderRadius={4}
            baseColor={baseColor}
            highlightColor={highlightColor}
            duration={duration}
            style={[
              styles.line,
              {
                marginBottom: index < lines - 1 ? calculatedLineHeight - fontSize : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    overflow: 'hidden',
  },
});

SkeletonText.displayName = 'Skeleton.Text';
