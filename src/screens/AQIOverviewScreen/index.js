import React, { Component } from 'react';
import { Alert } from 'react-native';
import BleService, { BLESingleton } from '../../services/ble/BleService';
import AQI_Overview_Component from './AQI_Overview_Component';
import { getScreenParam } from '../../navigation/NavigationUtils';
import MQTTTestService from '../../services/MQTTTestService';
import Constants from '../../constants/Constants';
import { generateFluxId } from '../../helper/Utils';

class AQIOverviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readings: {},
      connected: false,
      reconnecting: false,
      showReconnectModal: false,
      topicName: '',
      vayu_id: '',
    };
    this._characteristicMap = [
      'temperature',
      'humidity',
      'pressure',
      'gas',
      'pm1',
      'pm25',
      'pm10',
      'eco2',
      'tvoc',
    ];
    this.mqttInterval = null;
    this.hasSentInitialMQTT = false;
  }

  async componentDidMount() {
    let navState = getScreenParam(this.props.route, 'params');
    this.setState(
      {
        topicName: 'flux',
        vayu_id: generateFluxId(navState?.id) || 'UNKNOWN',
      },
      async () => {
        await this.checkConnection();
        this.setupBLECallbacks();
      },
    );
    if (
      BleService.connectionStatus === BLESingleton.ConnectionStatus.CONNECTED
    ) {
      this.startReadingSensorData();
      this.setState({ connected: true });
    } else {
      this.setState({ connected: false });
    }
  }

  async componentWillUnmount() {
    await BleService.disconnect();
    BleService.stopListeningAll();
    BleService.setReconnectStatusCallback(null);
    BleService.setOnDisconnectCallback(null);
    BleService.setOnReconnectCallback(null);

    this.clearMQTTInterval();
    MQTTTestService.disconnect();
  }

  handleMessage = (topic, message) => {
    console.log(`MQTT Message from ${topic}:`, message);
  };

  clearMQTTInterval = () => {
    if (this.mqttInterval) {
      clearInterval(this.mqttInterval);
      this.mqttInterval = null;
      this.hasSentInitialMQTT = false;
    }
  };

  async checkConnection() {
    try {
      await MQTTTestService.connect(Constants.MQTT.SECURE_BROKER, '', '');

      console.log('✅ MQTT Connected');
      this.setState({ connected: true });

      MQTTTestService.subscribe(this.state.topicName);
      // Start periodic publish every 1 min
      this.mqttInterval = setInterval(
        this.publishReadingsToMQTT,
        Constants.INTERVALS.SENSOR_PUBLISH,
      );
    } catch (err) {
      console.log('MQTT Connection Failed:', err);
    }
  }

  /**
   * Sets up BLE reconnect, disconnect and reconnect status callbacks
   */
  setupBLECallbacks = () => {
    BleService.setReconnectStatusCallback(isReconnecting => {
      this.setState({ reconnecting: isReconnecting });
    });

    BleService.setOnDisconnectCallback(device => {
      // Show Modal Disconnected with retry button
      console.log('[Screen] Disconnected from:', device?.id);
      this.setState({ connected: false, showReconnectModal: true });
      this.clearMQTTInterval();
    });

    BleService.setOnReconnectCallback(device => {
      // Hide modal
      console.log('[Screen] Reconnected to:', device?.id);
      this.setState({
        connected: true,
        showReconnectModal: false,
        reconnecting: false,
      });
      this.startReadingSensorData();
    });

    BleService.setOnReconnectFailure(() => {
      // Alert.alert('Error', 'Failed to reconnect after 5 attempts.');
      this.setState({ connected: false, showReconnectModal: true });
    });
  };

  /**
   * Listens to all AQI characteristic values
   */
  startReadingSensorData = () => {
    this._characteristicMap.forEach(name => {
      BleService.listenTo(name.toLowerCase(), value => {
        this.setState(
          prev => ({
            readings: {
              ...prev.readings,
              [name]: value.toFixed(2),
            },
          }),
          () => {
            // Immediately publish the first time (optional guard inside)
            if (!this.hasSentInitialMQTT) {
              setTimeout(() => {
                this.publishReadingsToMQTT();
                this.hasSentInitialMQTT = true;
              }, 1500);
            }
          },
        );
      });
    });
    this.setState({ connected: true });
  };

  handleBroadcastIconPress = () => {
    //Implement logic for handleBroadcastIconPress
    const { connected } = this.state;
    if (connected) {
      this.handleDisconnect();
    } else {
      this.handleReconnect();
    }
  };

  handleDisconnect = async () => {
    await BleService.disconnect();
    this.setState({ connected: false });
    // Alert.alert('Disconnected', 'Device has been disconnected.');
  };

  handleReconnect = async () => {
    // this.setState({ showReconnectModal: false });
    try {
      await BleService.reconnectLastDevice();
      // Alert.alert('Reconnected', 'Device reconnected successfully.');
    } catch (error) {
      // Alert.alert('Reconnect Failed', error.message);
    }
  };

  resetAndScanBLE = async () => {
    await BleService.disconnect();
    const devices = await BleService.scanForDevicesWithPrefix('Vayu_AQ');
    if (devices.length > 0) {
      await BleService.connectToDevice(devices[0]);
      this.startReadingSensorData();
      this.setState({ connected: true });
    } else {
      Alert.alert(
        'No Devices Found',
        'Please make sure your device is nearby and powered on.',
      );
    }
  };

  onModalHide = () => {
    this.setState({
      showReconnectModal: false,
    });
  };

  onTryAgainPress = async () => {
    this.setState({
      showReconnectModal: false,
    });
    // this.setState({ reconnecting: true }); // optional loading state
    // try {
    //   await BleService.restartBLEConnection();
    // } catch (e) {
    //   console.log('Manual retry failed:', e);
    //   this.setState({ reconnecting: false }); // optional loading state
    // }
  };

  publishReadingsToMQTT = () => {
    const { readings, topicName, vayu_id } = this.state;
    if (Object.keys(readings).length === 0) return;

    const payload = JSON.stringify({
      deviceId: vayu_id, // <-- you can replace this with navState?.id or any device ID
      timestamp: new Date().toISOString(),
      latitude: '23.0332',
      longitude: '72.6168',
      temp: readings?.temperature,
      hum: readings?.humidity,
      pr: readings?.pressure,
      v2: readings?.tvoc,
      p3: readings?.pm1,
      p1: readings?.pm25,
      p2: readings?.pm10,
    });

    try {
      MQTTTestService.publish(topicName, payload);
      console.log('MQTT Published:', payload);
    } catch (e) {
      console.log('MQTT publish error:', e.message);
    }
  };

  render() {
    const { readings, reconnecting, connected, showReconnectModal } =
      this.state;
    return (
      <>
        <AQI_Overview_Component
          handleBroadcastIconPress={this.handleBroadcastIconPress}
          pollutantsData={[
            { name: 'PM2.5', value: readings['pm25'] || '0', color: '#3EB049' },
            { name: 'PM10', value: readings['pm10'] || '0', color: '#FFD600' },
            { name: 'PM1', value: readings['pm1'] || '0', color: '#3EB049' },
            { name: 'GAS', value: readings['gas'] || '0', color: '#3EB049' },
            { name: 'eco2', value: readings['eco2'] || '0', color: '#3EB049' },
            { name: 'TVOC', value: readings['tvoc'] || '0', color: '#3EB049' },
          ]}
          tempValue={readings['temperature']}
          humidityValue={readings['humidity']}
          aqiValue={200}
          connected={connected}
          onModalHide={this.onModalHide}
          showReconnectModal={showReconnectModal}
          onTryAgainPress={this.onTryAgainPress}
        />
      </>
    );
  }
}

export default AQIOverviewScreen;
