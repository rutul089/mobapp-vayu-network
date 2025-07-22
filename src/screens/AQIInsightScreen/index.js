import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import AQI_Insight_Component from './AQI_Insight_Component';
import { goBack, navigate } from '../../navigation/NavigationUtils';
import ScreenNames from '../../constants/ScreenNames';
import BleService from '../../ble/BleService';

const characteristicMap = {
  '2a6e': 'Temperature',
  '2a6f': 'Humidity',
  '2a6d': 'Pressure',
  '2a6b': 'Gas',
  '2a7a': 'PM1',
  '2a7b': 'PM2.5',
  '2a7c': 'PM10',
  '2a7d': 'eCO2',
  '2a7e': 'TVOC',
};

const _characteristicMap = [
  'Temperature',
  'Humidity',
  'Pressure',
  'Gas',
  'PM1',
  'PM2.5',
  'PM10',
  'eCO2',
  'TVOC',
  '00001800-0000-1000-8000-00805f9b34fb',
];

class AQIInsightScreen extends Component {
  constructor(props) {
    super(props);
    this.ble = new BleService();

    this.state = {
      data: {},
      connected: false,
    };
  }

  async componentDidMount() {
    try {
      await this.ble.scanAndConnect();

      // Listen to all characteristics
      _characteristicMap.forEach(key => {
        const normalizedKey = key
          .toLowerCase()
          .replace('.', '')
          .replace(/[^a-z0-9]/gi, '');
        this.ble.listenTo(normalizedKey, value => {
          console.log(normalizedKey, value);
          this.setState({ [key]: value });
        });
      });
    } catch (error) {
      console.error('BLE Setup Error:', error);
    }

    // this.ble.listenTo('Pressure', value => {
    //   console.log('temperature.5:', value);
    //   this.setState({ pm25: value });
    // });

    // BleService.scanAndConnect((uuid, value) => {
    //   const shortUuid = uuid.slice(4, 8).toUpperCase();
    //   const label = characteristicMap[shortUuid] || uuid;
    //   console.log('uuid', uuid);
    //   this.setState(prevState => ({
    //     data: { ...prevState.data, [label]: value },
    //   }));
    // })
    //   .then(() => {
    //     this.setState({ connected: true });
    //   })
    //   .catch(err => {
    //     console.log('BLE Error:', err);
    //     Alert.alert('Error', 'Could not connect to BLE device');
    //   });
  }

  componentWillUnmount() {
    // BleService.disconnect();
    this.ble.disconnect();
  }

  getUuidFromLabel = label => {
    const entry = Object.entries(characteristicMap).find(
      ([uuid, name]) => name === label,
    );
    return entry ? `0000${entry[0]}-0000-1000-8000-00805f9b34fb` : null;
  };

  handleRead = async label => {
    try {
      const uuid = this.getUuidFromLabel(label);
      const value = await BleService.readValue(uuid);
      Alert.alert(`${label} (Read)`, `${value}`);
    } catch (err) {
      console.log('Read error:', err);
      Alert.alert('Read Error', 'Could not read value');
    }
  };

  handleWrite = async label => {
    try {
      const uuid = this.getUuidFromLabel(label);
      await BleService.writeValue(uuid, 42.0); // Example dummy write
      Alert.alert(`${label}`, 'Value written: 42.0');
    } catch (err) {
      console.log('Write error:', err);
      Alert.alert('Write Error', 'Could not write value');
    }
  };

  // handleRead = async label => {
  //   try {
  //     const uuid = this.getUuidFromLabel(label);
  //     const value = await BleService.readValue(uuid);
  //     Alert.alert(`${label} (Read)`, `${value}`);
  //   } catch (err) {
  //     console.log('Read error:', err);
  //   }
  // };

  // handleWrite = async label => {
  //   try {
  //     const uuid = this.getUuidFromLabel(label);
  //     await BleService.writeValue(uuid, 42.0); // write dummy value
  //     Alert.alert(`${label}`, 'Value written: 42.0');
  //   } catch (err) {
  //     console.log('Write error:', err);
  //   }
  // };

  onBackHandlePress = () => {
    goBack();
  };

  onNextPress = () => {
    // this.handleRead('PM2.5');
    navigate(ScreenNames.AQIOverview);
  };

  render() {
    return (
      <AQI_Insight_Component
        onBackHandlePress={this.onBackHandlePress}
        sectionDesc={'Air quality is good now.'}
        status={'LIVE'}
        aqi={30}
        pollutantsData={[
          // { name: 'PM2.5', value: 28, color: '#3EB049' },
          // { name: 'PM10', value: 61, color: '#FFD600' },
          // { name: 'NO2', value: 5, color: '#3EB049' },
          // { name: 'SO2', value: 56, color: '#3EB049' },
          // { name: 'O3', value: 15, color: '#3EB049' },
          // { name: 'CO', value: 56, color: '#3EB049' },
          { name: 'gas', value: this.state.Gas?.toFixed(2), color: '#3EB049' },
          {
            name: 'Temp',
            value: this.state.Temperature?.toFixed(2),
            color: '#3EB049',
          },
          {
            name: 'Humidity',
            value: this.state.Humidity?.toFixed(2),
            color: '#3EB049',
          },
        ]}
        onNextPress={this.onNextPress}
      />
    );
  }
}

export default AQIInsightScreen;
