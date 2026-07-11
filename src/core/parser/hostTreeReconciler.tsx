import React from 'react';
import type { ReactElement } from 'react';

/**
 * A JS-only React renderer built on `react-reconciler`.
 *
 * It renders any element (including opaque function/class components) into a
 * plain host-node tree — no native views, no `act()`, no deprecated APIs. Used
 * to introspect a component's real View/Text/Image structure + styles so Skelo
 * can generate a matching skeleton.
 *
 * Rendered as a synchronous LegacyRoot, so `updateContainer` flushes inline and
 * we can read the tree immediately.
 */

export interface HostTreeNode {
  type: string;
  props: { style?: unknown; children?: unknown; [key: string]: unknown };
  children: HostTreeNode[];
  text?: string;
}

interface Container {
  children: HostTreeNode[];
}

const NO_CONTEXT = {};

const DefaultEventPriority = 32; // DefaultLane

function makeHostConfig() {
  // Reconciler 0.31 (React 19) tracks update priority via host methods.
  let currentUpdatePriority = 0; // NoLane
  return {
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    isPrimaryRenderer: false,
    noTimeout: -1,
    now: () => Date.now(),
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    // Must be false: microtask scheduling defers the render, leaving the tree
    // empty when we read it synchronously. Disabling it makes the LegacyRoot
    // render commit inline inside updateContainer.
    supportsMicrotasks: false,

    getRootHostContext: () => NO_CONTEXT,
    getChildHostContext: (parent: unknown) => parent,
    getPublicInstance: (instance: unknown) => instance,
    prepareForCommit: () => null,
    resetAfterCommit: () => {},
    preparePortalMount: () => {},

    createInstance(type: string, props: HostTreeNode['props']): HostTreeNode {
      return { type, props, children: [] };
    },
    createTextInstance(text: string): HostTreeNode {
      return { type: '#text', props: {}, children: [], text };
    },

    appendInitialChild(parent: HostTreeNode, child: HostTreeNode) {
      parent.children.push(child);
    },
    appendChild(parent: HostTreeNode, child: HostTreeNode) {
      parent.children.push(child);
    },
    appendChildToContainer(container: Container, child: HostTreeNode) {
      container.children.push(child);
    },
    insertBefore(parent: HostTreeNode, child: HostTreeNode, before: HostTreeNode) {
      const i = parent.children.indexOf(before);
      if (i === -1) parent.children.push(child);
      else parent.children.splice(i, 0, child);
    },
    insertInContainerBefore(container: Container, child: HostTreeNode, before: HostTreeNode) {
      const i = container.children.indexOf(before);
      if (i === -1) container.children.push(child);
      else container.children.splice(i, 0, child);
    },
    removeChild(parent: HostTreeNode, child: HostTreeNode) {
      const i = parent.children.indexOf(child);
      if (i !== -1) parent.children.splice(i, 1);
    },
    removeChildFromContainer(container: Container, child: HostTreeNode) {
      const i = container.children.indexOf(child);
      if (i !== -1) container.children.splice(i, 1);
    },

    finalizeInitialChildren: () => false,
    shouldSetTextContent: () => false,
    prepareUpdate: () => ({}),
    commitUpdate(
      instance: HostTreeNode,
      _payload: unknown,
      _type: string,
      _old: unknown,
      newProps: HostTreeNode['props']
    ) {
      instance.props = newProps;
    },
    commitTextUpdate(textInstance: HostTreeNode, _old: string, next: string) {
      textInstance.text = next;
    },
    clearContainer(container: Container) {
      container.children = [];
    },
    detachDeletedInstance: () => {},

    // Required by React 18/19 reconcilers:
    getCurrentEventPriority: () => DefaultEventPriority,
    // Reconciler 0.31 (React 19) replaced the above with update-priority hooks;
    // requestUpdateLane() calls these, so they must exist or it throws
    // "undefined is not a function".
    setCurrentUpdatePriority: (priority: number) => {
      currentUpdatePriority = priority;
    },
    getCurrentUpdatePriority: () => currentUpdatePriority,
    resolveUpdatePriority: () => currentUpdatePriority || DefaultEventPriority,
    beforeActiveInstanceBlur: () => {},
    afterActiveInstanceBlur: () => {},
    prepareScopeUpdate: () => {},
    getInstanceFromScope: () => null,
    getInstanceFromNode: () => null,

    // Newer reconciler (0.31 / React 19) additions — harmless on older versions:
    maySuspendCommit: () => false,
    startSuspendingCommit: () => {},
    suspendInstance: () => {},
    waitForCommitToBeReady: () => null,
    NotPendingTransition: null,
    // React 19 reads this context during render; it must be a real context.
    HostTransitionContext: React.createContext(null),
    resetFormInstance: () => {},
    requestPostPaintCallback: () => {},
    shouldAttemptEagerTransition: () => false,
    trackSchedulerEvent: () => {},
    resolveEventType: () => null,
    resolveEventTimeStamp: () => -1.1,
  };
}

