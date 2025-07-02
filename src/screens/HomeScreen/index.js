import React, { Component } from 'react';
import ScreenNames from '../../constants/ScreenNames';
import { navigate } from '../../navigation/NavigationUtils';
import Home_Component from './Home_Component';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPress = () => {
    navigate(ScreenNames.AQIInsight);
    // navigate(ScreenNames.AQIOverview);
  };

  render() {
    return <Home_Component onPress={this.onPress} />;
  }
}
