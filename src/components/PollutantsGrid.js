import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PollutantItem } from './'; // adjust path if needed

/**
 * Splits an array into chunks of given size
 */
const chunkArray = (arr, chunkSize) =>
  arr.reduce((result, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }
    result[chunkIndex].push(item);
    return result;
  }, []);

const PollutantsGrid = ({ data = [], columns = 2 }) => {
  return (
    <View style={styles.container}>
      {chunkArray(data, 2).map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, index) => (
            <PollutantItem
              key={index}
              name={item.name}
              value={item.value}
              color={item.color}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default PollutantsGrid;
