import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import theme from '../../theme';
import images from '../../assets/images';
import { Button } from '../../components';

const Auth_Component = ({ onGooglePress, onApplePress }) => {
  return (
    <View style={styles.wrapper}>
      <ImageBackground style={styles.imageBg} source={images.splash_backdrop}>
        <ImageBackground
          source={images.gradient_fade}
          blurRadius={5}
          style={styles.gradientOverlay}
        >
          <View style={styles.buttonGroup}>
            <Button
              iconName={images.google_icon}
              label="Continue with Google"
              onPress={onGooglePress}
            />
            <Button
              iconName={images.apple_icon}
              label="Continue with Apple"
              onPress={onApplePress}
            />
          </View>
        </ImageBackground>
      </ImageBackground>

      <View style={styles.brandmarkContainer}>
        <Image
          source={images.vayu_brandmark}
          style={styles.brandmarkImage}
          accessibilityLabel="Vayu Logo"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  imageBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  buttonGroup: {
    flex: 0.6,
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: theme.sizes.padding,
  },
  brandmarkContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandmarkImage: {
    height: 55,
    width: 154,
    resizeMode: 'contain',
  },
});

export default Auth_Component;
