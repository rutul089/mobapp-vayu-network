/* eslint-disable no-shadow */
// @ts-nocheck

import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { theme } from '../theme';
import {
  computeFontFamily,
  computeFontLineHeight,
  computeFontSize,
  computeFontWeight,
} from './helper';
import { styles } from './styles/Text.style';

/**
 * @typedef {Object} TextProps
 * @property {string} [color]
 * @property {number} [size]
 * @property {string} [weight]
 * @property {string} [fontFamily]
 * @property {React.ReactNode} children
 * @property {string} [type] - Predefined text style type
 * @property {import('react-native').TextStyle} [style]
 * @property {number} [lineHeight]
 * @property {"auto" | "left" | "right" | "center" | "justify"} [textAlign]
 * @property {number} [margin]
 * @property {number} [numberOfLines]
 * @property {import('react-native').EllipsizeMode} [ellipsizeMode]
 * @property {boolean} [adjustsFontSizeToFit]
 * @property {boolean} [apfelGrotezkBrukt]
 * @property {boolean} [apfelGrotezkFett]
 * @property {boolean} [apfelGrotezkMittel]
 * @property {boolean} [apfelGrotezkRegular]
 * @property {boolean} [apfelGrotezkSatt]
 */

/**
 * Custom Text component for styled typography
 *
 * @param {TextProps} props
 * @returns {JSX.Element | null}
 */
const Text = ({
  color,
  size,
  weight,
  fontFamily,
  children,
  type,
  style,
  lineHeight,
  textAlign,
  margin,
  numberOfLines,
  ellipsizeMode,
  adjustsFontSizeToFit,
  apfelGrotezkBrukt,
  apfelGrotezkFett,
  apfelGrotezkMittel,
  apfelGrotezkRegular,
  apfelGrotezkSatt,
  ...rest
}) => {
  if (
    children === undefined ||
    children === null ||
    (typeof children === 'string' && children.trim() === '')
  ) {
    return null;
  }

  const computedFontSize = computeFontSize(size);
  const computedFontFamily = computeFontFamily(fontFamily);
  const computedFontWeight = computeFontWeight(weight);
  const computedLineHeight = computeFontLineHeight(lineHeight);

  const getTextTypeStyle = type => {
    switch (type) {
      case 'helper-text':
        return styles.helperText;
      case 'body-text':
        return styles.bodyText;
      case 'large-header':
        return styles.largeHeader;
      case 'label':
        return styles.label;
      case 'input':
        return styles.input;
      case 'status':
        return styles.status;
      case 'caption':
        return styles.captionText;
      default:
        return {};
    }
  };

  const dynamicStyles = {
    fontSize: computedFontSize ?? theme.typography.fontSizes.body,
    fontFamily:
      computedFontFamily ?? theme.typography.fonts.apfelGrotezkRegular,
    fontWeight: computedFontWeight,
    color: color ?? theme.colors.textPrimary,
    lineHeight: computedLineHeight ?? theme.typography.lineHeights.body,
    textAlign,
    margin: margin ?? 0,
  };

  const fontVariants = {
    ...(apfelGrotezkBrukt && theme.typography.fontStyles.apfelGrotezkBrukt),
    ...(apfelGrotezkFett && theme.typography.fontStyles.apfelGrotezkFett),
    ...(apfelGrotezkMittel && theme.typography.fontStyles.apfelGrotezkMittel),
    ...(apfelGrotezkRegular && theme.typography.fontStyles.apfelGrotezkRegular),
    ...(apfelGrotezkSatt && theme.typography.fontStyles.apfelGrotezkSatt),
  };

  return (
    <RNText
      {...rest}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      style={[dynamicStyles, getTextTypeStyle(type), fontVariants, style]}
    >
      {children}
    </RNText>
  );
};

export default Text;
