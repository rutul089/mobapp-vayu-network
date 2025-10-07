// src/services/InfluxService.js

const INFLUX_URL = 'https://eu-central-1-1.aws.cloud2.influxdata.com';
const INFLUX_TOKEN =
  'iu7SYGQC6Sbhnwsw3m6HYakgszl3cuLAzJL2wiDdC9oASxlzAq9WZVVR6d5InlywDUFGLYJpn2BRxJeNS47nOQ==';
const INFLUX_ORG = 'sohil@oizom.com';
const INFLUX_BUCKET = 'opendata';

class InfluxService {
  /**
   * Query data from InfluxDB
   * @param {string} fluxQuery - The Flux query string
   */
  static async queryData(fluxQuery) {
    try {
      const res = await fetch(
        `${INFLUX_URL}/api/v2/query?org=${encodeURIComponent(INFLUX_ORG)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${INFLUX_TOKEN}`,
            'Content-Type': 'application/vnd.flux',
            Accept: 'application/csv', // You can also request "application/json"
          },
          body: fluxQuery,
        },
      );

      if (!res.ok) {
        throw new Error(`Query failed: ${res.status} ${res.statusText}`);
      }

      const text = await res.text();
      console.log('📊 Influx Query Result:', text);
      return text;
    } catch (error) {
      console.error('❌ Influx Query Error:', error);
      throw error;
    }
  }

  /**
   * Write data to InfluxDB
   * @param {string} measurement - Measurement name
   * @param {Object} fields - Key-value fields (e.g., { temperature: 25.3 })
   * @param {Object} [tags={}] - Optional tags (e.g., { device: "flux01" })
   */
  static async writeData(measurement, fields, tags = {}) {
    try {
      // Build line protocol string
      const tagsStr = Object.entries(tags)
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
      const fieldsStr = Object.entries(fields)
        .map(([k, v]) => `${k}=${v}`)
        .join(',');

      const lineProtocol = `${measurement}${
        tagsStr ? ',' + tagsStr : ''
      } ${fieldsStr}`;

      const res = await fetch(
        `${INFLUX_URL}/api/v2/write?org=${encodeURIComponent(
          INFLUX_ORG,
        )}&bucket=${encodeURIComponent(INFLUX_BUCKET)}&precision=s`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${INFLUX_TOKEN}`,
            'Content-Type': 'text/plain; charset=utf-8',
          },
          body: lineProtocol,
        },
      );

      if (!res.ok) {
        throw new Error(`Write failed: ${res.status} ${res.statusText}`);
      }

      console.log('✅ Data written:', lineProtocol);
      return true;
    } catch (error) {
      console.error('❌ Influx Write Error:', error);
      throw error;
    }
  }
}

export default InfluxService;
