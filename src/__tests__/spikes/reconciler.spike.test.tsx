import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { renderToHostTree } from '../../core/parser/hostTreeReconciler';

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

describe('SPIKE: react-reconciler host tree (no deprecated deps)', () => {
  it('renders an opaque component to a host tree with types + styles', () => {
    const tree = renderToHostTree(<ProfileCard />);

    expect(tree).not.toBeNull();
    expect(tree!.length).toBe(1);
    const root = tree![0];

    const collectTypes: string[] = [];
    const styles: unknown[] = [];
    const walk = (n: any) => {
      collectTypes.push(n.type);
      if (n.props?.style) styles.push(n.props.style);
      n.children.forEach(walk);
    };
    walk(root);

    console.log('TYPES:', collectTypes.join(', '));

    console.log('ROOT STYLE:', JSON.stringify(root.props.style));

    expect(collectTypes).toEqual(expect.arrayContaining(['View', 'Image', 'Text']));
    expect(root.props.style).toBeTruthy();
  });
});
