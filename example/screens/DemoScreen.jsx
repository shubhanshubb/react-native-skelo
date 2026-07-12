import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Skeleton } from 'react-native-skelo';

// Shared demo shell: a Reload button + a 3s fake load, with the content wrapped
// in <Skeleton>. Each screen just passes its UI as children.
export function DemoScreen({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading…' : 'Reload'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Skeleton loading={loading}>{children}</Skeleton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
});
