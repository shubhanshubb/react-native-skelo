import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { BoxProps } from '../../types';

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
  borderRadius,
  style,
  children,
}: BoxProps) {
  return (
    <View
      style={[
        styles.box,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
  },
});

SkeletonBox.displayName = 'Skeleton.Box';
