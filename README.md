# React Native Skelo

[![npm version](https://img.shields.io/npm/v/react-native-skelo?style=flat&color=007ec6&label=npm)](https://www.npmjs.com/package/react-native-skelo)
[![downloads](https://img.shields.io/npm/dm/react-native-skelo?style=flat&color=4c1&label=downloads)](https://www.npmjs.com/package/react-native-skelo)
[![license](https://img.shields.io/npm/l/react-native-skelo?style=flat&color=97ca00&label=license)](./LICENSE)

Automatic skeleton loading for React Native, built from the UI you already have. Skelo turns your components and lists into matching loading placeholders, with built-in shimmer and pulse animations. Theme support lets you share colors and animation settings across your app, with nested themes and per-view overrides through `SkeletonProvider`.

<p align="center">
  <img src="./assets/demo.gif" alt="Skelo skeleton demo" width="270" />
</p>

<p align="center">
  <img src="./assets/grid.gif" alt="Image-grid skeleton" width="270" />
</p>

**Stop building and maintaining a second copy of your UI just for loading states.** Wrap your components in `<Skeleton>` and Skelo generates a matching skeleton — sized from the styles you already wrote.

```tsx
<Skeleton loading={isLoading}>
  <ProfileCard user={user} />
</Skeleton>
```

That's the whole API. No skeleton screens to hand-draw, no keeping two layouts in sync.

> **Stable release (`0.1.0`)** — Skelo now follows semantic versioning for its public API.

---

## ✨ Features

- 🪄 **Zero-config** — wrap a component, get a skeleton. No setup, no separate loading screen.
- 🧠 **Sees inside your components** — introspects custom components automatically (no inlining).
- 📋 **Lists included** — `FlatList` / `SectionList` render skeleton rows while data loads.
- 🎨 **Shimmer · Pulse · None** — built-in animations on the native driver.
- 🌗 **Theme support (new in 0.1.0)** — use `SkeletonProvider` for shared colors and animation defaults, with nested themes and per-view overrides.
- 🪶 **No dependencies** — no `reanimated`, no gradient library. Just `react` + `react-native`.
- 📐 **Style-aware** — every skeleton is sized from your real element styles.

---

## 📦 Installation

```bash
npm install react-native-skelo
```

**That's it — no other dependencies.** Everything (including custom-component introspection) works out of the box.

> React 18 apps: add `"react-reconciler": "0.29.x"` to your deps (Skelo ships targeting React 19's `0.31`).

---

## 🚀 Usage

### Just wrap it

```tsx
import { Skeleton } from 'react-native-skelo';

function Screen({ loading, user }) {
  return (
    <Skeleton loading={loading} animation="shimmer">
      <ProfileCard user={user} />
    </Skeleton>
  );
}
```

Skelo renders `ProfileCard`, reads its real `View`/`Text`/`Image` tree + styles, and draws a matching skeleton while `loading` is `true`. When it's `false`, your real UI renders.

### Theme support (new in 0.1.0)

Wrap your app or a group of views in `SkeletonProvider` to share colors and animation settings:

```tsx
import { Skeleton, SkeletonProvider } from 'react-native-skelo';

<SkeletonProvider
  baseColor="#2A3F4F"
  highlightColor="#3A5364"
  animation="pulse"
  duration={1500}
>
  <App />
</SkeletonProvider>
```

Individual `Skeleton` props override the theme. Nested providers inherit settings
from their parent, so a section can override just its colors. Themes also apply to
`withSkeleton` and styles-driven skeletons. The provider accepts `animation`,
`duration`, `baseColor`, `highlightColor`, `borderRadius`, and `debug`; without a
provider, existing defaults are unchanged. Standalone primitives keep their own
explicit props and defaults.

#### Follow light and dark mode

Connect the provider to React Native's `useColorScheme` to update skeleton colors
when the system theme changes:

```tsx
import { useColorScheme } from 'react-native';
import { SkeletonProvider } from 'react-native-skelo';

function ThemedApp() {
  const isDark = useColorScheme() === 'dark';

  return (
    <SkeletonProvider
      baseColor={isDark ? '#2A3F4F' : '#E1E9EE'}
      highlightColor={isDark ? '#3A5364' : '#F0F4F8'}
      animation="shimmer"
    >
      <App />
    </SkeletonProvider>
  );
}
```

#### Override a view's theme

Nest a provider to customize one section, or pass props to a single skeleton:

```tsx
<SkeletonProvider animation="pulse" baseColor="#E1E9EE">
  <Skeleton loading={loading}>
    <ProfileCard user={user} />
  </Skeleton>

  <SkeletonProvider baseColor="#2A3F4F" highlightColor="#3A5364">
    <Skeleton loading={loading} animation="none">
      <StatsCard stats={stats} />
    </Skeleton>
  </SkeletonProvider>
</SkeletonProvider>
```

Here, the profile uses the shared pulse animation. The stats view uses the nested
dark colors and its own static animation.

### Lists

Wrap a `FlatList` — Skelo fills it with skeleton rows while the data loads:

```tsx
<Skeleton loading={loading} count={6}>
  <FlatList data={items} renderItem={renderItem} />
</Skeleton>
```

### Keep something visible

```tsx
<Skeleton loading={loading}>
  <Skeleton.Ignore>
    <Text style={styles.heading}>Profile</Text>   {/* stays real */}
  </Skeleton.Ignore>
  <ProfileBody />
</Skeleton>
```

### Generate from a StyleSheet

```tsx
<Skeleton loading={loading} styles={styles} excludeStyles={['container']} />
```

### Custom skeleton for a component

```tsx
import { Skelo } from 'react-native-skelo';

Skelo.register({
  name: 'Avatar',
  component: Avatar,
  strategy: (props, { primitives }) => <primitives.Circle size={props.size ?? 40} />,
});
```

---

## ⚙️ `<Skeleton>` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `loading` | `boolean` | — | Show skeleton (`true`) or real content (`false`) |
| `animation` | `'shimmer' \| 'pulse' \| 'none'` | `'shimmer'` | Animation style |
| `duration` | `number` | `1200` | Animation duration (ms) |
| `baseColor` / `highlightColor` | `string` | theme | Skeleton colors |
| `borderRadius` | `number` | `4` | Default corner radius |
| `count` | `number` | `6` | Placeholder rows for a `FlatList`/`SectionList` |
| `deep` | `boolean` | auto | Force component introspection on/off (auto when available) |
| `styles` | `StyleSheet \| style[]` | — | Generate from styles instead of children |
| `accessibilityLabel` | `string` | `'Loading content'` | Screen-reader label |

Also exported: `withSkeleton`, `SkeletonIgnore`, `StyleSkeleton`, the primitives (`SkeletonBox`, `SkeletonText`, `SkeletonImage`, `SkeletonCircle`), and `Skelo` (`register` / `fromStyles`).

---

## 🧩 How it works

- **Host elements** (`View` / `Text` / `Image`) are read directly (`React.Children` + `StyleSheet.flatten`).
- **Custom components** are expanded by a tiny JS-only `react-reconciler` renderer (bundled) that renders them off-screen to recover their real host tree + styles — then feeds the same skeleton engine.
- Anything Skelo can't introspect (native content) is measured and shown as one size-matched block.

---

## ⚠️ Good to know

Skelo skeletonizes **what your component renders during loading**:

- Introspection **runs mount effects** — a screen that fetches on mount may fetch twice. Prefer it for presentational trees; register a plugin for effect-heavy screens.
- It renders **outside your providers** — components needing navigation/theme/redux context fall back to a measured block.
- **Native content** (`WebView`, `MapView`, `Video`, …) lives outside React, so it becomes a single sized block.
- A **data-driven list/grid** that renders nothing while loading has nothing to skeletonize — keep placeholder items rendered (see the [example](./example)).

---

## 📋 Requirements

- React Native (New Architecture recommended)
- React 19 (React 18 → override `react-reconciler` to `0.29`)
- No other dependencies

---

## 📄 License

MIT © [Shubhanshu Barnwal](https://shubhanshubb.dev)
