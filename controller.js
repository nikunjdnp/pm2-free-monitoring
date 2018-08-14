var ps = require('ps-node');
var express = require('express');
const http = require('http');
const os = require('os');
const cron = require('node-cron');
//var router = express.Router();
var influx = require('./model');
var async = require('async');
const request = require('request');
/* influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('pm2-node')) {
      return influx.createDatabase('pm2-node');
    }
  }).catch(err => {
    console.error(`Error creating Influx database!`);
  });
 */
module.exports.indentify_node_process = cron.schedule('*/10 * * * * *', function () {
  console.log("indentify_node_process called()");
  /*   var influx_input = {
      measurement: 'perf',
      tags: { host: 'box1.example.com' },
      fields: { cpu: getCpuUsage(), mem: getMemUsage() },
    }; */
  var total_influx_data = [];
  pm2Data().then(function (pm2Response) {
    var pm2DataResponse = JSON.parse(pm2Response);
    // console.log("pm2 response ----> ", pm2DataResponse.processes);
    async.map(pm2DataResponse.processes, (process, callback) => {
      if (process) {
        var influx_input = {};
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
        console.log("Err ---- ", err);
      } else {
        //console.log("Result ----- ", result);
        influx.writePoints(result)
          .then(() => {
            console.log('write point success');
          }).catch(err => console.error(`write point fail,  ${err.message}`));
      }
    });
  }, function (rejectedValue) {
    console.log("rejectedValue >>>>>> ", rejectedValue);
  }).catch((err) => {
    console.log(err);
  });

}, false);

var pm2Data = function () {
  return new Promise((resolve, reject) => {
    //if (business_id && rse_user && transaction_id && payment_type && payment_mode && card_name) {
    request({
      method: "GET",
      url: 'http://10.0.0.230:9615/'
    }, function (error, response, body) {
      if (error) {
        console.log("Error ---->", error);
        reject();
      } else if (response && response.statusCode == 200) {
        //console.log("Respons :::: ", body);
        resolve(body);
      } else {
        console.log("Did not get any response!");
        reject();
      }
    });
  });
};

/* 
var parseTable = function (data) {
  let lines = data.split(/(\r\n|\n|\r)/).filter(line => {
    return line.trim().length > 0;
  });
  console.log("lines >>>>> ", lines);
  let matches = lines.shift().trim().match(/(\w+\s*)/g);
  console.log("matches >>>>> ", matches);
  if (!matches) {
    return [];
  }
  let ranges = [];
  let headers = matches.map((col, i) => {
    let range = [];

    if (i === 0) {
      range[0] = 0;
      range[1] = col.length;
    } else {
      range[0] = ranges[i - 1][1];
      range[1] = range[0] + col.length;
    }
    console.log("range >>>>> ", range);
    ranges.push(range);
    return col.trim();
  });
  ranges[ranges.length - 1][1] = Infinity;

  return lines.map(line => {
    let row = {};
    ranges.forEach((r, i) => {
      let key = headers[i];
      let value = line.substring(r[0], r[1]).trim()
      console.log("row[key] >>>> ", row[key], "value >>>> ", value);
      row[key] = value;
    });

    return row;
  });
};

var extractColumns = function (text) {
  let lines = text.split(/(\r|\n|\r)/);
  return lines;
};
var processWithName = function (data) {
  let lines = data.split(/(\r\n|\n|\r)/).filter(line => {
    return line.trim().length > 0;
  });
  console.log("lines >>>>> ", lines);
  let
}; */
