import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SkeletonProvider } from '../components/SkeletonProvider';
import { Skeleton } from '../components/Skeleton';
import { SkeletonRenderer } from '../components/SkeletonRenderer';
import { StyleSkeleton } from '../core/generator/StyleSkeleton';
import { withSkeleton } from '../components/withSkeleton';
import { DEFAULT_CONFIG } from '../constants/defaults';

jest.mock('../components/SkeletonRenderer', () => ({
  SkeletonRenderer: jest.fn(() => null),
}));
jest.mock('../core/generator/StyleSkeleton', () => ({
  StyleSkeleton: jest.fn(() => null),
}));

const renderer = jest.mocked(SkeletonRenderer);
const styleRenderer = jest.mocked(StyleSkeleton);
const latestConfig = () => renderer.mock.calls[renderer.mock.calls.length - 1][0].config;

beforeEach(() => jest.clearAllMocks());

it('preserves defaults without a provider', () => {
  render(
    <Skeleton loading>
      <Text>Content</Text>
    </Skeleton>
  );
  expect(latestConfig()).toMatchObject({
    animation: DEFAULT_CONFIG.animation,
    baseColor: DEFAULT_CONFIG.baseColor,
    duration: DEFAULT_CONFIG.duration,
  });
});

it('inherits nested themes while allowing explicit component overrides', () => {
  render(
    <SkeletonProvider animation="pulse" baseColor="#111111" duration={1500}>
      <SkeletonProvider highlightColor="#333333" animation={undefined}>
        <Skeleton loading baseColor="#222222" borderRadius={0}>
          <Text>Content</Text>
        </Skeleton>
      </SkeletonProvider>
    </SkeletonProvider>
  );
  expect(latestConfig()).toEqual({
    animation: 'pulse',
    baseColor: '#222222',
    highlightColor: '#333333',
    duration: 1500,
    borderRadius: 0,
  });
});

it('updates consumers when the theme changes', () => {
  const tree = (baseColor: string) => (
    <SkeletonProvider baseColor={baseColor}>
      <Skeleton loading>
        <Text>Content</Text>
      </Skeleton>
    </SkeletonProvider>
  );
  const { rerender } = render(tree('#111111'));
  expect(latestConfig().baseColor).toBe('#111111');
  rerender(tree('#222222'));
  expect(latestConfig().baseColor).toBe('#222222');
});

it('passes theme defaults and HOC overrides to styles-driven skeletons', () => {
  const Wrapped = withSkeleton(() => <Text>Content</Text>, {
    styles: { box: { width: 100, height: 20 } },
    animation: 'none',
  });
  render(
    <SkeletonProvider animation="pulse" baseColor="#111111">
      <Wrapped loading />
    </SkeletonProvider>
  );
  expect(styleRenderer.mock.calls[0][0].config).toMatchObject({
    animation: 'none',
    baseColor: '#111111',
  });
});

it('renders real content normally inside a provider', () => {
  const { getByText } = render(
    <SkeletonProvider animation="none">
      <Skeleton loading={false}>
        <Text>Loaded</Text>
      </Skeleton>
    </SkeletonProvider>
  );
  expect(getByText('Loaded')).toBeTruthy();
  expect(renderer).not.toHaveBeenCalled();
});
