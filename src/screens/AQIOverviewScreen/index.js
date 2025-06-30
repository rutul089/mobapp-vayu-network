import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import AQI_Overview_Component from './AQI_Overview_Component';
import { goBack } from '../../navigation/NavigationUtils';

class AQIOverviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleBroadcastIconPress = () => {
    goBack();
    Alert.alert('TODO : Implement logic for handleBroadcastIconPress');
  };

  render() {
    return (
      <>
        <AQI_Overview_Component
          handleBroadcastIconPress={this.handleBroadcastIconPress}
          pollutantsData={[
            { name: 'PM2.5', value: 28, color: '#3EB049' },
            { name: 'PM10', value: 61, color: '#FFD600' },
            { name: 'SO2', value: 8, color: '#3EB049' },
            { name: 'CO', value: 56, color: '#3EB049' },
            { name: 'O3', value: 15, color: '#3EB049' },
            { name: 'TVOC', value: 56, color: '#3EB049' },
          ]}
          tempValue={20}
          humidityValue="50"
          aqiValue={120}
        />
      </>
    );
  }
}

export default AQIOverviewScreen;
