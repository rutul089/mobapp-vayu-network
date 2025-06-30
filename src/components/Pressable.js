import React from 'react';
import { TouchableOpacity } from 'react-native';

const Pressable = ({
  children,
  disabled,
  onPress,
  onLongPress,
  activeOpacity = 0.8,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      {...props}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Pressable;
