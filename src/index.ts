/**
 * Skelo - Automatic skeleton loading for React Native
 *
 * Write your UI once. Skelo builds the loading state automatically.
 *
 * @packageDocumentation
 */

// Auto-register deep expansion (react-reconciler ships as a dependency), so
// `<Skeleton deep>` / opaque components work with zero setup.
import './deep';

// Main component
export { Skeleton } from './components/Skeleton';
export { SkeletonIgnore } from './components/SkeletonIgnore';
export { withSkeleton } from './components/withSkeleton';
export type { WithSkeletonOptions } from './components/withSkeleton';
export { StyleSkeleton } from './core/generator/StyleSkeleton';
export type { StyleInput } from './core/generator/StyleSkeleton';

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
