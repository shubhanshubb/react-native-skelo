import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Skeleton } from 'react-native-skelo';

// While loading we render placeholder items (uri: null) so the grid has
// something for Skelo to skeletonize; after the fetch we swap in real images.
const PLACEHOLDERS = Array.from({ length: 12 }).map((_, i) => ({
  id: `p${i}`,
  uri: null,
}));

export default function GridScreen() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://picsum.photos/v2/list?page=3&limit=12');
      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) throw new Error('empty');
      setImages(
        json.map(photo => ({
          id: photo.id,
          // Plain endpoint (loads reliably); the id just varies the image.
          uri: `https://picsum.photos/300/300?random=${photo.id}`,
        }))
      );
    } catch (e) {
      // Fallback so the grid always shows images even if the list API fails.
      setImages(
        Array.from({ length: 12 }).map((_, i) => ({
          id: `f${i}`,
          uri: `https://picsum.photos/300/300?random=${i + 50}`,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const data = loading ? PLACEHOLDERS : images;

  return (
    <View style={styles.screen}>
      <View style={styles.bar}>
        <TouchableOpacity style={styles.button} onPress={load}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading…' : 'Reload'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Skeleton loading={loading}>
          <View style={styles.container}>
            <Text style={styles.heading}>Gallery</Text>
            <View style={styles.grid}>
              {data.map((img, i) => (
                <Image
                  key={img.id ?? i}
                  source={img.uri ? { uri: img.uri } : undefined}
                  style={styles.image}
                />
              ))}
            </View>
          </View>
        </Skeleton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  bar: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: '#5FC9F8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  container: { padding: 16 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: '31.5%',
    height: 110,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
});
