import type { ReactElement } from 'react';
import type { ComponentNode } from '../types';

// Deep expansion is opt-in so the core bundle never depends on react-reconciler.
// `react-native-skelo/deep` registers the expander; Skeleton reads it here.
type DeepExpander = (element: ReactElement) => ComponentNode[] | null;

let expander: DeepExpander | null = null;

export function setDeepExpander(fn: DeepExpander): void {
  expander = fn;
}

export function getDeepExpander(): DeepExpander | null {
  return expander;
}
