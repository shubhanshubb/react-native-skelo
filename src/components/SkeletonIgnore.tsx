import React from 'react';
import type { ReactNode } from 'react';

interface SkeletonIgnoreProps {
  children?: ReactNode;
}

/**
 * Escape hatch that renders its children as real content, even inside a
 * loading `<Skeleton>`. Use it for elements that should stay visible during
 * loading — section headings, static labels, action buttons, etc.
 *
 * @example
 * ```tsx
 * <Skeleton loading={loading}>
 *   <Skeleton.Ignore>
 *     <Text>Profile</Text>       // stays as real text
 *   </Skeleton.Ignore>
 *   <ProfileCard />              // becomes a skeleton
 * </Skeleton>
 * ```
 */
export function SkeletonIgnore({ children }: SkeletonIgnoreProps) {
  return <>{children}</>;
}

SkeletonIgnore.displayName = 'Skeleton.Ignore';
