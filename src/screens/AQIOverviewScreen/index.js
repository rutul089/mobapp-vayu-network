import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import AQI_Overview_Component from './AQI_Overview_Component';
import { goBack } from '../../navigation/NavigationUtils';
import BleService from '../../ble/BleService';

class AQIOverviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        temperature: '',
        humidity: '',
        pressure: '',
        gas: '',
        pm1: '',
        pm25: '',
        pm10: '',
        eco2: '',
        tvoc: '',
      },
      connected: false,
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
    this.startListening();
    this._characteristicMap.forEach(name => {
      this.ble.listenTo(name, value => {
        this.setState(prev => ({
          data: { ...prev.data, [name]: value.toFixed(2) },
        }));
      });
    });
  }

  componentWillUnmount() {
    BleService.stopListeningAll();
  }

  startListening = () => {
    this._characteristicMap.forEach(name => {
      BleService.listenTo(name, value => {
        this.setState(prev => ({
          data: { ...prev.data, [name]: value.toFixed(2) },
        }));
      });
    });
    this.setState({ connected: true });
  };

  handleBroadcastIconPress = () => {
    goBack();
    Alert.alert('TODO : Implement logic for handleBroadcastIconPress');
  };

  handleDisconnect = async () => {
    await BleService.disconnect();
    this.setState({ connected: false });
    Alert.alert('Disconnected', 'Device has been disconnected.');
  };

  handleReconnect = async () => {
    try {
      await BleService.reconnectLastDevice();
      this.startListening();
      Alert.alert('Reconnected', 'Device reconnected successfully.');
    } catch (error) {
      Alert.alert('Reconnect Failed', error.message);
    }
  };

  render() {
    const { data } = this.state;

    console.log('12312312312123', JSON.stringify(data));
    return (
      <>
        <AQI_Overview_Component
          handleBroadcastIconPress={this.handleBroadcastIconPress}
          pollutantsData={[
            { name: 'PM2.5', value: data['pm25'], color: '#3EB049' },
            { name: 'PM10', value: data['pm10'], color: '#FFD600' },
            { name: 'PM1', value: data['pm1'], color: '#3EB049' },
            { name: 'GAS', value: data['gas'], color: '#3EB049' },
            { name: 'eco2', value: data['eco2'], color: '#3EB049' },
            { name: 'TVOC', value: data['tvoc'], color: '#3EB049' },
          ]}
          tempValue={data['temperature']}
          humidityValue={data['humidity']}
          aqiValue={200}
        />
      </>
    );
  }
}

export default AQIOverviewScreen;
