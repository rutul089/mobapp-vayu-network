import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../theme';
import Pressable from './Pressable';

const Card = ({
  cardContainerStyle,
  card,
  children,
  padding,
  noShadow = false,
  onPress,
  row,
  style,
}) => {
  let _padding = padding ?? 20;

  const iCardStyle = StyleSheet.flatten([
    styles.card,
    { padding: _padding },
    row && { flexDirection: 'row' },
    noShadow && styles.noShadow,
    cardContainerStyle,
  ]);

  return (
    <Pressable disabled={!onPress} onPress={onPress} style={style}>
      <View style={iCardStyle}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: theme.sizes.borderRadius.card,
    shadowColor: 'rgba(190,190,190,0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1, // opacity already included in rgba, so keep 1
    shadowRadius: 50, // large blur radius
    elevation: 2, // Android: tweak as needed
  },
  noShadow: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
  },
});

export default Card;
