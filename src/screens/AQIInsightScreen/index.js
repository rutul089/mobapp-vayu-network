import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AQI_Insight_Component from './AQI_Insight_Component';
import { goBack, navigate } from '../../navigation/NavigationUtils';
import ScreenNames from '../../constants/ScreenNames';

class AQIInsightScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onBackHandlePress = () => {
    goBack();
  };

  onNextPress = () => {
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
          { name: 'PM2.5', value: 28, color: '#3EB049' },
          { name: 'PM10', value: 61, color: '#FFD600' },
          { name: 'NO2', value: 5, color: '#3EB049' },
          { name: 'SO2', value: 56, color: '#3EB049' },
          { name: 'O3', value: 15, color: '#3EB049' },
          { name: 'CO', value: 56, color: '#3EB049' },
        ]}
        onNextPress={this.onNextPress}
      />
    );
  }
}

export default AQIInsightScreen;
