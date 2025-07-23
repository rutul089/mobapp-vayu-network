import React, { Component } from 'react';
import BLEService from '../../ble/BleService';
import ScreenNames from '../../constants/ScreenNames';
import { navigate } from '../../navigation/NavigationUtils';
import BLE_DeviceList_Component from './BLE_DeviceList_Component';

const characteristicMap = [
  'Temperature',
  'Humidity',
  'Pressure',
  'Gas',
  'PM1',
  'PM2.5',
  'PM10',
  'eCO2',
  'TVOC',
];

export default class BLEDeviceListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      scanning: false,
    };
    this.ble = BLEService;
  }

  componentDidMount() {
    this.scanDevices();
  }
  scanDevices = async () => {
    try {
      this.setState({ scanning: true });
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
      await this.ble.connectToDevice(device);
      navigate(ScreenNames.AQIOverview);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  render() {
    const { devices } = this.state;
    console.log('123123', devices);
    return (
      <>
        <BLE_DeviceList_Component
          devices={devices}
          onDeviceSelected={this.connectToDevice}
        />
      </>
    );
  }
}
