import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import theme from '../theme';
import { Text } from './';

const Button = ({
  disabled,
  transparent,
  backgroundColor = theme.colors.black1,
  borderColor,
  small,
  onPress,
  iconName,
  tintColor,
  label,
  borderRadius = 30,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
      backgroundColor: transparent ? 'transparent' : backgroundColor,
      paddingVertical: 5,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius,
      borderColor: borderColor,
      borderWidth: transparent ? 1 : 0,
      height: 58,
    },
    iconStyle: {
      height: theme.sizes.icons.lg,
      width: theme.sizes.icons.lg,
    },
  });

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {iconName && (
        <Image
          source={iconName}
          style={styles.iconStyle}
          resizeMode="contain"
          tintColor={tintColor}
        />
      )}
      <Text
        apfelGrotezkMittel
        color="white"
        weight={theme.typography.fontWeights.medium}
        // style={{ width: '80%' }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
