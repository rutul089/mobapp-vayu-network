import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import theme from '../theme';
import { Text } from './';

const Button = ({
  disabled,
  transparent,
  small,
  onPress,
  iconName,
  tintColor,
  label,
  borderRadius = 30,
  variant = 'solid',
  disableColor,
  bColor,
  border_Width,
  themedColor,
  bgColor,
  size = 'large',
  buttonLabelStyle,
  disableLabelColor,
}) => {
  const getBackgroundColorStyles = () => {
    let backgroundColor =
      variant === 'solid'
        ? themedColor ?? theme.colors.black1
        : bgColor ?? 'transpbarent';

    let borderColor = bColor || borderColor || theme.colors.black1;

    let borderWidth = variant === 'link' ? border_Width ?? 1.5 : border_Width;

    if (disabled) {
      backgroundColor =
        variant === 'solid'
          ? disableColor ?? theme.colors.secondary
          : 'transparent';
      borderColor =
        variant === 'solid'
          ? disableColor ?? theme.colors.secondaryLight
          : variant === 'link'
          ? theme.colors.secondary
          : disableColor ?? theme.colors.secondary;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
    };
  };

  const containerStyle = [
    {
      borderRadius,
      //   paddingHorizontal: theme.sizes.padding,
      height: size === 'large' ? 48 : 40,
      ...getBackgroundColorStyles(),
    },
  ];

  const labelStyle = [
    {
      textAlign: 'center',
      color:
        variant === 'solid'
          ? theme.colors.white
          : variant === 'link'
          ? themedColor ?? theme.colors.black1
          : themedColor,
      // flex: 1,
    },
    disabled && {
      color: disableLabelColor ?? theme.colors.textSecondary,
    },
    buttonLabelStyle,
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
      paddingVertical: 5,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconStyle: {
      height: theme.sizes.icons.lg,
      width: theme.sizes.icons.lg,
    },
  });

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[containerStyle, styles.container]}
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
        // color="white"
        weight={theme.typography.fontWeights.medium}
        style={labelStyle}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
