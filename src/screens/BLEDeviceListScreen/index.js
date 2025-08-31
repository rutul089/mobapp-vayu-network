import React, { Component } from 'react';
import BLEService from '../../services/ble/BleService';
import ScreenNames from '../../constants/ScreenNames';
import { navigate } from '../../navigation/NavigationUtils';
import BLE_DeviceList_Component from './BLE_DeviceList_Component';
import { requestBluetoothAndLocationPermissions } from '../../helper/PermissionHelper';
import MQTTTestService from '../../services/MQTTTestService';

export default class BLEDeviceListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      scanning: false,
    };
    this.ble = BLEService;
  }

  async componentDidMount() {
    this.checkConnection();
    const granted = await requestBluetoothAndLocationPermissions();
    if (granted) {
      this.scanDevices();
    } else {
      // show some UI that permissions are needed
    }
  }
  scanDevices = async () => {
    try {
      this.setState({ scanning: true });
      this.ble.manager?.stopDeviceScan();
      await new Promise(resolve => setTimeout(resolve, 3000));
      const foundDevices = await this.ble.scanForDevicesWithPrefix();
      this.setState({ devices: foundDevices });
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      this.setState({ scanning: false });
    }
  };

  connectToDevice = async device => {
    try {
      this.setState({ scanning: true });
      await this.ble.connectToDevice(device);
      navigate(ScreenNames.AQIOverview, { params: device });
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      this.setState({ scanning: false });
    }
  };

  restartBLEScan = () => {
    this.scanDevices();
  };
  // mqtt.oizom.com
  // mqtts://test.mosquitto.org:8883
  async checkConnection() {
    MQTTTestService.connect(
      'mqtts://test.mosquitto.org:8883',
      'oizom',
      '12345678',
    )
      .then(() => {
        this.setState({ connected: true });
        MQTTTestService.subscribe('test/topic'); // Example topic
        MQTTTestService.publish('test/topic', 'Hello from RN 🚀');
      })
      .catch(err => {
        console.log('MQTT Connection Failed:', err);
      });
  }

  sendMessage = () => {
    MQTTTestService.publish('test/topic', 'Hello from React Native!');
  };

  render() {
    const { devices, scanning } = this.state;
    console.log('123123', devices);
    return (
      <>
        <BLE_DeviceList_Component
          devices={devices}
          onDeviceSelected={this.connectToDevice}
          scanning={scanning}
          restartBLEScan={this.sendMessage}
        />
      </>
    );
  }
}
