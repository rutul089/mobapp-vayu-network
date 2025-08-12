import { Platform, Alert, Linking } from 'react-native';
import {
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export const requestBluetoothAndLocationPermissions = async () => {
  const permissionsToRequest = Platform.select({
    ios: [
      PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ],
    android: [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ],
  });

  try {
    const statuses = await checkMultiple(permissionsToRequest);

    const deniedPermissions = permissionsToRequest.filter(
      permission => statuses[permission] !== RESULTS.GRANTED,
    );

    if (deniedPermissions.length > 0) {
      const result = await requestMultiple(deniedPermissions);

      const blockedPermissions = Object.entries(result).filter(
        ([_, status]) => status === RESULTS.BLOCKED,
      );

      const stillDenied = Object.entries(result).filter(
        ([_, status]) => status !== RESULTS.GRANTED,
      );

      if (blockedPermissions.length > 0) {
        Alert.alert(
          'Permission Required',
          'Please enable Bluetooth and Location permissions from settings to continue.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
          { cancelable: false },
        );
        return false;
      }

      if (stillDenied.length > 0) {
        console.warn('Some permissions were denied:', stillDenied);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Permission check error:', err);
    return false;
  }
};
