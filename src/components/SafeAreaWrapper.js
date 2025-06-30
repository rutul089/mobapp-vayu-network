// @ts-check

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../theme';

/**
 * A wrapper component that handles safe area insets, status bar styling,
 * and optional bottom padding for devices with notches or rounded corners.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to render inside the safe area wrapper.
 * @param {string} [props.statusBarColor=theme.colors.primaryBlack] - The background color for the status bar area.
 * @param {string} [props.backgroundColor=theme.colors.background] - The background color for the bottom safe area.
 * @param {'default' | 'light-content' | 'dark-content'} [props.barStyle='light-content'] - The style for the status bar content.
 * @param {boolean} [props.hideBottom=false] - If true, hides the bottom safe area padding.
 * @returns {JSX.Element} The rendered SafeAreaWrapper component.
 */
const SafeAreaWrapper = ({
  children,
  statusBarColor = theme.colors.white,
  backgroundColor = theme.colors.background2,
  barStyle = 'dark-content',
  hideBottom = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* StatusBar customization */}
      <StatusBar
        translucent
        backgroundColor={statusBarColor}
        barStyle={barStyle}
      />

      {/* Top Safe Area */}
      <View style={{ height: insets.top, backgroundColor: statusBarColor }} />

      {/* Main content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom Safe Area */}
      {!hideBottom && (
        <View style={{ height: insets.bottom, backgroundColor }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
