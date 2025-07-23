import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { decode as atob } from 'base-64';

class BLESingleton {
  static instance = null;

  static getInstance() {
    if (!BLESingleton.instance) {
      BLESingleton.instance = new BLESingleton();
    }
    return BLESingleton.instance;
  }

  constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.characteristics = {};
    this.disconnectSubscription = null;
    this.lastConnectedDeviceId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = {}; // { temperature: { subscription, callback }, ... }
    this.onReconnectStatusChange = null;
    this.onDisconnectCallback = null;
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  }

  async scanForDevicesWithPrefix(prefix = 'Vayu_AQ', timeout = 5000) {
    await this.requestPermissions();

    return new Promise((resolve, reject) => {
      const filteredDevices = [];

      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          reject(error);
          return;
        }

        if (device?.name?.startsWith(prefix)) {
          if (!filteredDevices.find(d => d.id === device.id)) {
            filteredDevices.push(device);
          }
        }
      });

      setTimeout(() => {
        this.manager.stopDeviceScan();
        resolve(filteredDevices);
      }, timeout);
    });
  }

  async connectToDevice(device) {
    try {
      this.device = await this.manager.connectToDevice(device.id, {
        autoConnect: true,
      });
      this.lastConnectedDeviceId = device.id;

      await this.device.discoverAllServicesAndCharacteristics();

      const services = await this.device.services();
      for (const service of services) {
        const chars = await service.characteristics();
        for (const c of chars) {
          this.characteristics[c.uuid.toLowerCase()] = c;
        }
      }

      console.log('Connected to:', this.device.name);
      this.setupDisconnectListener();
    } catch (error) {
      console.log('Connection error:', error.message);
      Alert.alert('Connection Failed', error.message);
      throw error;
    }
  }

  setupDisconnectListener() {
    if (this.disconnectSubscription) {
      this.disconnectSubscription.remove();
    }

    this.disconnectSubscription = this.device.onDisconnected(
      async (error, device) => {
        console.log('Device disconnected:', device.id);
        Alert.alert('Device Disconnected', 'Attempting to reconnect...');
        this.reconnectAttempts = 0;
        this.autoReconnect(device.id);
      },
    );
  }

  async autoReconnect(deviceId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      Alert.alert(
        'Reconnect Failed',
        'Unable to reconnect after multiple attempts.',
      );
      return;
    }

    try {
      this.reconnectAttempts++;
      console.log(`Reconnect attempt ${this.reconnectAttempts}`);
      const device = await this.manager.connectToDevice(deviceId, {
        autoConnect: true,
      });
      this.device = device;
      await this.device.discoverAllServicesAndCharacteristics();

      const services = await this.device.services();
      for (const service of services) {
        const chars = await service.characteristics();
        for (const c of chars) {
          this.characteristics[c.uuid.toLowerCase()] = c;
        }
      }

      console.log('Reconnected to:', device.name);
      Alert.alert('Reconnected', `Successfully reconnected to ${device.name}`);
      this.setupDisconnectListener();
      this.reconnectAttempts = 0;

      // ✅ Auto-resubscribe to all previous listeners
      this.resubscribeAll();
    } catch (err) {
      console.log('Reconnect failed:', err.message);
      setTimeout(() => this.autoReconnect(deviceId), 3000);
    }
  }

  resubscribeAll() {
    const keys = Object.keys(this.listeners);
    if (!keys.length) return;

    console.log('Resubscribing to:', keys.join(', '));

    keys.forEach(characteristicName => {
      const { callback } = this.listeners[characteristicName];
      if (callback) {
        this.listenTo(characteristicName, callback);
      }
    });
  }

  getUuidMap() {
    return {
      temperature: '2a6e',
      humidity: '2a6f',
      pressure: '2a6d',
      gas: '2a6b',
      pm1: '2a7a',
      pm25: '2a7b',
      pm10: '2a7c',
      eco2: '2a7d',
      tvoc: '2a7e',
    };
  }

  listenTo(characteristicName, callback) {
    const uuidMap = this.getUuidMap();
    const shortUuid = uuidMap[characteristicName];

    if (!shortUuid) {
      console.warn('Unknown characteristic:', characteristicName);
      return;
    }

    const matchedUUID = Object.keys(this.characteristics).find(uuid =>
      uuid.includes(shortUuid),
    );

    if (!matchedUUID) {
      console.warn('Characteristic not found for:', characteristicName);
      return;
    }

    const characteristic = this.characteristics[matchedUUID];

    const subscription = characteristic.monitor((error, char) => {
      if (error) {
        console.log(
          `Notification error [${characteristicName}]:`,
          error.message,
        );
        return;
      }

      const base64Value = char.value;
      const bytes = this.base64ToBytes(base64Value);
      const floatValue = this.bytesToFloat32(bytes);
      callback(floatValue);
    });

    // ✅ Store both subscription and callback
    this.listeners[characteristicName] = { subscription, callback };
  }

  stopListeningAll() {
    Object.values(this.listeners).forEach(({ subscription }) => {
      if (subscription?.remove) {
        subscription.remove();
      }
    });
    this.listeners = {};
  }

  base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  bytesToFloat32(bytes) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    bytes.slice(0, 4).forEach((b, i) => view.setUint8(i, b));
    return view.getFloat32(0, true); // little endian
  }

  async disconnect() {
    this.stopListeningAll();

    if (this.device) {
      try {
        await this.manager.cancelDeviceConnection(this.device.id);
        console.log('Device manually disconnected');
      } catch (e) {
        console.log('Error during manual disconnect:', e.message);
      }
      this.device = null;
    }

    if (this.disconnectSubscription) {
      this.disconnectSubscription.remove();
      this.disconnectSubscription = null;
    }
  }

  async reconnectLastDevice() {
    if (this.lastConnectedDeviceId) {
      await this.connectToDevice({ id: this.lastConnectedDeviceId });
      this.resubscribeAll(); // ✅ Also allow manual reconnect to restore listeners
    } else {
      Alert.alert('Reconnect Error', 'No previously connected device found.');
    }
  }

  setReconnectStatusCallback(callback) {
    this.onReconnectStatusChange = callback;
  }

  emitReconnectStatus(status) {
    if (this.onReconnectStatusChange) {
      this.onReconnectStatusChange(status);
    }
  }
}

export default BLESingleton.getInstance();
