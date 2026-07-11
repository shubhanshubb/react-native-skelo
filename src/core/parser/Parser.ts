import React, { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { ComponentNode } from '../../types';
import { StyleResolver } from '../resolver';
import { getComponentName, flattenChildren } from '../../utils';

/**
 * Parser class for traversing and analyzing React component trees
 */
export class Parser {
  /**
   * Parse a React element tree into a component node tree
   *
   * @param children - React children to parse
   * @returns Array of component nodes
   */
  static parse(children: ReactNode): ComponentNode[] {
    const flattened = flattenChildren(children);
    const nodes: ComponentNode[] = [];

    flattened.forEach(child => {
      if (!isValidElement(child)) {
        // Skip non-element children (strings, numbers, null, etc.)
        return;
      }

      const node = this.parseElement(child);
      if (node) {
        nodes.push(node);
      }
    });

    return nodes;
  }

  /**
   * Parse a single React element
   *
   * @param element - React element
   * @returns Component node or null
   */
  static parseElement(element: ReactElement): ComponentNode | null {
    const type = getComponentName(element);
    const props = element.props || {};
    const style = StyleResolver.resolve(element);

    // Parse children recursively
    const children = props.children ? this.parse(props.children) : [];

    return {
      type,
      props,
      style,
      children,
      element,
    };
  }

  /**
   * Estimate number of text lines from content and style
   *
   * @param children - Text content
   * @param style - Resolved style
   * @returns Estimated number of lines
   */
  static estimateTextLines(children: ReactNode, _style?: any): number {
    if (!children) {
      return 1;
    }

    // Convert children to string
    const text = React.Children.toArray(children)
      .filter(child => typeof child === 'string' || typeof child === 'number')
      .join('');

    if (!text) {
      return 1;
    }

    // Simple heuristic: ~40 characters per line
    const avgCharsPerLine = 40;
    const estimatedLines = Math.ceil(text.length / avgCharsPerLine);

    return Math.max(1, Math.min(estimatedLines, 5)); // Cap at 5 lines
  }
}
