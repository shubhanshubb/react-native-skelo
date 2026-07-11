import React from 'react';
import { View } from 'react-native';
import type { ComponentNode, SkeletonConfig } from '../types';
import { registry } from '../core/registry';
import { SkeletonBox, SkeletonText, SkeletonImage, SkeletonCircle } from './primitives';
import { resolveStyle, extractDimensions } from '../utils/styleUtils';
import { randomWidth } from '../utils/componentUtils';

interface SkeletonRendererProps {
  /**
   * Parsed component tree
   */
  tree: ComponentNode[];

  /**
   * Skeleton configuration
   */
  config: SkeletonConfig;

  /**
   * Accessibility enabled
   */
  accessible?: boolean;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Debug mode
   */
  debug?: boolean;
}

/**
 * Renders skeleton from parsed component tree
 *
 * Uses plugins to transform components into skeleton equivalents:
 * - View -> SkeletonBox
 * - Text -> SkeletonText
 * - Image -> SkeletonImage
 * - Custom components -> Plugin strategies
 */
export function SkeletonRenderer({
  tree,
  config,
  accessible,
  accessibilityLabel,
  debug,
}: SkeletonRendererProps) {
  /**
   * Render a single component node
   */
  const renderNode = (node: ComponentNode, index: number): React.ReactElement | null => {
    if (__DEV__ && debug) {
      console.log(`[Skelo] Rendering node: ${node.type}`, node);
    }

    // Check for registered plugin
    const plugin = registry.getPluginByName(node.type);
    if (plugin) {
      try {
        return (
          <React.Fragment key={index}>
            {plugin.strategy(node.props, {
              config,
              theme: 'light', // TODO: Add theme detection
              parseChildren: (children) => {
                const parsed =
                  typeof children === 'object' && children !== null
                    ? [children as unknown as ComponentNode]
                    : [];
                return parsed.map((child, i) => renderNode(child, i));
              },
              primitives: {
                Box: SkeletonBox,
                Text: SkeletonText,
                Image: SkeletonImage,
                Circle: SkeletonCircle,
              },
              utils: {
                resolveStyle,
                extractDimensions,
                randomWidth,
              },
            })}
          </React.Fragment>
        );
      } catch (error) {
        if (__DEV__) {
          console.error(`[Skelo] Plugin "${plugin.name}" failed:`, error);
        }
      }
    }

    // Built-in component handling
    switch (node.type) {
      case 'View':
        return renderView(node, index);

      case 'Text':
        return renderText(node, index);

      case 'Image':
        return renderImage(node, index);

      case 'ScrollView':
      case 'FlatList':
      case 'SectionList':
        return renderScrollableView(node, index);

      default:
        // Unknown component - try to render as View
        if (__DEV__ && debug) {
          console.warn(`[Skelo] Unknown component type: ${node.type}, rendering as View`);
        }
        return renderView(node, index);
    }
  };

  /**
   * Render View component
   */
  const renderView = (node: ComponentNode, index: number): React.ReactElement => {
    const { width, height } = node.style;
    const hasChildren = node.children && node.children.length > 0;

    // If View has explicit dimensions, render as box
    if (width && height) {
      return (
        <SkeletonBox
          key={index}
          width={width}
          height={height}
          borderRadius={node.style.borderRadius ?? config.borderRadius}
          animation={config.animation}
          baseColor={config.baseColor}
          highlightColor={config.highlightColor}
          duration={config.duration}
          style={node.style}
        />
      );
    }

    // If View has children, render container with children
    if (hasChildren) {
      return (
        <View key={index} style={node.style}>
          {node.children.map((child, i) => renderNode(child, i))}
        </View>
      );
    }

    // Empty View with no dimensions - render as small box
    return (
      <SkeletonBox
        key={index}
        width={width ?? 100}
        height={height ?? 20}
        borderRadius={node.style.borderRadius ?? config.borderRadius}
        animation={config.animation}
        baseColor={config.baseColor}
        highlightColor={config.highlightColor}
        duration={config.duration}
        style={node.style}
      />
    );
  };

  /**
   * Render Text component
   */
  const renderText = (node: ComponentNode, index: number): React.ReactElement => {
    const fontSize = (node.style.fontSize as number) ?? 14;
    const lineHeight = (node.style.lineHeight as number) ?? fontSize * 1.4;

    // Estimate number of lines from text content
    const textContent = node.props.children;
    const estimatedLines = estimateTextLines(textContent);

    return (
      <SkeletonText
        key={index}
        lines={estimatedLines}
        fontSize={fontSize}
        lineHeight={lineHeight}
        width={node.style.width ?? '100%'}
        animation={config.animation}
        baseColor={config.baseColor}
        highlightColor={config.highlightColor}
        duration={config.duration}
        style={node.style}
      />
    );
  };

  /**
   * Render Image component
   */
  const renderImage = (node: ComponentNode, index: number): React.ReactElement => {
    const width = node.style.width ?? 100;
    const height = node.style.height ?? 100;
    const borderRadius = node.style.borderRadius ?? 0;

    // Check if it's a circular image (avatar)
    const isCircle =
      typeof width === 'number' &&
      typeof height === 'number' &&
      width === height &&
      borderRadius === width / 2;

    if (isCircle) {
      return (
        <SkeletonCircle
          key={index}
          size={width as number}
          animation={config.animation}
          baseColor={config.baseColor}
          highlightColor={config.highlightColor}
          duration={config.duration}
          style={node.style}
        />
      );
    }

    return (
      <SkeletonImage
        key={index}
        width={width}
        height={height}
        borderRadius={borderRadius as number}
        animation={config.animation}
        baseColor={config.baseColor}
        highlightColor={config.highlightColor}
        duration={config.duration}
        style={node.style}
      />
    );
  };

  /**
   * Render scrollable views
   */
  const renderScrollableView = (node: ComponentNode, index: number): React.ReactElement => {
    // For scrollable views, render their children
    return (
      <View key={index} style={node.style}>
        {node.children.map((child, i) => renderNode(child, i))}
      </View>
    );
  };

  /**
   * Estimate number of lines from text content
   */
  const estimateTextLines = (children: any): number => {
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
  };

  // Render the skeleton tree
  return (
    <View
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
    >
      {tree.map((node, index) => renderNode(node, index))}
    </View>
  );
}

SkeletonRenderer.displayName = 'SkeletonRenderer';
