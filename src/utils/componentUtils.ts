import React, { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  FlatList,
  SectionList,
  VirtualizedList,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';

// Re-exported so consumers can access it from the skelo utils surface
export { isValidElement };

/**
 * Reference map of React Native host components to their canonical names.
 *
 * Modern RN components (View/Text/Image/...) are `forwardRef`/`memo` objects,
 * not plain functions or strings, so name/displayName sniffing is unreliable.
 * Identifying them by reference is exact. This works across the library/app
 * module boundary because Metro resolves a single `react-native` instance.
 */
const RN_COMPONENT_NAMES = new Map<unknown, string>([
  [View, 'View'],
  [Text, 'Text'],
  [Image, 'Image'],
  [ImageBackground, 'ImageBackground'],
  [ScrollView, 'ScrollView'],
  [SafeAreaView, 'SafeAreaView'],
  [FlatList, 'FlatList'],
  [SectionList, 'SectionList'],
  [VirtualizedList, 'VirtualizedList'],
  [TouchableOpacity, 'TouchableOpacity'],
  [TouchableHighlight, 'TouchableHighlight'],
  [TouchableWithoutFeedback, 'TouchableWithoutFeedback'],
  [Pressable, 'Pressable'],
  [KeyboardAvoidingView, 'KeyboardAvoidingView'],
]);

/**
 * Get component display name or type name
 *
 * @param element - React element
 * @returns Component name as string
 */
export function getComponentName(element: ReactElement): string {
  const type: unknown = element.type;

  if (type === React.Fragment) {
    return 'Fragment';
  }

  // Exact identification of RN host components (forwardRef/memo objects).
  const mapped = RN_COMPONENT_NAMES.get(type);
  if (mapped) {
    return mapped;
  }

  // Intrinsic host string (e.g. web/DOM or raw native tags).
  if (typeof type === 'string') {
    return type;
  }

  // Plain function/class components.
  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName || fn.name || 'Anonymous';
  }

  // forwardRef / memo wrappers: unwrap to find a usable name.
  if (typeof type === 'object' && type !== null) {
    const obj = type as {
      displayName?: string;
      render?: { displayName?: string; name?: string };
      type?: unknown;
    };
    if (obj.displayName) {
      return obj.displayName;
    }
    if (obj.render) {
      return obj.render.displayName || obj.render.name || 'Anonymous';
    }
    // memo(Component) nests the real component under `.type`.
    if (obj.type) {
      return getComponentName({ type: obj.type } as ReactElement);
    }
    return 'Anonymous';
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

  React.Children.forEach(children, child => {
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
