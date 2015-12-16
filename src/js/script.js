var $ = require('jquery');
var request = require('request');
var util = require('util');
var randpaul = require('rand-paul');
var url = "https://nimble-backend.herokuapp.com/input?i=%s";

$(document).ready(function() {
  $.getJSON('js/suggestions.json', function(json) {
    $('#input').attr('placeholder', randpaul(json));
  })
})

$(document).keypress(function(event) {
  if (event.which === 13) query();
});

var query = function () {
  var encodedQuery = encodeURIComponent($('#input').val());
  var queryURL = util.format(url, encodedQuery);
  request(queryURL, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var json = JSON.parse(body);
      alert(json.result.input + ": " + json.result.result.plaintext);
    } else {
      alert('Error parsing: ' + queryURL);
    }
  })
}
