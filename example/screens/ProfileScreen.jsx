import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DemoScreen } from './DemoScreen';

export default function ProfileScreen() {
  return (
    <DemoScreen>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300?img=1' }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john.doe@example.com</Text>
            <Text style={styles.bio}>
              Software engineer passionate about React Native and open source.
              Building great mobile experiences.
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {['Posts', 'Followers', 'Following'].map(label => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>About</Text>
        <Text style={styles.paragraph}>
          Ten years building mobile apps across fintech, health, and education.
          Currently focused on developer tooling and open-source libraries.
        </Text>
      </View>
    </DemoScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  profileCard: { flexDirection: 'row' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  info: { flex: 1, marginLeft: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 14, color: '#666', marginBottom: 8 },
  bio: { fontSize: 14, lineHeight: 20, color: '#333' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 13, color: '#666', marginTop: 2 },
  heading: { fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  paragraph: { fontSize: 14, lineHeight: 22, color: '#333' },
});
