import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import type { SkeletonConfig } from '../../types';
import {
  SkeletonBox,
  SkeletonText,
  SkeletonCircle,
} from '../../components/primitives';

/**
 * A single named style, or an ordered list of styles, or a whole StyleSheet
 * object as returned by `StyleSheet.create`.
 */
export type StyleInput = Record<string, unknown> | unknown[];

interface StyleSkeletonProps {
  /**
   * The styles to derive a skeleton from. Accepts a `StyleSheet.create` object
   * (values used in definition order) or an array of styles (used in order).
   */
  styles: StyleInput;

  /**
   * Skeleton configuration (animation, colors, radius).
   */
  config: SkeletonConfig;

  /**
   * Optional list of style keys to skip (e.g. layout containers you don't want
   * a skeleton for). Only applies when `styles` is a keyed object.
   */
  exclude?: string[];
}

interface FlatStyle {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  fontSize?: number;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  aspectRatio?: number;
}

/**
 * Turn one flattened style into the most appropriate skeleton primitive.
 *
 * Heuristics:
 * - a `fontSize` with no explicit height  → text bar
 * - square with radius ≥ half its size    → circle (avatar)
 * - anything with width and/or height     → box
 * - a pure layout container (no visual dimensions) → skipped (returns null)
 */
function styleToSkeleton(
  rawStyle: unknown,
  key: string | number,
  config: SkeletonConfig
): React.ReactElement | null {
  const flat = (StyleSheet.flatten(rawStyle as never) || {}) as FlatStyle;
  const { width, height, borderRadius, fontSize } = flat;

  const anim = {
    animation: config.animation,
    baseColor: config.baseColor,
    highlightColor: config.highlightColor,
    duration: config.duration,
  } as const;

  const spacing = {
    marginTop: flat.marginTop ?? 0,
    marginBottom: flat.marginBottom ?? 12,
  };

  // Text-like: has a font size but isn't a fixed-height box.
  if (fontSize != null && height == null) {
    return (
      <SkeletonText
        key={key}
        lines={1}
        fontSize={fontSize}
        lineHeight={flat.lineHeight}
        width={(width as DimensionValue) ?? '60%'}
        style={spacing}
        {...anim}
      />
    );
  }

  // Circle / avatar: square with a radius that rounds it fully.
  if (
    typeof width === 'number' &&
    width === height &&
    typeof borderRadius === 'number' &&
    borderRadius >= width / 2
  ) {
    return <SkeletonCircle key={key} size={width} style={spacing} {...anim} />;
  }

  // Box: anything with an explicit dimension.
  if (width != null || height != null) {
    return (
      <SkeletonBox
        key={key}
        width={(width as DimensionValue) ?? '100%'}
        height={(height as DimensionValue) ?? 20}
        borderRadius={borderRadius ?? config.borderRadius ?? 4}
        style={spacing}
        {...anim}
      />
    );
  }

  // Pure layout container (no visual footprint) — nothing to draw.
  return null;
}

/**
 * Generates a skeleton directly from a set of styles.
 *
 * Because a StyleSheet is flat (no element hierarchy), the output is a vertical
 * stack of skeleton shapes — one per style that has visual dimensions — sized
 * from each style's own props. Layout-only styles are skipped.
 */
export function StyleSkeleton({ styles, config, exclude }: StyleSkeletonProps) {
  const entries: Array<[string | number, unknown]> = Array.isArray(styles)
    ? styles.map((s, i) => [i, s])
    : Object.entries(styles || {}).filter(
        ([name]) => !exclude || !exclude.includes(name)
      );

  const nodes = entries
    .map(([key, style]) => styleToSkeleton(style, key, config))
    .filter((n): n is React.ReactElement => n !== null);

  return (
    <View accessibilityRole="progressbar" accessible>
      {nodes}
    </View>
  );
}

StyleSkeleton.displayName = 'Skeleton.FromStyles';
