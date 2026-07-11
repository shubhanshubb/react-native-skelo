import type { SkeletonConfig } from '../types';

/**
 * Default skeleton configuration
 */
export const DEFAULT_CONFIG: Required<SkeletonConfig> = {
  animation: 'shimmer',
  duration: 1200,
  baseColor: '#E1E9EE',
  highlightColor: '#F0F4F8',
  borderRadius: 4,
  debug: false,
};

/**
 * Dark mode colors
 */
export const DARK_MODE_COLORS = {
  baseColor: '#2A3F4F',
  highlightColor: '#3A5364',
};

/**
 * Default dimensions for components without explicit sizing
 */
export const DEFAULT_DIMENSIONS = {
  image: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  box: {
    height: 50,
  },
};
