import React from 'react';
import { View, StyleSheet } from 'react';
import type { TextProps } from '../../types';

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
}: TextProps) {
  const calculatedLineHeight = lineHeight || fontSize * 1.4;

  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLastLine = index === lines - 1;
        const lineWidth = isLastLine && lines > 1 ? lastLineWidth : width;

        return (
          <View
            key={index}
            style={[
              styles.line,
              {
                width: lineWidth,
                height: fontSize,
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
    borderRadius: 4,
  },
});

SkeletonText.displayName = 'Skeleton.Text';
