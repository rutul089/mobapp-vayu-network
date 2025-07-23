import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import {
  DeviceCard,
  SafeAreaWrapper,
  Spacing,
  Stack,
  Text,
} from '../../components';
import theme from '../../theme';

const BLE_DeviceList_Component = ({ devices, onDeviceSelected }) => {
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
});

export default BLE_DeviceList_Component;
