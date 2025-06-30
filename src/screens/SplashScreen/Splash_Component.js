import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import images from '../../assets/images';

const Splash_Component = () => {
  return (
    <View style={styles.wrapper}>
      <ImageBackground style={styles.imageBg} source={images.splash_backdrop} />

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

export default Splash_Component;
