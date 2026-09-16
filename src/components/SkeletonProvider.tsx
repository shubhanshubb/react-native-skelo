import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { SkeletonConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants/defaults';

const SkeletonThemeContext = createContext<Required<SkeletonConfig>>(DEFAULT_CONFIG);

export interface SkeletonProviderProps extends SkeletonConfig {
  children: ReactNode;
}

/** App-wide skeleton defaults. Nested providers inherit unspecified values. */
export function SkeletonProvider({
  children,
  animation,
  duration,
  baseColor,
  highlightColor,
  borderRadius,
  debug,
}: SkeletonProviderProps) {
  const parent = useContext(SkeletonThemeContext);
  const value = useMemo(
    () => ({
      animation: animation ?? parent.animation,
      duration: duration ?? parent.duration,
      baseColor: baseColor ?? parent.baseColor,
      highlightColor: highlightColor ?? parent.highlightColor,
      borderRadius: borderRadius ?? parent.borderRadius,
      debug: debug ?? parent.debug,
    }),
    [parent, animation, duration, baseColor, highlightColor, borderRadius, debug]
  );

  return <SkeletonThemeContext.Provider value={value}>{children}</SkeletonThemeContext.Provider>;
}

export function useSkeletonTheme() {
  return useContext(SkeletonThemeContext);
}
