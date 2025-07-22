// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';

// class BleService {
//   constructor() {
//     this.manager = new BleManager();
//     this.device = null;
//     this.characteristics = {}; // Store characteristic objects
//   }

//   /**
//    * Scan and connect to the BLE device
//    * @param {Function} onDataReceived Callback(uuid, value)
//    */
//   async scanAndConnect(onDataReceived) {
//     return new Promise((resolve, reject) => {
//       console.log('Start scanning...');
//       this.manager.startDeviceScan(null, null, async (error, device) => {
//         if (error) {
//           console.log('Scan error:', error);
//           reject(error);
//           return;
//         }
//         console.log('device--->', device.name, device.id);
//         // Match your device by name (Vayu_AQI_Monitor)
//         if (device && device.id === 'EF:70:CE:86:8B:9B') {
//           console.log('Found device:', device.name);
//           this.manager.stopDeviceScan();

//           try {
//             this.device = await device.connect();
//             console.log('Connected');

//             await this.device.discoverAllServicesAndCharacteristics();
//             console.log('Discovered services & characteristics');

//             const services = await this.device.services();

//             for (let service of services) {
//               const chars = await service.characteristics();
//               for (let char of chars) {
//                 this.characteristics[char.uuid] = char;
//                 console.log('Characteristic found:', char.uuid);
//                 console.log('char', char);
//                 // Subscribe to notifications
//                 if (char.isNotifiable) {
//                   console.log('0000000');
//                   char.monitor((error, characteristic) => {
//                     if (error) {
//                       console.log('Notify error:', error);
//                       return;
//                     }
//                     console.log('0000000');
//                     const value = this.parseData(characteristic.value);
//                     console.log(`Notification from ${char.uuid}:`, value);
//                     onDataReceived && onDataReceived(char.uuid, value);
//                   });
//                 }
//               }
//             }

//             resolve(this.device);
//           } catch (err) {
//             console.log('Connection error:', err);
//             reject(err);
//           }
//         }
//       });
//     });
//   }

//   /**
//    * Read value from a characteristic
//    * @param {string} uuid characteristic UUID
//    */
//   async readValue(uuid) {
//     if (!this.characteristics[uuid])
//       throw new Error('Characteristic not found');
//     const char = await this.characteristics[uuid].read();
//     return this.parseData(char.value);
//   }

//   /**
//    * Write a float value to characteristic
//    * @param {string} uuid characteristic UUID
//    * @param {number} floatValue
//    */
//   async writeValue(uuid, floatValue) {
//     if (!this.characteristics[uuid])
//       throw new Error('Characteristic not found');
//     const buffer = Buffer.alloc(4);
//     buffer.writeFloatLE(floatValue, 0);
//     const base64 = buffer.toString('base64');
//     await this.characteristics[uuid].writeWithResponse(base64);
//     console.log(`Wrote ${floatValue} to ${uuid}`);
//   }

//   /**
//    * Parse BLE base64 value → float
//    */
//   parseData(base64Value) {
//     if (!base64Value) return null;
//     const buffer = Buffer.from(base64Value, 'base64');
//     return buffer.readFloatLE(0);
//   }

//   disconnect() {
//     if (this.device) {
//       this.device.cancelConnection().catch(console.log);
//     }
//   }
// }

// export default new BleService();

// ble/BleService.js
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { decode as atob } from 'base-64';

export default class BLEService {
  constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.characteristics = {};
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

  async scanAndConnect() {
    await this.requestPermissions();

    return new Promise((resolve, reject) => {
      this.manager.startDeviceScan(null, null, async (error, device) => {
        if (error) return reject(error);
        if (device.id === 'FB:E9:B7:B2:2A:A9') {
          this.manager.stopDeviceScan();
          console.log('---->Connected');

          try {
            const connected = await device.connect();
            await connected.discoverAllServicesAndCharacteristics();
            this.device = connected;

            const services = await connected.services();
            for (const service of services) {
              const chars = await service.characteristics();
              console.log('chars', chars);
              for (const c of chars) {
                this.characteristics[c.uuid.toLowerCase()] = c;
              }
            }

            resolve();
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  // Helper to get 16-bit UUID mapping
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

  // Listen to float notifications
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
      console.warn('Characteristic not found for', characteristicName);
      return;
    }

    const characteristic = this.characteristics[matchedUUID];

    characteristic.monitor((error, char) => {
      if (error) {
        console.log('Notification error:', error);
        return;
      }

      const base64Value = char.value;
      const bytes = this.base64ToBytes(base64Value);
      const floatValue = this.bytesToFloat32(bytes);

      callback(floatValue);
    });
  }

  // Base64 → Uint8Array
  base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // Uint8Array → float32
  bytesToFloat32(bytes) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    bytes.slice(0, 4).forEach((b, i) => view.setUint8(i, b));
    return view.getFloat32(0, true); // little endian
  }

  async disconnect() {
    if (this.device) {
      await this.manager.cancelDeviceConnection(this.device.id);
      this.device = null;
      this.characteristics = {};
    }
  }
}
