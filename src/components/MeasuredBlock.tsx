import React, { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { SkeletonConfig } from '../types';
import { AnimationWrapper } from '../animations';

interface MeasuredBlockProps {
  /**
   * The real element to render (hidden) and measure.
   */
  children: ReactNode;

  /**
   * Skeleton configuration (animation, colors, etc.)
   */
  config: SkeletonConfig;
}

interface Size {
  width: number;
  height: number;
}

/**
 * Renders an opaque (non-host) component hidden so it lays out at its real
 * size, measures that size via `onLayout`, then overlays a shimmer block of
 * exactly those dimensions.
 *
 * This is Skelo's runtime-measurement fallback: when the parser can't
 * introspect a component (e.g. a user-defined function component), we can't
 * know its internal View/Text/Image structure without native view-tree access,
 * but we *can* render it off-screen and reproduce its footprint accurately.
 *
 * The result is a single, correctly-sized skeleton block rather than a
 * misleading fixed-size placeholder.
 */
export function MeasuredBlock({ children, config }: MeasuredBlockProps) {
  const [size, setSize] = useState<Size | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize(prev =>
      prev && prev.width === width && prev.height === height
        ? prev
        : { width, height }
    );
  };

  return (
    <View>
      {/* Real content, rendered invisibly purely to occupy space + measure. */}
      <View
        style={styles.hidden}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
        onLayout={handleLayout}
      >
        {children}
      </View>

      {/* Size-matched shimmer overlay, shown once measured. */}
      {size && size.width > 0 && size.height > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <AnimationWrapper
            animation={config.animation}
            width={size.width}
            height={size.height}
            baseColor={config.baseColor}
            highlightColor={config.highlightColor}
            duration={config.duration}
            borderRadius={config.borderRadius}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});

MeasuredBlock.displayName = 'Skeleton.MeasuredBlock';
