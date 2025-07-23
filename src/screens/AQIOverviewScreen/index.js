import React, { Component } from 'react';
import { Alert } from 'react-native';
import BleService, { BLESingleton } from '../../ble/BleService';
import AQI_Overview_Component from './AQI_Overview_Component';

class AQIOverviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readings: {},
      connected: false,
      reconnecting: false,
    };
    this._characteristicMap = [
      'temperature',
      'humidity',
      'pressure',
      'gas',
      'pm1',
      'pm25',
      'pm10',
      'eco2',
      'tvoc',
    ];
  }

  async componentDidMount() {
    this.setupBLECallbacks();
    if (
      BleService.connectionStatus === BLESingleton.ConnectionStatus.CONNECTED
    ) {
      this.startReadingSensorData();
      this.setState({ connected: true });
    } else {
      this.setState({ connected: false });
    }
  }

  async componentWillUnmount() {
    await BleService.disconnect();
    BleService.stopListeningAll();
    BleService.setReconnectStatusCallback(null);
    BleService.setOnDisconnectCallback(null);
    BleService.setOnReconnectCallback(null);
  }

  /**
   * Sets up BLE reconnect, disconnect and reconnect status callbacks
   */
  setupBLECallbacks = () => {
    BleService.setReconnectStatusCallback(isReconnecting => {
      this.setState({ reconnecting: isReconnecting });
    });

    BleService.setOnDisconnectCallback(device => {
      console.log('[Screen] Disconnected from:', device?.id);
      this.setState({ connected: false });
    });

    BleService.setOnReconnectCallback(device => {
      console.log('[Screen] Reconnected to:', device?.id);
      this.setState({ connected: true });
      this.startReadingSensorData();
    });

    BleService.setOnReconnectFailure(() => {
      Alert.alert('Error', 'Failed to reconnect after 5 attempts.');
      this.setState({ connected: false });
    });
  };

  /**
   * Listens to all AQI characteristic values
   */
  startReadingSensorData = () => {
    this._characteristicMap.forEach(name => {
      BleService.listenTo(name.toLowerCase(), value => {
        this.setState(prev => ({
          readings: {
            ...prev.readings,
            [name]: value.toFixed(2),
          },
        }));
      });
    });
    this.setState({ connected: true });
  };

  handleBroadcastIconPress = () => {
    //Implement logic for handleBroadcastIconPress
    const { connected } = this.state;
    if (connected) {
      this.handleDisconnect();
    } else {
      this.handleReconnect();
    }
  };

  handleDisconnect = async () => {
    await BleService.disconnect();
    this.setState({ connected: false });
    Alert.alert('Disconnected', 'Device has been disconnected.');
  };

  handleReconnect = async () => {
    try {
      await BleService.reconnectLastDevice();
      Alert.alert('Reconnected', 'Device reconnected successfully.');
    } catch (error) {
      Alert.alert('Reconnect Failed', error.message);
    }
  };

  render() {
    const { readings, reconnecting, connected } = this.state;
    return (
      <>
        <AQI_Overview_Component
          handleBroadcastIconPress={this.handleBroadcastIconPress}
          pollutantsData={[
            { name: 'PM2.5', value: readings['pm25'] || '0', color: '#3EB049' },
            { name: 'PM10', value: readings['pm10'] || '0', color: '#FFD600' },
            { name: 'PM1', value: readings['pm1'] || '0', color: '#3EB049' },
            { name: 'GAS', value: readings['gas'] || '0', color: '#3EB049' },
            { name: 'eco2', value: readings['eco2'] || '0', color: '#3EB049' },
            { name: 'TVOC', value: readings['tvoc'] || '0', color: '#3EB049' },
          ]}
          tempValue={readings['temperature']}
          humidityValue={readings['humidity']}
          aqiValue={200}
          connected={connected}
        />
      </>
    );
  }
}

export default AQIOverviewScreen;
