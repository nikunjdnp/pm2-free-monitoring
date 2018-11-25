require('dotenv').config();
const cron = require('node-cron');
const influx = require('./model');
const async = require('async');
const request = require('request');

/*
* Node scheduler which runs on every 10 seconds.
*/
module.exports.indentify_node_process = cron.schedule('*/10 * * * * *', function () {
  console.log("indentify_node_process called()");
  pm2Data().then(function (pm2Response) {
    let pm2DataResponse = JSON.parse(pm2Response);
    async.map(pm2DataResponse.processes, (process, callback) => {
      if (process) {
        let influx_input = {};
        influx_input['measurement'] = 'pm2-node';
        influx_input['tags'] = {
          "host": process.name || null
        };
        influx_input['fields'] = {
          "NAME": process.name || null,
          "CPU": process.monit.cpu || 0,
          "MEM": process.monit.memory || 0,
          "PROCESS_ID": process.pid || 0
        };
        callback(null, influx_input);
      } else {
        callback("Error", null);
      }
    }, (err, result) => {
      if (err) {
        console.log("Err :: ", err);
      } else {
        influx.writePoints(result)
          .then(() => {
            console.log('write point success');
          }).catch(err => console.error(`write point fail,  ${err.message}`));
      }
    });
  }, function (rejectedValue) {
    console.log("rejectedValue :: ", rejectedValue);
  }).catch((err) => {
    console.log(err);
  });

}, false);


/*
* this function make request to your pm2 microservices server and 
* get all the data of all microservices. 
*/
var pm2Data = function () {
  return new Promise((resolve, reject) => {
    request({
      method: "GET",
      url: `http://${process.env.PM2_IP}:9615/`
    }, function (error, response, body) {
      if (error) {
        reject();
      } else if (response && response.statusCode == 200) {
        resolve(body);
      } else {
        console.log("Did not get any response!");
        reject();
      }
    });
  });
};
