# React Native Skelo Example

This is a complete example app demonstrating the features of `react-native-skelo`.

## Features Demonstrated

- **Profile Skeleton**: Avatar + text content
- **List Skeletons**: Multiple items with thumbnails
- **Card Skeletons**: Image + text cards
- **Animation Modes**: Toggle between shimmer, pulse, and none
- **Live Reloading**: Reload data to see skeleton transitions

## Running the Example

### Prerequisites

- **Node.js**: >= 18
- **React Native CLI**: `npm install -g react-native-cli`
- **iOS**: Xcode 15+ (macOS only)
- **Android**: Android Studio with SDK 34+

### Quick Start

1. **Install Dependencies**

```bash
cd example
npm install
```

2. **iOS Setup** (macOS only)

```bash
# Install CocoaPods dependencies
npm run pod-install

# Or manually
cd ios
bundle install
bundle exec pod install
cd ..
```

3. **Run iOS**

```bash
npm run ios
```

4. **Run Android**

```bash
# Start Metro bundler in one terminal
npm start

# Run Android in another terminal
npm run android
```

### Troubleshooting

**Metro bundler issues:**
```bash
# Clear cache and restart
npm start -- --reset-cache
```

**iOS build issues:**
```bash
# Clean build
cd ios
xcodebuild clean
cd ..
npm run ios
```

**Android build issues:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## Project Structure

```
example/
├── App.tsx              # Main app component
├── android/             # Android native code
├── ios/                 # iOS native code
├── index.js             # Entry point
├── package.json         # Dependencies
├── metro.config.js      # Metro bundler config
├── babel.config.js      # Babel config
└── tsconfig.json        # TypeScript config
```

## Code Examples

### Basic Usage

```tsx
import { Skeleton } from 'react-native-skelo';

function MyComponent() {
  const [loading, setLoading] = useState(true);

  return (
    <Skeleton loading={loading}>
      <YourComponent />
    </Skeleton>
  );
}
```

### Custom Animation

```tsx
<Skeleton loading={loading} animation="pulse" duration={1000}>
  <YourComponent />
</Skeleton>
```

### Custom Colors

```tsx
<Skeleton
  loading={loading}
  baseColor="#f0f0f0"
  highlightColor="#ffffff"
>
  <YourComponent />
</Skeleton>
```

### Toggle Animation

```tsx
const [animation, setAnimation] = useState<'shimmer' | 'pulse' | 'none'>('shimmer');

<Skeleton loading={loading} animation={animation}>
  <YourComponent />
</Skeleton>
```

## Learn More

- [Main Documentation](../README.md)
- [GitHub Repository](https://github.com/shubhanshubb/react-native-skelo)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
