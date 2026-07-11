import React from 'react';
import { render } from '@testing-library/react-native';
import { SkeletonCircle } from '../../components/primitives/SkeletonCircle';

describe('SkeletonCircle', () => {
  it('should render with default size', () => {
    const { toJSON } = render(<SkeletonCircle />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom size', () => {
    const { toJSON } = render(<SkeletonCircle size={60} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should accept animation prop', () => {
    const { toJSON } = render(<SkeletonCircle animation="pulse" />);
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom colors', () => {
    const { toJSON } = render(<SkeletonCircle baseColor="#f0f0f0" highlightColor="#ffffff" />);
    expect(toJSON()).toBeTruthy();
  });
});
