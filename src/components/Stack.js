/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import theme from '../theme';

/**
 * A flexible wrapper component that applies padding and gap between children,
 * similar to a vertical or horizontal Stack.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'row' | 'column'} [props.direction='column']
 * @param {number} [props.gap=0]
 * @param {number} [props.padding=0]
 * @param {'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'} [props.justifyContent]
 * @param {'stretch' | 'flex-start' | 'center' | 'flex-end'} [props.alignItems]
 * @param {Object} [props.style]
 */
const Stack = ({
  children,
  direction = 'column',
  gap = theme.sizes.spacing.lg,
  padding = theme.sizes.padding,
  justifyContent,
  alignItems,
  style,
  backgroundColor = theme.colors.white,
  ...rest
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <View
      style={[
        {
          flexDirection: direction,
          backgroundColor: backgroundColor,
          flex: 1,
          padding,
          justifyContent,
          alignItems,
        },
        style,
      ]}
      {...rest}
    >
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={
            direction === 'row'
              ? { marginRight: index !== childrenArray.length - 1 ? gap : 0 }
              : { marginBottom: index !== childrenArray.length - 1 ? gap : 0 }
          }
        >
          {child}
        </View>
      ))}
    </View>
  );
};

export default Stack;
