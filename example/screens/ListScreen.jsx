import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { DemoScreen } from './DemoScreen';

const DATA = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i),
  title: `List Item ${i + 1}`,
  description: 'A short description for this list row goes here.',
  image: `https://picsum.photos/100/100?random=${i + 1}`,
}));

export default function ListScreen() {
  return (
    <DemoScreen>
      <FlatList
        scrollEnabled={false}
        data={DATA}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.thumb} />
            <View style={styles.rowContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </DemoScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  rowContent: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  description: { fontSize: 14, color: '#666' },
});
