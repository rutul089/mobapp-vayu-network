import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import Logger from './src/helper/Logger';
Logger.log('App started in DEV mode');

export default function App() {
  return <RootNavigator />;
}
