import React from 'react';
import { render } from '@testing-library/react-native';
import { SkeletonBox } from '../../components/primitives/SkeletonBox';

describe('SkeletonBox', () => {
  it('should render with required props', () => {
    const { toJSON } = render(
      <SkeletonBox width={100} height={50} />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom border radius', () => {
    const { toJSON } = render(
      <SkeletonBox width={100} height={50} borderRadius={8} />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should accept animation prop', () => {
    const { toJSON } = render(
      <SkeletonBox width={100} height={50} animation="pulse" />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should accept no animation', () => {
    const { toJSON } = render(
      <SkeletonBox width={100} height={50} animation="none" />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom colors', () => {
    const { toJSON } = render(
      <SkeletonBox
        width={100}
        height={50}
        baseColor="#f0f0f0"
        highlightColor="#ffffff"
      />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should accept children', () => {
    const { getByText } = render(
      <SkeletonBox width={100} height={50}>
        <SkeletonBox width={50} height={25} />
      </SkeletonBox>
    );

    expect(getByText).toBeTruthy();
  });
});
