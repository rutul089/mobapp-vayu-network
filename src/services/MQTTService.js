import mqtt from 'mqtt/dist/mqtt'; // Important for RN

class MQTTService {
  static instance = null;
  client = null;

  static getInstance() {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }
    return MQTTService.instance;
  }

  connect = (host, username, password, onMessageCallback) => {
    if (this.client?.connected) {
      console.log('Already connected to MQTT');
      return;
    }

    const options = {
      username,
      password,
      reconnectPeriod: 1000,
      connectTimeout: 4000,
      clean: true,
    };

    console.log(`Connecting to MQTT at ${host}...`);
    this.client = mqtt.connect(host, options);

    this.client.on('connect', () => {
      console.log('✅ MQTT connected');
    });

    this.client.on('message', (topic, payload) => {
      if (onMessageCallback) {
        onMessageCallback(topic, payload.toString());
      }
    });

    this.client.on('error', err => {
      console.error('❌ MQTT error:', err);
    });

    this.client.on('reconnect', () => {
      console.log('♻️ MQTT reconnecting...');
    });
  };

  subscribe = topic => {
    if (!this.client) return;
    this.client.subscribe(topic, err => {
      if (err) console.error('Subscribe error:', err);
      else console.log(`📡 Subscribed to ${topic}`);
    });
  };

  publish = (topic, message) => {
    if (!this.client) return;
    this.client.publish(topic, message, {}, err => {
      if (err) console.error('Publish error:', err);
      else console.log(`📤 Published to ${topic}: ${message}`);
    });
  };

  disconnect = () => {
    if (this.client) {
      this.client.end();
      console.log('🔌 MQTT disconnected');
    }
  };
}

export default MQTTService;
