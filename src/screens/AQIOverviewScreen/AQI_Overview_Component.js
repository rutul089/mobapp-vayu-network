import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import images from '../../assets/images';
import {
  Pressable,
  SafeAreaWrapper,
  Stack,
  Text,
  AQIMeter,
} from '../../components';

import theme from '../../theme';

const AQI_Overview_Component = ({ handleBroadcastIconPress = () => {} }) => {
  return (
    <SafeAreaWrapper>
      <Stack gap={24}>
        <Header onBroadcastPress={handleBroadcastIconPress} />
        <AQIMeter value={150} />
      </Stack>
    </SafeAreaWrapper>
  );
};

const Header = ({ onBroadcastPress }) => (
  <View style={styles.headerWrapper}>
    <Text type="helper-text">Good Morning, Sohil</Text>

    <View style={styles.titleRow}>
      <Text
        weight={theme.typography.fontWeights.medium}
        lineHeight="h1"
        size="h1"
        style={styles.locationText}
      >
        My Office
      </Text>

      <Pressable
        onPress={onBroadcastPress}
        accessibilityLabel="Broadcast Icon Button"
      >
        <Image source={images.icon_broadcasting} style={styles.broadcastIcon} />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerWrapper: {},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  locationText: {
    width: '80%',
  },
  broadcastIcon: {
    height: 44,
    width: 44,
    resizeMode: 'contain',
  },
});

export default AQI_Overview_Component;
