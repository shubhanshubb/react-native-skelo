import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { render } from '@testing-library/react-native';
import { Skeleton } from '../../components/Skeleton';
import { expandListPlaceholders } from '../../core/parser/expandLists';

function Row() {
  return (
    <View>
      <Text>Title</Text>
      <Text>Subtitle</Text>
    </View>
  );
}

describe('FlatList skeleton', () => {
  it('expands a FlatList into `count` placeholder rows', () => {
    const list = <FlatList data={[]} renderItem={() => <Row />} />;
    const expanded = expandListPlaceholders(list, 6);
    // Render the expanded output and confirm rows were produced.
    const { getAllByText } = render(<>{expanded}</>);
    expect(getAllByText('Title')).toHaveLength(6);
  });

  it('renders a non-empty skeleton when wrapping a FlatList while loading', () => {
    const { toJSON } = render(
      <Skeleton loading count={4}>
        <FlatList data={[]} renderItem={() => <Row />} />
      </Skeleton>
    );
    const json = JSON.stringify(toJSON());
    // The skeleton tree should have real content (not an empty container).
    expect(json.length).toBeGreaterThan(200);
  });

  it('renders real children (no placeholders) when not loading', () => {
    const realData = [{ id: 1 }, { id: 2 }];
    const { getAllByText } = render(
      <Skeleton loading={false}>
        <FlatList data={realData} renderItem={() => <Row />} />
      </Skeleton>
    );
    expect(getAllByText('Title')).toHaveLength(2);
  });
});
