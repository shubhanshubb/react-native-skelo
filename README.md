# Skelo

**Write your UI once. Skelo builds the loading state automatically.**

> ⚠️ **Status:** Under active development. Not ready for production use.

## Vision

Eliminate duplicate skeleton screens in React Native apps by automatically generating loading states from existing components.

```tsx
// Instead of writing two screens...
<Skeleton loading={loading}>
  <ProfileScreen />
</Skeleton>
// That's it!
```

## Development Status

- [x] Repository setup
- [x] Type definitions
- [x] Skeleton primitives
- [ ] Parser & style resolver
- [ ] Animation engine
- [ ] Plugin registry
- [ ] Main Skeleton component
- [ ] Tests
- [ ] Example app
- [ ] Documentation

## Project Structure

```
react-native-skelo/
├── src/
│   ├── types/           # TypeScript definitions
│   ├── components/
│   │   └── primitives/  # SkeletonBox, SkeletonText, etc.
│   ├── core/            # Parser, resolver, generator
│   ├── animations/      # Shimmer, pulse animations
│   ├── hooks/           # React hooks
│   ├── plugins/         # Built-in plugins
│   ├── utils/           # Utility functions
│   └── constants/       # Default values
```

## License

MIT © [Shubhanshu](https://github.com/shubhanshubb)
