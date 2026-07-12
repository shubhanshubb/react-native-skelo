import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton, Skelo } from 'react-native-skelo';

/**
 * Example app demonstrating react-native-skelo.
 *
 * This uses `deep` mode: <ProfileScreen /> is an ordinary opaque component, yet
 * Skelo expands it into its real host-element tree at load time and generates a
 * structured skeleton automatically — you write your UI once and get the
 * loading state for free.
 */

const LIST_ITEMS = [
  {
    id: 1,
    title: 'First Item',
    description: 'This is the first item in the list',
    image: 'https://picsum.photos/100/100?random=1',
  },
  {
    id: 2,
    title: 'Second Item',
    description: 'This is the second item in the list',
    image: 'https://picsum.photos/100/100?random=2',
  },
  {
    id: 3,
    title: 'Third Item',
    description: 'This is the third item in the list',
    image: 'https://picsum.photos/100/100?random=3',
  },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState<'shimmer' | 'pulse' | 'none'>('shimmer');

  // Simulate data loading
  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  const reloadData = () => setLoading(true);

  const toggleAnimation = () => {
    setAnimation(prev => (prev === 'shimmer' ? 'pulse' : prev === 'pulse' ? 'none' : 'shimmer'));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Skelo Example</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.button} onPress={toggleAnimation}>
              <Text style={styles.buttonText}>Animation: {animation}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={reloadData}>
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Reload'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Deep mode: wrap an opaque screen component and Skelo expands it into
            a structured skeleton automatically — no inlining, no escape hatches.
            This is the "write your UI once" DX. */}
          <Skeleton loading={loading} animation={animation} deep>
            <ProfileScreen />
          </Skeleton>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Built with react-native-skelo v{Skelo.version}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/**
 * A normal, opaque screen component. Skelo introspects it in `deep` mode —
 * nothing here is aware of skeletons.
 */
function ProfileScreen() {
  return (
    <>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/300?img=1' }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
            <Text style={styles.profileBio}>
              Software engineer passionate about React Native and open source. Building great mobile
              experiences.
            </Text>
          </View>
        </View>
      </View>

      {/* List Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>List Items</Text>
        {LIST_ITEMS.map(item => (
          <View key={item.id} style={styles.listItem}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{item.title}</Text>
              <Text style={styles.listItemDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Cards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cards</Text>
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://picsum.photos/400/200?random=4' }}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Card Title</Text>
            <Text style={styles.cardDescription}>
              This is a card with an image and some text content. Perfect for showcasing articles,
              products, or media.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Another Card</Text>
            <Text style={styles.cardDescription}>
              Cards can have different layouts and content. This one has no image.
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: '#5FC9F8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  profileCard: {
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
