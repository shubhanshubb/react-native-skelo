import React from 'react';
import { View, Text } from 'react-native';
import { Parser } from '../../core/parser/Parser';

describe('Parser', () => {
  it('should parse simple View component', () => {
    const element = React.createElement(View, { style: { width: 100, height: 50 } });
    const result = Parser.parse(element);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('View');
    expect(result[0].style.width).toBe(100);
    expect(result[0].style.height).toBe(50);
  });

  it('should parse Text component', () => {
    const element = React.createElement(Text, {}, 'Hello');
    const result = Parser.parse(element);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('Text');
    expect(result[0].props.children).toBe('Hello');
  });

  it('should parse nested components', () => {
    const element = React.createElement(
      View,
      {},
      React.createElement(Text, {}, 'Child')
    );
    const result = Parser.parse(element);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('View');
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].type).toBe('Text');
  });

  it('should handle multiple children', () => {
    const element = React.createElement(
      View,
      {},
      React.createElement(Text, {}, 'First'),
      React.createElement(Text, {}, 'Second')
    );
    const result = Parser.parse(element);

    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(2);
  });

  it('should flatten fragments', () => {
    const element = React.createElement(
      React.Fragment,
      {},
      React.createElement(Text, {}, 'First'),
      React.createElement(Text, {}, 'Second')
    );
    const result = Parser.parse(element);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('Text');
    expect(result[1].type).toBe('Text');
  });

  it('should estimate text lines', () => {
    const shortText = 'Hello';
    const longText = 'This is a very long text that should span multiple lines when rendered';

    const shortLines = Parser.estimateTextLines(shortText, {});
    const longLines = Parser.estimateTextLines(longText, {});

    expect(shortLines).toBe(1);
    expect(longLines).toBeGreaterThan(1);
    expect(longLines).toBeLessThanOrEqual(5); // Should cap at 5
  });
});
