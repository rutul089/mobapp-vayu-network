import { decode as atob } from 'base-64';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

class BLESingleton {
  static instance = null;

  static ConnectionStatus = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    RECONNECTING: 'reconnecting',
    FAILED: 'failed',
  };

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
    this.listeners = {}; // { temperature: { subscription, callback } }

    // Callbacks
    this.onDisconnectCallback = null; // Called when device disconnects
    this.onReconnectCallback = null; // Called when device reconnects successfully
    this.onReconnectStatusChange = null; // Called when reconnecting starts/ends
    this.onReconnectFailure = null; // Called after 5 retry failures
    this.onReconnectRetryCallback = null; // Called on each retry attempt
    this.onConnectionStatusChange = null; // Called whenever connection status changes

    // State
    this.connectionStatus = BLESingleton.ConnectionStatus.DISCONNECTED;

    // Reconnect control
    this.isManualDisconnect = false;
  }

  // Callbacks setters
  setOnDisconnectCallback(cb) {
    this.onDisconnectCallback = cb;
  }

  setOnReconnectCallback(cb) {
    this.onReconnectCallback = cb;
  }

  setReconnectStatusCallback(cb) {
    this.onReconnectStatusChange = cb;
  }

  setOnReconnectFailure(cb) {
    this.onReconnectFailure = cb;
  }

  setOnReconnectRetryCallback(cb) {
    this.onReconnectRetryCallback = cb;
  }

  setConnectionStatusCallback(cb) {
    this.onConnectionStatusChange = cb;
  }

  emitReconnectStatus(status) {
    if (this.onReconnectStatusChange) {
      this.onReconnectStatusChange(status);
    }
  }

  emitConnectionStatus(status) {
    this.connectionStatus = status;
    if (this.onConnectionStatusChange) {
      this.onConnectionStatusChange(status);
    }
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
    this.isManualDisconnect = false;
    this.emitConnectionStatus(BLESingleton.ConnectionStatus.CONNECTING);
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
      this.log(`Connected to: ${this.device.name}`);
      this.setupDisconnectListener();
      this.emitConnectionStatus(BLESingleton.ConnectionStatus.CONNECTED);
    } catch (error) {
      this.emitConnectionStatus(BLESingleton.ConnectionStatus.FAILED);
      this.log(`Connection Failed: ${error.message}`);
      throw error;
    }
  }

  setupDisconnectListener() {
    if (this.disconnectSubscription) {
      this.disconnectSubscription.remove();
    }

    this.disconnectSubscription = this.device.onDisconnected(
      async (error, device) => {
        this.log(`Device disconnected: ${device.id}`);
        this.emitConnectionStatus(BLESingleton.ConnectionStatus.DISCONNECTED);
        this.emitReconnectStatus(true);

        if (this.onDisconnectCallback) {
          this.onDisconnectCallback(device);
        }

        if (this.isManualDisconnect) {
          this.log('Manual disconnect, skipping auto-reconnect.');
          return;
        }

        this.reconnectAttempts = 0;
        this.autoReconnect(device.id);
      },
    );
  }

  async autoReconnect(deviceId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.log(`Reconnect failed after ${this.reconnectAttempts} attempts.`);
      this.emitReconnectStatus(false);
      this.emitConnectionStatus(BLESingleton.ConnectionStatus.FAILED);

      if (this.onReconnectFailure) {
        this.onReconnectFailure(this.device);
      }
      return;
    }

    try {
      this.reconnectAttempts++;
      this.emitConnectionStatus(BLESingleton.ConnectionStatus.RECONNECTING);
      this.log(
        `Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
      );

      if (this.onReconnectRetryCallback) {
        this.onReconnectRetryCallback(this.reconnectAttempts);
      }

      await this.connectAndDiscover(deviceId);

      this.log(`Successfully reconnected to ${this.device.name}`);
      this.emitReconnectStatus(false);
      this.emitConnectionStatus(BLESingleton.ConnectionStatus.CONNECTED);

      this.reconnectAttempts = 0;
      this.setupDisconnectListener();
      this.resubscribeAll();

      if (this.onReconnectCallback) {
        this.onReconnectCallback(this.device);
      }
    } catch (err) {
      this.log(`Retry ${this.reconnectAttempts} failed: ${err.message}`);
      const delay = 2000;
      setTimeout(() => this.autoReconnect(deviceId), delay);
    }
  }

  async connectAndDiscover(deviceId) {
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
  }

  resubscribeAll() {
    const keys = Object.keys(this.listeners);
    if (!keys.length) return;

    this.log('Resubscribing to:', keys.join(', '));

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
      this.log(`Unknown characteristic: ${characteristicName}`);
      return;
    }

    const matchedUUID = Object.keys(this.characteristics).find(uuid =>
      uuid.includes(shortUuid),
    );

    if (!matchedUUID) {
      this.log(`Characteristic not found for: ${characteristicName}`);
      return;
    }

    const characteristic = this.characteristics[matchedUUID];

    const subscription = characteristic.monitor((error, char) => {
      if (error) {
        this.log(`Notification error [${characteristicName}]:`, error.message);
        return;
      }

      const base64Value = char.value;
      const bytes = this.base64ToBytes(base64Value);
      const floatValue = this.bytesToFloat32(bytes);
      callback(floatValue);
    });

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
    this.isManualDisconnect = true; // Mark manual
    this.stopListeningAll();
    this.emitConnectionStatus(BLESingleton.ConnectionStatus.DISCONNECTED);

    if (this.device) {
      try {
        await this.manager.cancelDeviceConnection(this.device.id);
        this.log('Device manually disconnected');
      } catch (e) {
        this.log('Error during manual disconnect:', e.message);
      }
      this.device = null;
    }

    if (this.disconnectSubscription) {
      this.disconnectSubscription.remove();
      this.disconnectSubscription = null;
    }
    this.characteristics = {};
  }

  async reconnectLastDevice() {
    if (this.lastConnectedDeviceId) {
      this.isManualDisconnect = false;
      await this.connectToDevice({ id: this.lastConnectedDeviceId });
      this.resubscribeAll();

      if (this.onReconnectCallback) {
        this.onReconnectCallback(this.device);
      }
    }
  }

  log(...args) {
    if (__DEV__) console.log('[BLE]', ...args);
  }
}
export { BLESingleton }; // <-- Add this line
export default BLESingleton.getInstance();
