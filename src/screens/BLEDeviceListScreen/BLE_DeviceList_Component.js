import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {
  DeviceCard,
  Pressable,
  SafeAreaWrapper,
  Spacing,
  Text,
} from '../../components';
import theme from '../../theme';
import images from '../../assets/images';

const BLE_DeviceList_Component = ({
  devices,
  onDeviceSelected,
  scanning,
  restartBLEScan,
}) => {
  return (
    <SafeAreaWrapper
      backgroundColor={theme.colors.background4}
      statusBarColor={theme.colors.background4}
    >
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text
            weight={theme.typography.fontWeights.medium}
            lineHeight="h1"
            size="h1"
            style={styles.locationText}
          >
            Devices
          </Text>
          <Pressable onPress={restartBLEScan}>
            <Image
              source={images.icon_scan}
              resizeMode="contain"
              style={styles.iconStyle}
            />
          </Pressable>
        </View>
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
          ListEmptyComponent={
            scanning ? null : (
              <View style={styles.noDeviceFound}>
                <Text size={'h3'}>No Device Found</Text>
              </View>
            )
          }
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
    // paddingHorizontal: theme.sizes.padding,
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
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.sizes.padding,
    justifyContent: 'space-between',
  },
  noDeviceFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    height: theme.sizes.icons.xl,
    width: theme.sizes.icons.xl,
  },
});

export default BLE_DeviceList_Component;
