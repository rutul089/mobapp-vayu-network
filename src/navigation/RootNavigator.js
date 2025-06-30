import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { AppState, StyleSheet, View } from 'react-native';

// import { NetworkStatusBanner } from '../components';
import { navigationRef } from './NavigationUtils';
import StackRoutes from './StackRoutes';

export default class RootNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      isNetConnected: true,
      currentScreenName: null,
    };
    this.routeNameRef = React.createRef();
  }

  onNavigationStateChange = () => {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
    console.log(`@@@current_screen: ${currentRouteName}`);
    this.routeNameRef.current = currentRouteName;
    this.setState({ currentScreenName: currentRouteName });
  };

  render() {
    return (
      <View style={styles.wrapper}>
        <NavigationContainer
          key={'NavigationContainer'}
          ref={navigationRef}
          onReady={() => {
            const route = navigationRef.current?.getCurrentRoute()?.name;
            this.routeNameRef.current = route;
            this.setState({ currentScreenName: route });
          }}
          onStateChange={this.onNavigationStateChange}
        >
          <StackRoutes />
        </NavigationContainer>
        {/* <NetworkStatusBanner /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