class RenderBoundary extends React.Component<{ children: React.ReactNode }> {
  static getDerivedStateFromError() {
    return {};
  }
  render() {
    return this.props.children;
  }
}

let cachedReconciler:
  | ((config: unknown) => {
      createContainer: (...args: unknown[]) => unknown;
      updateContainer: (...args: unknown[]) => unknown;
    })
  | null = null;

function getReconciler() {
  if (cachedReconciler) return cachedReconciler;

  const Reconciler = require('react-reconciler');
  cachedReconciler = Reconciler.default || Reconciler;
  return cachedReconciler;
}

/**
 * Render an element to a plain host-node tree, or return null if the reconciler
 * is unavailable or rendering failed.
 */
export function renderToHostTree(element: ReactElement): HostTreeNode[] | null {
  let Reconciler;
  try {
    Reconciler = getReconciler();
  } catch {
    return null;
  }
  if (!Reconciler) {
    return null;
  }

  try {
    // Wrap the host config so any method a newer reconciler calls that we
    // didn't explicitly define resolves to a safe no-op instead of `undefined`
    // (which throws "undefined is not a function"). All value-returning methods
    // are defined above, so only side-effect methods hit this fallback.
    const baseConfig = makeHostConfig() as Record<string, unknown>;
    const noopFn = () => {};
    const safeConfig = new Proxy(baseConfig, {
      get(target, prop: string) {
        if (prop in target) return target[prop];
        return noopFn;
      },
    });
    const reconciler = Reconciler(safeConfig);
    const container: Container = { children: [] };
    const noop = () => {};
    // createContainer's signature differs across reconciler versions:
    // React 19 (reconciler 0.31) added onUncaughtError/onCaughtError before
    // onRecoverableError; React 18 (0.29) has a single onRecoverableError.
    const isReact19 = parseInt(React.version, 10) >= 19;
    const root = isReact19
      ? reconciler.createContainer(
          container,
          0, // LegacyRoot -> synchronous
          null,
          false,
          null,
          '',
          noop, // onUncaughtError
          noop, // onCaughtError
          noop, // onRecoverableError
          null
        )
      : reconciler.createContainer(
          container,
          0,
          null,
          false,
          null,
          '',
          noop, // onRecoverableError
          null
        );

    const rc = reconciler as {
      updateContainer: (...a: unknown[]) => unknown;
      updateContainerSync?: (...a: unknown[]) => unknown;
      flushSyncWork?: () => void;
      flushSync?: (fn: () => void) => void;
    };

    const element0 = React.createElement(RenderBoundary, null, element);

    // Render synchronously so the tree is populated before we read it.
    // react-reconciler 0.31 (React 19) defers `updateContainer`; it exposes
    // `updateContainerSync` + `flushSyncWork` for a guaranteed inline commit.
    // Older 0.29 flushes inline via `flushSync(updateContainer)`.
    if (typeof rc.updateContainerSync === 'function') {
      rc.updateContainerSync(element0, root, null, noop);
      rc.flushSyncWork?.();
    } else if (typeof rc.flushSync === 'function') {
      rc.flushSync(() => rc.updateContainer(element0, root, null, noop));
    } else {
      rc.updateContainer(element0, root, null, noop);
    }

    const tree = container.children.slice();

    // Unmount to run cleanup.
    if (typeof rc.updateContainerSync === 'function') {
      rc.updateContainerSync(null, root, null, noop);
      rc.flushSyncWork?.();
    } else {
      rc.updateContainer(null, root, null, noop);
    }

    if (__DEV__ && tree.length === 0) {
      console.warn(
        '[Skelo] Offline render produced an empty tree; falling back to static parsing.'
      );
    }

    return tree;
  } catch (error) {
    if (__DEV__) {
      console.warn('[Skelo] Offline render failed:', error);
    }
    return null;
  }
}
