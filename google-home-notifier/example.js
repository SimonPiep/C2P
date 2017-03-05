var express = require('express');
var googlehome = require('./google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080;
var http = require("https");

var deviceName = 'Google-Home-e4a3003728e30f0de1a8e5baf47031de';
googlehome.device(deviceName);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/google-home-notifier', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  console.log(req.body);
  var text = req.body.text;
  if (text){
    res.send(deviceName + ' will say: ' + text + '\n');
    googlehome.notify(text, function(res) {
      console.log(res);
    });
  }else{
    res.send('Please POST "text=Time to say your prayers"');
  }

});

app.get('/alarm1', urlencodedParser, function (req, res) {
  var url = 'https://simonpiep.github.io/C2P/prayersmall.mp3'; //Call to prayer mp3
  // if (!req.body) return res.sendStatus(400);
  // console.log(req.body);
  // var text = req.body.text;
  // if (text){
    var text = "The next prayer time is 3:36 PM";
    googlehome.notifyMp3(url, function(res) {
      console.log(res);
      setTimeout(function () {
        stopFlashing();
      }, 30000)
    });

    var options = {
      "method": "PUT",
      "hostname": "na-hackathon-api.arrayent.io",
      "port": "443",
      "path": "/v3/devices/33554453",
      "headers": {
        "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJhMGZlYTc2MC0wMWM4LTExZTctYWU0Ni01ZmMyNDA0MmE4NTMiLCJlbnZpcm9ubWVudF9pZCI6Ijk0OGUyY2YwLWZkNTItMTFlNi1hZTQ2LTVmYzI0MDQyYTg1MyIsInVzZXJfaWQiOiI5MDAwMTA5Iiwic2NvcGVzIjoie30iLCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwiaWF0IjoxNDg4NzM0NzQyLCJleHAiOjE0ODk5NDQzNDJ9.EZXWTsdfwd7UaNQfYRefCPlSjGzng7LHoyTU01JsKX9S1HTJGgluuSJ-CFSI4tkaiJ8IKCM8ycSn3W__sTcIFQ",
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "d7bde53f-db0b-a376-7a8c-2010b394dd9e"
      }
    };

    var febrezereq = http.request(options, function (febrezeres) {
      var chunks = [];

      febrezeres.on("data", function (chunk) {
        chunks.push(chunk);
      });

      febrezeres.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });

    febrezereq.write(JSON.stringify([ { DeviceAction: 'led_behavior=28' },
      { DeviceAction: 'led_mode=1' },
      { DeviceAction: 'led_color=1,1,1,1,1' } ]));
    febrezereq.end();

    res.send(deviceName + ' will play: ' + url + '\n');
  // }else{
  //   res.send('Please POST "text=Time to say your prayers"');
  // }

});

app.get('/stop', urlencodedParser, function (req, res) {
    stopFlashing();
    res.send('Stopping led blinking\n');
  // }else{
  //   res.send('Please POST "text=Time to say your prayers"');
  // }

});

function stopFlashing() {
  var options = {
      "method": "PUT",
      "hostname": "na-hackathon-api.arrayent.io",
      "port": "443",
      "path": "/v3/devices/33554453",
      "headers": {
        "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJhMGZlYTc2MC0wMWM4LTExZTctYWU0Ni01ZmMyNDA0MmE4NTMiLCJlbnZpcm9ubWVudF9pZCI6Ijk0OGUyY2YwLWZkNTItMTFlNi1hZTQ2LTVmYzI0MDQyYTg1MyIsInVzZXJfaWQiOiI5MDAwMTA5Iiwic2NvcGVzIjoie30iLCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwiaWF0IjoxNDg4NzM0NzQyLCJleHAiOjE0ODk5NDQzNDJ9.EZXWTsdfwd7UaNQfYRefCPlSjGzng7LHoyTU01JsKX9S1HTJGgluuSJ-CFSI4tkaiJ8IKCM8ycSn3W__sTcIFQ",
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "d7bde53f-db0b-a376-7a8c-2010b394dd9e"
      }
    };

    var febrezereq = http.request(options, function (febrezeres) {
      var chunks = [];

      febrezeres.on("data", function (chunk) {
        chunks.push(chunk);
      });

      febrezeres.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });

    febrezereq.write(JSON.stringify([
      { DeviceAction: 'led_mode=1' },
      { DeviceAction: 'led_color=0,0,0,0,0' } ]));
    febrezereq.end();

    console.log('Stopping led blinking');
}


app.listen(serverPort, function () {
  ngrok.connect(serverPort, function (err, url) {
    console.log('POST "text=Hello Google Home" to:');
    console.log('    http://localhost:' + serverPort + '/google-home-notifier');
    console.log('    ' +url + '/google-home-notifier');
    console.log('example:');
    console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  });
})
