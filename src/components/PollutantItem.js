import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../theme';
import { Text } from './';

const PollutantItem = ({
  name,
  value,
  color,
  containerStyle,
  lineStyle,
  fontSize,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text color={theme.colors.textSecondary} size={fontSize}>
        {name}
      </Text>
      <View style={[styles.line, { backgroundColor: color }, lineStyle]} />
      <Text
        size={fontSize}
        apfelGrotezkMittel
        weight={theme.typography.fontWeights.medium}
      >
        {String(value).padStart(2, '0')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderColor1,
    borderRadius: 10,
    justifyContent: 'space-between',
  },

  line: {
    flex: 1,
    height: 3,
    marginHorizontal: 15,
    borderRadius: 10,
  },
});

export default PollutantItem;
