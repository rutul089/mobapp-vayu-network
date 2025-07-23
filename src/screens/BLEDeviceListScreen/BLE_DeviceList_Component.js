import React from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import {
  DeviceCard,
  SafeAreaWrapper,
  Spacing,
  Stack,
  Text,
} from '../../components';
import theme from '../../theme';

const BLE_DeviceList_Component = ({ devices, onDeviceSelected, scanning }) => {
  return (
    <SafeAreaWrapper
      backgroundColor={theme.colors.background4}
      statusBarColor={theme.colors.background4}
    >
      <View style={styles.container}>
        <Text
          weight={theme.typography.fontWeights.medium}
          lineHeight="h1"
          size="h1"
          style={styles.locationText}
        >
          Devices
        </Text>
        <Spacing />
        <FlatList
          contentContainerStyle={styles.deviceListWrapper}
          data={devices}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <DeviceCard
              deviceId={item?.id}
              deviceName={item?.localName}
              onPress={() => onDeviceSelected?.(item)}
            />
          )}
          ItemSeparatorComponent={<Spacing />}
        />
        {scanning && (
          <View style={styles.loader}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  locationText: {
    paddingHorizontal: theme.sizes.padding,
  },
  container: {
    backgroundColor: theme.colors.background4,
    flex: 1,
  },
  deviceListWrapper: { flexGrow: 1, padding: theme.sizes.padding },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

export default BLE_DeviceList_Component;
