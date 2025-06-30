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
        />
      </>
    );
  }
}

export default AQIOverviewScreen;
