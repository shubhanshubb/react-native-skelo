import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Skeleton } from '../../components/Skeleton';
import { Skelo } from '../../Skelo';

describe('Skeleton Integration Tests', () => {
  beforeEach(() => {
    Skelo.clearPlugins();
  });

  it('should render a complete profile screen skeleton', () => {
    const ProfileScreen = () => (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: 'avatar.jpg' }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john@example.com</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.bio}>
            This is a bio text that spans multiple lines and provides
            information about the user.
          </Text>
        </View>
      </View>
    );

    const { getByLabelText } = render(
      <Skeleton loading={true}>
        <ProfileScreen />
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should handle list-like structures', () => {
    const ListScreen = () => (
      <View>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.listItem}>
            <Image source={{ uri: 'thumbnail.jpg' }} style={styles.thumbnail} />
            <View style={styles.listContent}>
              <Text style={styles.title}>Item {item}</Text>
              <Text style={styles.subtitle}>Description for item {item}</Text>
            </View>
          </View>
        ))}
      </View>
    );

    const { getByLabelText } = render(
      <Skeleton loading={true}>
        <ListScreen />
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should work with custom plugins', () => {
    // Define custom component
    const CustomCard = ({ title, subtitle }: any) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    );

    // Register plugin
    Skelo.register({
      name: 'CustomCard',
      component: CustomCard,
      strategy: (_props, { primitives, config }) => (
        <View style={styles.card}>
          <primitives.Text
            lines={1}
            fontSize={18}
            animation={config.animation}
            baseColor={config.baseColor}
            highlightColor={config.highlightColor}
          />
          <primitives.Text
            lines={1}
            fontSize={14}
            animation={config.animation}
            baseColor={config.baseColor}
            highlightColor={config.highlightColor}
          />
        </View>
      ),
    });

    const { getByLabelText } = render(
      <Skeleton loading={true}>
        <CustomCard title="Title" subtitle="Subtitle" />
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should handle deeply nested component trees', () => {
    const NestedScreen = () => (
      <View>
        <View>
          <View>
            <View>
              <Text>Deeply nested text</Text>
            </View>
          </View>
        </View>
      </View>
    );

    const { getByLabelText } = render(
      <Skeleton loading={true}>
        <NestedScreen />
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });

  it('should respect custom configuration', () => {
    const { getByLabelText } = render(
      <Skeleton
        loading={true}
        animation="pulse"
        duration={2000}
        baseColor="#cccccc"
        highlightColor="#eeeeee"
        borderRadius={8}
      >
        <View>
          <Text>Content</Text>
        </View>
      </Skeleton>
    );

    expect(getByLabelText('Loading content')).toBeTruthy();
  });
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    marginTop: 16,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  listContent: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
