import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Card, Spacing } from './';
import images from '../assets/images';
import theme from '../theme';

const DeviceCard = ({ deviceName, deviceId, onPress }) => {
  return (
    <Card padding={10} onPress={onPress}>
      <View style={styles.container}>
        <Image source={images.vayu_logo} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text apfelGrotezkMittel weight={theme.typography.fontWeights.medium}>
            {deviceName}
          </Text>
          <Spacing size="4" />
          <Text type="caption">{deviceId}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 45,
    width: 45,
  },
  textContainer: {
    marginHorizontal: 10,
  },
});

export default DeviceCard;
