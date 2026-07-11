import React, { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

// Re-exported so consumers can access it from the skelo utils surface
export { isValidElement };

/**
 * Get component display name or type name
 *
 * @param element - React element
 * @returns Component name as string
 */
export function getComponentName(element: ReactElement): string {
  const type = element.type;

  if (typeof type === 'string') {
    return type;
  }

  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName || fn.name || 'Anonymous';
  }

  return 'Unknown';
}

/**
 * Check if element is a React Fragment
 *
 * @param element - React element
 * @returns True if element is a Fragment
 */
export function isFragment(element: ReactElement): boolean {
  return element.type === React.Fragment;
}

/**
 * Flatten children, handling Fragments recursively
 *
 * @param children - React children
 * @returns Flattened array of children
 */
export function flattenChildren(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      result.push(child);
      return;
    }

    if (isFragment(child)) {
      // Recursively flatten fragment children
      const fragmentChildren = flattenChildren(child.props.children);
      result.push(...fragmentChildren);
    } else {
      result.push(child);
    }
  });

  return result;
}

/**
 * Check if component is a touchable component
 *
 * @param element - React element
 * @returns True if component is touchable
 */
export function isTouchableComponent(element: ReactElement): boolean {
  const name = getComponentName(element);
  const touchableTypes = [
    'TouchableOpacity',
    'TouchableHighlight',
    'TouchableWithoutFeedback',
    'TouchableNativeFeedback',
    'Pressable',
  ];
  return touchableTypes.includes(name);
}

/**
 * Generate random width percentage for natural skeleton look
 *
 * @param min - Minimum percentage (0-100)
 * @param max - Maximum percentage (0-100)
 * @returns Random percentage as string (e.g., "75%")
 */
export function randomWidth(min: number = 60, max: number = 90): string {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${random}%`;
}
