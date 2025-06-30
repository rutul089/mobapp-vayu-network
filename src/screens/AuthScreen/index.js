import React, { Component } from 'react';
import Auth_Component from './Auth_Component';
import { navigate } from '../../navigation/NavigationUtils';
import ScreenNames from '../../constants/ScreenNames';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onGooglePress = () => {
    navigate(ScreenNames.Home);
  };

  onApplePress = () => {
    navigate(ScreenNames.Home);
  };

  render() {
    return (
      <Auth_Component
        onGooglePress={this.onGooglePress}
        onApplePress={this.onApplePress}
      />
    );
  }
}

export default AuthScreen;
