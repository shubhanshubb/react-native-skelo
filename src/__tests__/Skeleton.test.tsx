import React from 'react';
import { View, Text, Image } from 'react-native';
import { render } from '@testing-library/react-native';
import { Skeleton } from '../components/Skeleton';

describe('Skeleton', () => {
  it('should render children when not loading', () => {
    const { getByText } = render(
      <Skeleton loading={false}>
        <Text>Hello World</Text>
      </Skeleton>
    );

    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should render skeleton when loading', () => {
    const { queryByText, getByLabelText } = render(
      <Skeleton loading={true}>
        <Text>Hello World</Text>
      </Skeleton>
    );

    // Original content should not be rendered
    expect(queryByText('Hello World')).toBeNull();

    // Skeleton should be rendered with accessibility
    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should accept custom accessibility label', () => {
    const { getByLabelText } = render(
      <Skeleton loading={true} accessibilityLabel="Loading profile">
        <Text>Profile</Text>
      </Skeleton>
    );

    expect(getByLabelText('Loading profile')).toBeTruthy();
  });

  it('should accept animation prop', () => {
    const { getByLabelText } = render(
      <Skeleton loading={true} animation="pulse">
        <Text>Content</Text>
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should accept custom colors', () => {
    const { getByLabelText } = render(
      <Skeleton
        loading={true}
        baseColor="#f0f0f0"
        highlightColor="#ffffff"
      >
        <Text>Content</Text>
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should handle complex component trees', () => {
    const { getByLabelText } = render(
      <Skeleton loading={true}>
        <View>
          <Text>Title</Text>
          <Text>Subtitle</Text>
          <Image source={{ uri: 'https://example.com/avatar.jpg' }} />
        </View>
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should toggle between loading and content', () => {
    const { getByText, queryByText, getByLabelText, rerender } = render(
      <Skeleton loading={true}>
        <Text>Content</Text>
      </Skeleton>
    );

    // Initially loading
    expect(queryByText('Content')).toBeNull();
    expect(getByLabelText('Loading content')).toBeTruthy();

    // Switch to loaded
    rerender(
      <Skeleton loading={false}>
        <Text>Content</Text>
      </Skeleton>
    );

    expect(getByText('Content')).toBeTruthy();
  });
});
