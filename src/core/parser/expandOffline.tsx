import React from 'react';
import type { ReactElement } from 'react';
import type { ComponentNode, ResolvedStyle } from '../../types';
import { resolveStyle } from '../../utils/styleUtils';

/**
 * Offline structural expansion.
 *
 * Renders an element (including opaque function/class components) through a
 * JS-only reconciler to recover its underlying host-element tree (View / Text /
 * Image + resolved styles), then converts it to Skelo's `ComponentNode` tree.
 *
 * This is what lets `<Skeleton><AnyComponent/></Skeleton>` produce a *structured*
 * skeleton without the developer inlining host elements — the core DX.
 *
 * Caveats (by design of rendering the real component):
 * - The component's mount effects run during expansion. Effectful screens
 *   should be guarded or given an explicit skeleton via `Skelo.register`.
 * - It renders outside the app's providers, so context-dependent components may
 *   fall back or throw — handled by an error boundary; on failure we return
 *   null and the caller falls back to static parsing / measurement.
 */

type RtrNode =
  | string
  | {
      type: string;
      props?: { children?: unknown; style?: unknown; [key: string]: unknown };
      children?: RtrNode[] | null;
    };

/**
 * Minimal shape of the react-test-renderer API we rely on. Declared locally so
 * `@types/react-test-renderer` isn't required (the dep is optional/lazy).
 */
interface TestRendererApi {
  create(element: ReactElement): {
    toJSON(): RtrNode | RtrNode[] | null;
    unmount(): void;
  };
  act(callback: () => void): void;
}

/**
 * Run a render/unmount step. `act()` is only appropriate in a test environment
 * (it errors in a real app with "not configured to support act(...)"), so we
 * only use it when React signals we're in one; otherwise we run directly.
 */
function runOfflineStep(Rtr: TestRendererApi, step: () => void): void {
  const inActEnv = (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean })
    .IS_REACT_ACT_ENVIRONMENT;
  if (inActEnv && typeof Rtr.act === 'function') {
    Rtr.act(step);
  } else {
    step();
  }
}

class OfflineBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function toComponentNode(json: RtrNode): ComponentNode | null {
  if (!json || typeof json === 'string') {
    return null;
  }

  const kids = json.children || [];
  const textParts = kids.filter((k): k is string => typeof k === 'string');
  const elementKids = kids.filter(
    (k): k is Exclude<RtrNode, string> => typeof k === 'object' && k !== null
  );

  const props: Record<string, unknown> = { ...(json.props || {}) };
  // Preserve text content so the renderer can estimate line counts.
  if (textParts.length > 0 && props.children == null) {
    props.children = textParts.join('');
  }

  const style: ResolvedStyle = resolveStyle(json.props?.style);

  return {
    type: json.type,
    props,
    style,
    children: elementKids
      .map(toComponentNode)
      .filter((n): n is ComponentNode => n !== null),
  };
}

/**
 * Expand an element to a `ComponentNode[]` via offline rendering.
 *
 * @returns the host-tree nodes, or `null` if offline rendering is unavailable
 *          (react-test-renderer not installed) or the render failed.
 */
export function expandToComponentNodes(
  element: ReactElement
): ComponentNode[] | null {
  // Lazily require so react-test-renderer stays an optional dependency: if it
  // isn't installed, callers fall back to static parsing.
  let Rtr: TestRendererApi;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Rtr = require('react-test-renderer') as TestRendererApi;
  } catch {
    return null;
  }

  let renderer: ReturnType<TestRendererApi['create']> | undefined;
  try {
    runOfflineStep(Rtr, () => {
      renderer = Rtr.create(<OfflineBoundary>{element}</OfflineBoundary>);
    });
    const json = renderer?.toJSON();
    const arr: RtrNode[] = Array.isArray(json)
      ? (json as RtrNode[])
      : json
        ? [json as RtrNode]
        : [];
    return arr
      .map(toComponentNode)
      .filter((n): n is ComponentNode => n !== null);
  } catch {
    return null;
  } finally {
    if (renderer) {
      try {
        const r = renderer;
        runOfflineStep(Rtr, () => r.unmount());
      } catch {
        // ignore unmount errors
      }
    }
  }
}
