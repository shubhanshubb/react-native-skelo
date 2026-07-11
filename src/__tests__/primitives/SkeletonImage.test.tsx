import React from 'react';
import { render } from '@testing-library/react-native';
import { SkeletonImage } from '../../components/primitives/SkeletonImage';

describe('SkeletonImage', () => {
  it('should render with default dimensions', () => {
    const { toJSON } = render(<SkeletonImage />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with custom dimensions', () => {
    const { toJSON } = render(
      <SkeletonImage width={200} height={150} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should accept border radius', () => {
    const { toJSON } = render(
      <SkeletonImage width={100} height={100} borderRadius={50} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should accept animation prop', () => {
    const { toJSON } = render(
      <SkeletonImage animation="pulse" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom colors', () => {
    const { toJSON } = render(
      <SkeletonImage
        baseColor="#f0f0f0"
        highlightColor="#ffffff"
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
