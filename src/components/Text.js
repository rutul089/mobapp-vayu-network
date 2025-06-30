/* eslint-disable no-shadow */
// @ts-nocheck

import React from 'react';
import { Text as IText, StyleSheet } from 'react-native';
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
  const isValidJSX = React.isValidElement(children);
  const computedFontSize = computeFontSize(size);
  const computedFontFamily = computeFontFamily(fontFamily);
  const computedFontWeight = computeFontWeight(weight);
  const computedLineHeight = computeFontLineHeight(lineHeight);

  const getTextComputedStyles = type => {
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

  const getAdditionalComputedStyles = (size, weight, color, fontFamily) => {
    const additionalStyles = {};
    if (size) additionalStyles.fontSize = size;
    if (weight) additionalStyles.fontWeight = weight;
    if (color) additionalStyles.color = color;
    if (fontFamily) additionalStyles.fontFamily = fontFamily;
    return additionalStyles;
  };

  const computedStyles = getTextComputedStyles(type);

  const defaultTextStyle = {
    fontFamily:
      computedFontFamily ?? theme.typography.fonts.apfelGrotezkRegular,
    fontSize: computedFontSize ?? theme.typography.fontSizes.body,
    color: color ?? theme.colors.textPrimary,
    fontWeight: computedFontWeight,
    lineHeight: computedLineHeight,
    textAlign,
    margin: margin ?? 0,
  };

  const additionalComputedStyles = getAdditionalComputedStyles(
    computedFontSize,
    computedFontWeight,
    color,
    computedFontFamily,
  );

  const fontVariants = {
    ...(apfelGrotezkBrukt && theme.typography.fontStyles.apfelGrotezkBrukt),
    ...(apfelGrotezkFett && theme.typography.fontStyles.apfelGrotezkFett),
    ...(apfelGrotezkMittel && theme.typography.fontStyles.apfelGrotezkMittel),
    ...(apfelGrotezkRegular && theme.typography.fontStyles.apfelGrotezkRegular),
    ...(apfelGrotezkSatt && theme.typography.fontStyles.apfelGrotezkSatt),
  };

  return (
    <>
      {children && isValidJSX ? (
        children
      ) : children !== undefined &&
        children !== null &&
        (typeof children === 'string'
          ? children.trim() !== ''
          : children !== '') ? (
        <IText
          {...rest}
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
          adjustsFontSizeToFit={adjustsFontSizeToFit}
          style={[
            defaultTextStyle,
            computedStyles,
            additionalComputedStyles,
            fontVariants,
            style,
          ]}
        >
          {children}
        </IText>
      ) : null}
    </>
  );
};

export default Text;
