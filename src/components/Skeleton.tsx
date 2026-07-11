import React, { useMemo } from 'react';
import type { SkeletonProps } from '../types';
import { Parser } from '../core/parser';
import { SkeletonRenderer } from './SkeletonRenderer';
import { SkeletonIgnore } from './SkeletonIgnore';
import { StyleSkeleton } from '../core/generator/StyleSkeleton';
import { expandToComponentNodes } from '../core/parser/expandOffline';
import { DEFAULT_CONFIG } from '../constants/defaults';

/**
 * Main Skeleton component
 *
 * Automatically generates skeleton loading states for your React Native components.
 * Wraps your UI and shows skeleton placeholders while loading.
 *
 * @example
 * ```tsx
 * <Skeleton loading={isLoading}>
 *   <ProfileScreen />
 * </Skeleton>
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton
 *   loading={isLoading}
 *   animation="pulse"
 *   baseColor="#f0f0f0"
 *   highlightColor="#ffffff"
 * >
 *   <View>
 *     <Text>Hello World</Text>
 *     <Image source={avatar} />
 *   </View>
 * </Skeleton>
 * ```
 */
export function Skeleton({
  loading,
  children,
  styles,
  excludeStyles,
  deep = false,
  animation = DEFAULT_CONFIG.animation,
  duration = DEFAULT_CONFIG.duration,
  baseColor = DEFAULT_CONFIG.baseColor,
  highlightColor = DEFAULT_CONFIG.highlightColor,
  borderRadius = DEFAULT_CONFIG.borderRadius,
  accessible = true,
  accessibilityLabel = 'Loading content',
  debug = false,
}: SkeletonProps) {
  // Parse component tree and generate skeleton.
  // Hooks must run unconditionally (rules of hooks), but parsing stays lazy:
  // we skip the work entirely when not loading or in styles-driven mode.
  const skeletonTree = useMemo(() => {
    if (!loading || styles) {
      return [];
    }

    if (__DEV__ && debug) {
      console.log('[Skelo] Parsing component tree...');
    }

    try {
      // Deep mode: expand opaque components into their real host tree by
      // rendering them offline. Falls back to static parsing on failure.
      if (deep) {
        const expanded = expandToComponentNodes(<>{children}</>);
        if (expanded && expanded.length > 0) {
          return expanded;
        }
        if (__DEV__) {
          console.warn('[Skelo] deep expansion returned nothing; falling back to static parsing.');
        }
      }

      const parsed = Parser.parse(children);

      if (__DEV__ && debug) {
        // Log a lightweight summary: the raw nodes hold React elements
        // (`element`) and arbitrary props that aren't safely serializable.
        const summarize = (nodes: typeof parsed): unknown =>
          nodes.map(node => ({
            type: node.type,
            style: node.style,
            children: summarize(node.children),
          }));
        console.log('[Skelo] Parsed tree:', JSON.stringify(summarize(parsed), null, 2));
      }

      return parsed;
    } catch (error) {
      if (__DEV__) {
        console.error('[Skelo] Failed to parse component tree:', error);
      }
      return [];
    }
  }, [loading, styles, deep, children, debug]);

  // Create skeleton config
  const config = useMemo(
    () => ({
      animation,
      duration,
      baseColor,
      highlightColor,
      borderRadius,
    }),
    [animation, duration, baseColor, highlightColor, borderRadius]
  );

  // If not loading, render the real children directly.
  if (!loading) {
    return <>{children}</>;
  }

  // Styles-driven mode: derive the skeleton from the provided styles instead of
  // introspecting the child tree (useful when children are opaque components).
  if (styles) {
    return <StyleSkeleton styles={styles} config={config} exclude={excludeStyles} />;
  }

  return (
    <SkeletonRenderer
      tree={skeletonTree}
      config={config}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      debug={debug}
    />
  );
}

Skeleton.displayName = 'Skeleton';

/**
 * Escape hatch to keep children as real content inside a loading `<Skeleton>`.
 * @see SkeletonIgnore
 */
Skeleton.Ignore = SkeletonIgnore;
