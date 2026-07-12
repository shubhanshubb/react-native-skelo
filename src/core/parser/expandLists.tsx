import React, { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';
import { getComponentName } from '../../utils/componentUtils';

// List components whose rows come from `renderItem` (not JSX children).
const LIST_TYPES = new Set(['FlatList', 'SectionList', 'VirtualizedList', 'FlashList']);

const NOOP_SEPARATORS = {
  highlight: () => {},
  unhighlight: () => {},
  updateProps: () => {},
};

// Renders `count` sample rows from a list's `renderItem` so there's something
// to skeletonize while the real data is still loading (the rows don't exist in
// the tree yet). Rows that throw on placeholder data are skipped.
function renderSampleRows(list: ReactElement, count: number): ReactNode {
  const props = (list.props || {}) as {
    renderItem?: (info: {
      item: unknown;
      index: number;
      section?: unknown;
      separators: typeof NOOP_SEPARATORS;
    }) => ReactNode;
    data?: unknown[];
    contentContainerStyle?: unknown;
  };

  const data = Array.isArray(props.data) ? props.data : [];
  const sample = data.length > 0 ? data[0] : {};

  const rows: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    try {
      const row = props.renderItem?.({
        item: sample,
        index: i,
        section: {},
        separators: NOOP_SEPARATORS,
      });
      if (row) {
        rows.push(<React.Fragment key={i}>{row}</React.Fragment>);
      }
    } catch {
      // Row couldn't render with placeholder data — skip it.
    }
  }

  return <View style={props.contentContainerStyle as never}>{rows}</View>;
}

// Walks a child tree and replaces FlatList/SectionList with sample rows so a
// plain `<Skeleton><FlatList/></Skeleton>` produces a skeleton while loading.
export function expandListPlaceholders(children: ReactNode, count: number): ReactNode {
  return React.Children.map(children, child => {
    if (!isValidElement(child)) {
      return child;
    }

    const name = getComponentName(child);
    const props = (child.props || {}) as { children?: ReactNode };

    if (
      LIST_TYPES.has(name) &&
      typeof (props as { renderItem?: unknown }).renderItem === 'function'
    ) {
      return renderSampleRows(child, count);
    }

    if (props.children) {
      return React.cloneElement(child, undefined, expandListPlaceholders(props.children, count));
    }

    return child;
  });
}
