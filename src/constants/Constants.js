const Constants = {
  //AsyncStorage Keys
  STORAGE_KEYS: {
    USER_TOKEN: 'USER_TOKEN',
    LAST_CONNECTED_DEVICE: 'LAST_CONNECTED_DEVICE',
    MQTT_SETTINGS: 'MQTT_SETTINGS',
  },

  // 🌐 Broker / API URLs
  MQTT: {
    LOCAL_BROKER: 'mqtt://mqtt.oizom.com:1883',
    SECURE_BROKER: 'mqtts://test.mosquitto.org:8883',
    USERNAME: 'oizom',
    PASSWORD: '12345678',
  },

  // App Settings
  INTERVALS: {
    SENSOR_PUBLISH: 60000, // 1 min
    RECONNECT_TIMEOUT: 5000, // 5 sec
  },

  //Device constants
  DEVICE: {
    PREFIX: 'Vayu_AQ',
  },
};

export default Constants;
