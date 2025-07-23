import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import * as Screens from '../screens';
import ScreenNames from '../constants/ScreenNames';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

const StackRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.Splash}
      screenOptions={screenOptions}
    >
      {/* Splash & Authentication */}
      <Stack.Screen
        name={ScreenNames.Splash}
        component={Screens.SplashScreen}
      />
      <Stack.Screen name={ScreenNames.Auth} component={Screens.AuthScreen} />
      <Stack.Screen name={ScreenNames.Home} component={Screens.HomeScreen} />
      <Stack.Screen
        name={ScreenNames.AQIInsight}
        component={Screens.AQIInsightScreen}
      />
      <Stack.Screen
        name={ScreenNames.AQIOverview}
        component={Screens.AQIOverviewScreen}
      />
      <Stack.Screen
        name={ScreenNames.BLEListing}
        component={Screens.BLEDeviceListScreen}
      />
    </Stack.Navigator>
  );
};

export default StackRoutes;
