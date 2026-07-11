import React from 'react';
import { Text } from 'react-native';
import type { SkeletonPlugin } from '../types';
import type { TextProps } from 'react-native';

/**
 * Built-in plugin for React Native Text component
 *
 * Renders Text as SkeletonText with:
 * - Estimated line count from text content
 * - Font size from style
 * - Line height from style
 */
export const TextPlugin: SkeletonPlugin<TextProps> = {
  name: 'Text',
  component: Text,
  version: '1.0.0',

  strategy: (props, context) => {
    const { primitives, config } = context;
    const style = props.style || {};
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    const fontSize = flatStyle.fontSize ?? 14;
    const lineHeight = flatStyle.lineHeight ?? fontSize * 1.4;

    // Estimate number of lines from text content
    const textContent = props.children;
    const estimatedLines = estimateTextLines(textContent);

    return (
      <primitives.Text
        lines={estimatedLines}
        fontSize={fontSize}
        lineHeight={lineHeight}
        width={flatStyle.width ?? '100%'}
        animation={config.animation}
        baseColor={config.baseColor}
        highlightColor={config.highlightColor}
        duration={config.duration}
        style={flatStyle}
      />
    );
  },

  metadata: {
    description: 'Automatic skeleton generation for Text components',
    author: 'Skelo',
  },
};

/**
 * Estimate number of lines from text content
 */
function estimateTextLines(children: any): number {
  if (!children) return 1;

  if (typeof children === 'string' || typeof children === 'number') {
    const text = String(children);
    const avgCharsPerLine = 40;
    const estimatedLines = Math.ceil(text.length / avgCharsPerLine);
    return Math.max(1, Math.min(estimatedLines, 5)); // Cap at 5 lines
  }

  if (Array.isArray(children)) {
    // Multiple text nodes - count as separate lines
    return Math.min(children.length, 5);
  }

  return 1;
}
