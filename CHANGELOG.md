# Changelog

All notable changes to this project are documented here. This project adheres
to [Semantic Versioning](https://semver.org/).

`0.0.x` releases are pre-release/preview. The first **stable** release will be
**`0.1.0`**.

## 0.0.3

### Changed

- **Dropped the `react-native-linear-gradient` dependency.** The shimmer now
  draws its gradient with React Native's built-in `experimental_backgroundImage`
  (New Architecture), animated with Reanimated. One less native peer dep to
  install — the only required peers are now `react` / `react-native` /
  `react-native-reanimated`.

## 0.0.2

### Fixed

- **Bundling error for apps that don't use `deep`.** The core library no longer
  requires `react-reconciler` — a static `require` broke Metro bundling for any
  app that installed Skelo without `react-reconciler` installed. Deep mode is
  now opt-in: install `react-reconciler` and `import 'react-native-skelo/deep'`
  in your app entry. Without it, `<Skeleton deep>` falls back to static parsing.

## 0.0.1

First public preview. The API may change before the stable `0.1.0`.

### Added

- **`<Skeleton loading>`** — derives a skeleton from the host-element tree
  (`View` / `Text` / `Image`) you pass, using each element's own styles.
- **`deep` mode (experimental)** — expands opaque custom components into their
  real host tree via an offline `react-reconciler` renderer, producing a
  structured skeleton with no inlining. Also available as the `withSkeleton`
  HOC. Requires `react-reconciler`.
- **`styles` prop** + `Skelo.fromStyles` — generate a skeleton directly from a
  `StyleSheet` (a stack of shapes, one per style with visual dimensions).
- **`Skeleton.Ignore`** — keep children as real content during loading.
- **Plugin registry** — `Skelo.register` custom skeleton strategies for
  specific components.
- **Primitives** — `SkeletonBox`, `SkeletonText`, `SkeletonImage`,
  `SkeletonCircle`.
- **Animations** — shimmer, pulse, and none (Reanimated-based).
- Fallback: components Skelo can't introspect are measured and shown as a
  single size-matched block.

### Known limitations

- `deep` runs a component's mount effects during introspection and renders
  outside app providers; prefer it for presentational trees and register a
  plugin (or provide a manual skeleton) for effectful/context-bound screens.
- Native content (WebView, MapView, Video, …) can only become a single sized
  block, since it isn't part of the React tree.
