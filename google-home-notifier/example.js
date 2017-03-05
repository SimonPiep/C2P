var express = require('express');
var googlehome = require('./google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080;

var deviceName = 'Google-Home-73bae5d890be61256a04307c3a23f35b';
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
  var url = 'https://simonpiep.github.io/C2P/1330868.mp3'; //Call to prayer mp3
  // if (!req.body) return res.sendStatus(400);
  // console.log(req.body);
  // var text = req.body.text;
  // if (text){
    var text = "The next prayer time is 3:36 PM";
    googlehome.notifyMp3(url, function(res) {
      console.log(res);
    });
    res.send(deviceName + ' will play: ' + url + '\n');
  // }else{
  //   res.send('Please POST "text=Time to say your prayers"');
  // }

});



app.listen(serverPort, function () {
  ngrok.connect(serverPort, function (err, url) {
    console.log('POST "text=Hello Google Home" to:');
    console.log('    http://localhost:' + serverPort + '/google-home-notifier');
    console.log('    ' +url + '/google-home-notifier');
    console.log('example:');
    console.log('curl -X POST -d "text=Hello Google Home" ' + url + '/google-home-notifier');
  });
})
