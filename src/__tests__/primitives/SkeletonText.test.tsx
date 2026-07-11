import React from 'react';
import { render } from '@testing-library/react-native';
import { SkeletonText } from '../../components/primitives/SkeletonText';

describe('SkeletonText', () => {
  it('should render single line by default', () => {
    const { toJSON } = render(<SkeletonText />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render multiple lines', () => {
    const { toJSON } = render(<SkeletonText lines={3} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom font size', () => {
    const { toJSON } = render(<SkeletonText fontSize={16} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom line height', () => {
    const { toJSON } = render(
      <SkeletonText fontSize={16} lineHeight={24} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom width', () => {
    const { toJSON } = render(
      <SkeletonText width="80%" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom last line width', () => {
    const { toJSON } = render(
      <SkeletonText lines={3} lastLineWidth="70%" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should accept animation prop', () => {
    const { toJSON } = render(
      <SkeletonText animation="pulse" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('should accept custom colors', () => {
    const { toJSON } = render(
      <SkeletonText
        baseColor="#f0f0f0"
        highlightColor="#ffffff"
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
