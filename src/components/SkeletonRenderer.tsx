import React from 'react';
import { View } from 'react-native';
import type { ComponentNode, SkeletonConfig } from '../types';
import { registry } from '../core/registry';
import { SkeletonBox, SkeletonText, SkeletonImage, SkeletonCircle } from './primitives';
import { MeasuredBlock } from './MeasuredBlock';
import { resolveStyle, extractDimensions } from '../utils/styleUtils';
import { randomWidth } from '../utils/componentUtils';

/**
 * Host component types the renderer knows how to skeletonize directly.
 * Anything else is treated as an opaque component and measured at runtime.
 */
const HOST_CONTAINER_TYPES = new Set([
  'View',
  'ScrollView',
  'SafeAreaView',
  'KeyboardAvoidingView',
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
  'TouchableNativeFeedback',
  'Pressable',
  'Fragment',
]);
const HOST_LIST_TYPES = new Set(['FlatList', 'SectionList', 'VirtualizedList']);

// Track which opaque component names we've already warned about (dev only).
const warnedOpaqueTypes = new Set<string>();

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

    // Skeleton.Ignore escape hatch: render the real children untouched.
    if (node.type === 'Skeleton.Ignore') {
      return <React.Fragment key={index}>{node.props?.children}</React.Fragment>;
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
              parseChildren: children => {
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

    // Built-in host component handling
    switch (node.type) {
      case 'Text':
        return renderText(node, index);

      case 'Image':
        return renderImage(node, index);
    }

    if (HOST_LIST_TYPES.has(node.type) || node.type === 'ScrollView') {
      return renderScrollableView(node, index);
    }

    if (HOST_CONTAINER_TYPES.has(node.type)) {
      return renderView(node, index);
    }

    // Opaque component: the parser can't see inside it (a user-defined
    // function/class component). Render it hidden and measure its real size,
    // then overlay a size-matched shimmer.
    return renderOpaque(node, index);
  };

  /**
   * Render an opaque (non-host) component via runtime measurement.
   */
  const renderOpaque = (node: ComponentNode, index: number): React.ReactElement => {
    if (__DEV__ && !warnedOpaqueTypes.has(node.type)) {
      warnedOpaqueTypes.add(node.type);
      console.warn(
        `[Skelo] "${node.type}" is a custom component, so Skelo can't inspect ` +
          `its internal View/Text/Image structure. It will be measured and ` +
          `shown as a single size-matched skeleton block.\n` +
          `For a structured skeleton, either compose "${node.type}" from host ` +
          `elements directly inside <Skeleton>, register a plugin via ` +
          `Skelo.register(${node.type}, ...), or provide a manual skeleton.`
      );
    }

    // If we still have the original element, measure it. Otherwise fall back
    // to a container/box render.
    if (node.element) {
      return (
        <MeasuredBlock key={index} config={config}>
          {node.element}
        </MeasuredBlock>
      );
    }

    return renderView(node, index);
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
