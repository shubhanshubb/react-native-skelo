import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DemoScreen } from './DemoScreen';

const CARDS = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  title: `Card Title ${i + 1}`,
  body: 'A card with an image and some text content, perfect for articles, products, or media.',
  image: `https://picsum.photos/400/200?random=${i + 40}`,
}));

export default function CardsScreen() {
  return (
    <DemoScreen>
      <View style={styles.container}>
        {CARDS.map(card => (
          <View key={card.id} style={styles.card}>
            <Image source={{ uri: card.image }} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.body}>{card.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </DemoScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: { width: '100%', height: 180 },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 20, color: '#666' },
});
