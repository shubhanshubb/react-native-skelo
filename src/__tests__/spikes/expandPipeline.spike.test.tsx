import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { expandToComponentNodes } from '../../core/parser/expandOffline';
import { SkeletonRenderer } from '../../components/SkeletonRenderer';

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 20 },
  bio: { fontSize: 14 },
});

function Avatar() {
  return <Image source={{ uri: 'x' }} style={styles.avatar} />;
}
function ProfileCard() {
  return (
    <View style={styles.card}>
      <Avatar />
      <View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>Engineer</Text>
      </View>
    </View>
  );
}

describe('SPIKE: opaque component -> structured skeleton pipeline', () => {
  it('expands an opaque component into a host ComponentNode tree', () => {
    const nodes = expandToComponentNodes(<ProfileCard />);
    expect(nodes).not.toBeNull();
    expect(nodes!.length).toBe(1);

    const root = nodes![0];
    expect(root.type).toBe('View');
    expect(root.style.flexDirection).toBe('row');
    // Image child with circle dimensions recovered:
    const image = root.children[0];
    expect(image.type).toBe('Image');
    expect(image.style.width).toBe(80);
    expect(image.style.borderRadius).toBe(40);
    // Nested text nodes recovered with font sizes + text content:
    const textContainer = root.children[1];
    expect(textContainer.children.map(c => c.type)).toEqual(['Text', 'Text']);
    expect(textContainer.children[0].props.children).toBe('John Doe');
    expect(textContainer.children[0].style.fontSize).toBe(20);
  });

  it('renders a skeleton from the expanded tree without crashing', () => {
    const nodes = expandToComponentNodes(<ProfileCard />)!;
    const result = render(
      <SkeletonRenderer
        tree={nodes}
        config={{ animation: 'none', baseColor: '#eee', borderRadius: 4 }}
      />
    );
    expect(result.toJSON()).toBeTruthy();
  });
});
