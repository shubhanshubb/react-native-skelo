import React, { useMemo } from 'react';
import type { SkeletonProps } from '../types';
import { Parser } from '../core/parser';
import { SkeletonRenderer } from './SkeletonRenderer';
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
  // we skip the work entirely when not loading.
  const skeletonTree = useMemo(() => {
    if (!loading) {
      return [];
    }

    if (__DEV__ && debug) {
      console.log('[Skelo] Parsing component tree...');
    }

    try {
      const parsed = Parser.parse(children);

      if (__DEV__ && debug) {
        console.log('[Skelo] Parsed tree:', JSON.stringify(parsed, null, 2));
      }

      return parsed;
    } catch (error) {
      if (__DEV__) {
        console.error('[Skelo] Failed to parse component tree:', error);
      }
      return [];
    }
  }, [loading, children, debug]);

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

  // If not loading, render children directly
  if (!loading) {
    return <>{children}</>;
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
