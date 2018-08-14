const Influx = require('influx');

const influxModel = new Influx.InfluxDB({
    host: 'localhost',
    port: 8086,
    username: 'nikunj',
    password: 'nikunj123',
    database: 'pm2-prod-node',
    schema: [
      {
        measurement: 'pm2-prod-node',
        fields: {
          NAME:Influx.FieldType.STRING,
          CPU:Influx.FieldType.FLOAT,
          MEM:Influx.FieldType.FLOAT,
          PROCESS_ID: Influx.FieldType.INTEGER
        },
        tags: [
          'host'
        ]
      }
    ]
  });

  module.exports = influxModel;
