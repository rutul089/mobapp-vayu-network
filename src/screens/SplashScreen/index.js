import React, { Component } from 'react';
import ScreenNames from '../../constants/ScreenNames';
import { navigateAndSimpleReset } from '../../navigation/NavigationUtils';
import Splash_Component from './Splash_Component';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      navigateAndSimpleReset(ScreenNames.Auth);
    }, 2000);
  }

  render() {
    return <Splash_Component />;
  }
}

export default SplashScreen;
