/**
 * Skelo - Automatic skeleton loading for React Native
 *
 * Write your UI once. Skelo builds the loading state automatically.
 *
 * @packageDocumentation
 */

// Global API
export { Skelo } from './Skelo';

// Types
export type {
  SkeletonProps,
  SkeletonConfig,
  SkeletonPlugin,
  SkeletonStrategy,
  SkeletonContext,
} from './types';

// Primitives (for plugin development)
export { SkeletonBox, SkeletonText, SkeletonImage, SkeletonCircle } from './components/primitives';

// Note: Main <Skeleton> component will be exported once implemented
// export { Skeleton } from './components/Skeleton';
