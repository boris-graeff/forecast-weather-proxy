var express = require('express');
var dateFormat = require('dateformat');
var request = require('request');
var router = express.Router();
var config = require('../config').openWeatherMapAPI;
var _ = require('underscore');

/**
 * Get weather forecast for city given
 */
router.get('/:city', function(req, res) {
  var now = new Date(),
      csv = '';

  var url = config.url +
      req.params.city +
      '&units=' + config.units +
      '&APPID=' + config.apiKey;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      // Get forecast for today 12:00
      var data = _.findWhere(JSON.parse(body).list, {'dt_txt': dateFormat(now, 'yyyy-mm-dd 12:00:00')});

      csv += dateFormat(now, 'HH:MM') + ',';
      csv += data.main.temp_max + ',';
      csv += data.weather[0].main.toLowerCase();
    }

    // Format: hour,temp,weather
    res.send(csv);
  });

});

module.exports = router;
