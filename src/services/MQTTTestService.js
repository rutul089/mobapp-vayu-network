import MQTT from 'sp-react-native-mqtt';

class MQTTTestService {
  client = null;

  connect(
    brokerUrl,
    username,
    password,
    clientId = `vayu-network-${Math.random().toString(16).substr(2, 8)}`,
  ) {
    return new Promise((resolve, reject) => {
      if (this.client) {
        console.log('⚠️ Already connected, skipping new connection');
        return resolve();
      }
      MQTT.createClient({
        uri: brokerUrl, // e.g., 'mqtt://mqtt.oizom.com:1883'
        clientId: clientId,
        user: username,
        pass: password,
        clean: true,
        keepalive: 60,
      })
        .then(client => {
          this.client = client;

          client.on('closed', () => {
            console.log('🔌 MQTT disconnected');
            this.client = null;
          });

          client.on('error', err => {
            console.log('❌ MQTT error:', err);
            this.client = null;
            reject(err);
          });

          client.on('message', msg => {
            console.log(`📩 Message: topic=${msg.topic}, payload=${msg.data}`);
          });

          client.on('connect', () => {
            console.log('✅ MQTT connected');
            resolve();
          });

          client.connect();
        })
        .catch(reject);
    });
  }

  subscribe(topic) {
    if (this.client) {
      this.client.subscribe(topic, 0);
      console.log(`📡 Subscribed to ${topic}`);
    }
  }

  publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message, 0, false);
      console.log(`📤 Published to ${topic}: ${message}`);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      console.log('🔌 MQTT disconnected manually');
    }
  }
}

export default new MQTTTestService();
