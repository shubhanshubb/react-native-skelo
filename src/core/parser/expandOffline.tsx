import type { ReactElement } from 'react';
import type { ComponentNode, ResolvedStyle } from '../../types';
import { resolveStyle } from '../../utils/styleUtils';
import { renderToHostTree } from './hostTreeReconciler';
import type { HostTreeNode } from './hostTreeReconciler';

/**
 * Offline structural expansion.
 *
 * Renders an element (including opaque function/class components) through a
 * JS-only `react-reconciler` renderer to recover its underlying host-element
 * tree (View / Text / Image + resolved styles), then converts it to Skelo's
 * `ComponentNode` tree.
 *
 * This is what lets `<Skeleton><AnyComponent/></Skeleton>` produce a *structured*
 * skeleton without the developer inlining host elements — the core DX. No
 * deprecated APIs, no `act()`.
 *
 * Caveats (inherent to rendering the real component):
 * - The component's mount effects run during expansion. Effectful screens
 *   should be guarded or given an explicit skeleton via `Skelo.register`.
 * - It renders outside the app's providers, so context-dependent components may
 *   throw — caught, returning null so the caller falls back to static parsing.
 */

/**
 * Normalize a host instance type to a canonical name the renderer understands.
 * On device, RN host components may surface as native names (e.g. RCTView,
 * RCTSinglelineTextInputView); map them to View/Text/Image/etc.
 */
function normalizeType(type: string): string {
  if (/image/i.test(type)) return 'Image';
  if (/textinput/i.test(type)) return 'TextInput';
  if (/text/i.test(type)) return 'Text';
  if (/scroll/i.test(type)) return 'ScrollView';
  if (/(flat|section|virtualized)list/i.test(type)) return 'FlatList';
  // Everything else is treated as a plain container view.
  return 'View';
}

function toComponentNode(node: HostTreeNode): ComponentNode | null {
  if (node.type === '#text') {
    return null; // text is folded into its parent's props.children
  }

  const textParts: string[] = [];
  const elementChildren: HostTreeNode[] = [];
  for (const child of node.children) {
    if (child.type === '#text') {
      if (child.text) textParts.push(child.text);
    } else {
      elementChildren.push(child);
    }
  }

  const props: Record<string, unknown> = { ...node.props };
  if (textParts.length > 0 && props.children == null) {
    props.children = textParts.join('');
  }

  const style: ResolvedStyle = resolveStyle(node.props.style);

  return {
    type: normalizeType(node.type),
    props,
    style,
    children: elementChildren.map(toComponentNode).filter((n): n is ComponentNode => n !== null),
  };
}

/**
 * Expand an element to a `ComponentNode[]` via offline rendering.
 *
 * @returns the host-tree nodes, or `null` if offline rendering is unavailable
 *          (react-reconciler not installed) or the render failed.
 */
export function expandToComponentNodes(element: ReactElement): ComponentNode[] | null {
  const tree = renderToHostTree(element);
  if (!tree) {
    return null;
  }
  return tree.map(toComponentNode).filter((n): n is ComponentNode => n !== null);
}
