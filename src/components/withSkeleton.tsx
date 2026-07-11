import React from 'react';
import type { ComponentType } from 'react';
import type { SkeletonConfig } from '../types';
import type { StyleInput } from '../core/generator/StyleSkeleton';
import { Skeleton } from './Skeleton';

export interface WithSkeletonOptions extends Partial<SkeletonConfig> {
  /**
   * Styles used to generate the skeleton while loading. Required when the
   * wrapped component is opaque (a typical screen/component), since Skelo can't
   * introspect its internals.
   */
  styles?: StyleInput;

  /**
   * Style keys to skip when generating the skeleton (e.g. layout containers).
   */
  excludeStyles?: string[];
}

/**
 * Higher-order component that adds a loading skeleton to any component.
 *
 * The returned component accepts a `loading` prop (plus the wrapped
 * component's own props). While `loading` is true it renders a skeleton
 * derived from `options.styles`; otherwise it renders the real component.
 *
 * @example
 * ```tsx
 * const Home = withSkeleton(HomeScreen, { styles });
 *
 * <Home loading={isLoading} user={user} />
 * ```
 */
export function withSkeleton<P extends object>(
  Component: ComponentType<P>,
  options: WithSkeletonOptions = {}
) {
  const WithSkeleton = (props: P & { loading: boolean }) => {
    const { loading, ...componentProps } = props;

    return (
      <Skeleton
        loading={loading}
        styles={options.styles}
        excludeStyles={options.excludeStyles}
        animation={options.animation}
        duration={options.duration}
        baseColor={options.baseColor}
        highlightColor={options.highlightColor}
        borderRadius={options.borderRadius}
      >
        <Component {...(componentProps as unknown as P)} />
      </Skeleton>
    );
  };

  const name = Component.displayName || Component.name || 'Component';
  WithSkeleton.displayName = `withSkeleton(${name})`;

  return WithSkeleton;
}
