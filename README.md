<div align="center">

# react-native-skelo

**Write your UI once. Skelo builds the loading state automatically.**

[![npm](https://img.shields.io/npm/v/react-native-skelo/alpha)](https://www.npmjs.com/package/react-native-skelo)
[![license](https://img.shields.io/npm/l/react-native-skelo)](./LICENSE)

</div>

> ⚠️ **Alpha.** The API may change before `1.0`. The `deep` engine is experimental — see [caveats](#deep-mode-caveats-experimental).

Skeleton loading screens usually mean building — and maintaining — a second copy of your UI. Skelo derives the skeleton from the UI you already wrote.

```tsx
import { Skeleton } from 'react-native-skelo';

<Skeleton loading={isLoading}>
  <View style={styles.card}>
    <Image style={styles.avatar} />
    <Text style={styles.name}>{user.name}</Text>
  </View>
</Skeleton>
```

While `loading`, Skelo reads the tree and its styles and renders a matching skeleton (circle avatar, text bar). When `loading` is `false`, it renders your real content.

## Installation

```bash
npm install react-native-skelo@alpha
```

Peer dependencies:

```bash
npm install react-native-reanimated react-native-linear-gradient
# Optional — only needed for `deep` mode:
npm install react-reconciler
```

## Usage

### Basic — inline host elements

Skelo traverses the `View` / `Text` / `Image` tree you pass and mirrors it:

```tsx
<Skeleton loading={loading} animation="shimmer">
  <View style={styles.row}>
    <Image style={styles.avatar} />          {/* → circle / box */}
    <Text style={styles.title}>Title</Text>  {/* → text bar    */}
  </View>
</Skeleton>
```

Structure comes from the JSX; dimensions come from each element's `style`.

### `deep` — wrap any component (experimental)

Don't want to inline? Wrap an opaque component and let Skelo introspect it:

```tsx
import { Skeleton, withSkeleton } from 'react-native-skelo';

<Skeleton loading={loading} deep>
  <ProfileScreen />
</Skeleton>

// or as an HOC:
const Home = withSkeleton(HomeScreen);
<Home loading={loading} {...props} />
```

Requires `react-reconciler`. See [caveats](#deep-mode-caveats-experimental).

### `styles` — generate from a StyleSheet

Pass styles directly to get a stack of skeleton shapes (no children needed):

```tsx
<Skeleton loading={loading} styles={styles} excludeStyles={['container']} />
```

A StyleSheet has no hierarchy, so this produces one shape per style that has visual dimensions.

### `Skeleton.Ignore` — keep something visible

```tsx
<Skeleton loading={loading}>
  <Skeleton.Ignore>
    <Text style={styles.heading}>Profile</Text>  {/* stays real */}
  </Skeleton.Ignore>
  <ProfileBody />
</Skeleton>
```

### Custom components — register a plugin

```tsx
import { Skelo } from 'react-native-skelo';
import { Avatar } from 'my-design-system';

Skelo.register({
  name: 'Avatar',
  component: Avatar,
  strategy: (props, { primitives }) => (
    <primitives.Circle size={props.size ?? 40} />
  ),
});
```

## API

### `<Skeleton>` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | — | Show skeleton (`true`) or real content (`false`) |
| `animation` | `'shimmer' \| 'pulse' \| 'none'` | `'shimmer'` | Animation style |
| `duration` | `number` | `1200` | Animation duration (ms) |
| `baseColor` / `highlightColor` | `string` | theme | Skeleton colors |
| `borderRadius` | `number` | `4` | Default corner radius |
| `deep` | `boolean` | `false` | Expand opaque components (experimental) |
| `styles` | `StyleSheet \| style[]` | — | Generate from styles instead of children |
| `excludeStyles` | `string[]` | — | Style keys to skip in `styles` mode |
| `accessibilityLabel` | `string` | `'Loading content'` | Screen-reader label |

Also exported: `withSkeleton`, `SkeletonIgnore`, `StyleSkeleton`, the primitives (`SkeletonBox`, `SkeletonText`, `SkeletonImage`, `SkeletonCircle`), and `Skelo` (plugin registry + `Skelo.fromStyles`).

## How it works

- **Inline mode** — static traversal of the host-element tree (`React.Children` + `StyleSheet.flatten`).
- **`deep` mode** — a JS-only `react-reconciler` renderer renders the component off-screen to recover its real host tree + styles, then feeds the same skeleton renderer.
- Anything Skelo can't introspect (a custom component without `deep`, or native content) is measured and shown as a single size-matched block.

## `deep` mode caveats (experimental)

`deep` renders your component offline to read its structure, which means:

- **Mount effects run** during introspection — a screen that fetches on mount may fetch twice. Prefer `deep` for presentational trees; register a plugin or provide a manual skeleton for effectful screens.
- **Renders outside your providers** — components that require navigation/theme/redux context may fail to expand; Skelo catches this and falls back to a measured block.
- Only the **React host tree** is visible. `WebView`, `MapView`, `Video`, etc. render their content natively (outside React), so they can only become a single sized block.

## Requirements

- React Native (Fabric / New Architecture recommended)
- `react-native-reanimated` ≥ 3
- `react-reconciler` (optional, for `deep`) — must match your React version

## License

MIT © [Shubhanshu Barnwal](https://shubhanshubb.dev)
