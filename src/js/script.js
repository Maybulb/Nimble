var $ = require('jquery');
var util = require('util');
var rand = require('rand-paul');
var request = require('request');
var progress = require('request-progress');
var url = "https://nimble-backend.herokuapp.com/input?i=%s";

$(document).ready(function() {
  $.getJSON('js/suggestions.json', function(json) {
    $('#input').attr('placeholder', rand.paul(json));
  })
})

$(document).keypress(function(event) {
  if (event.which === 13) query();
});

var query = function () {
  var encodedQuery = encodeURIComponent($('#input').val());
  var queryURL = util.format(url, encodedQuery);

  console.log('Queried with: ' + queryURL)

  progress(request(queryURL), {
    delay: 1000
  }).on('progress', function(state) {
    console.log('progress: ', state.percent)
  }).on('data', function(data) {
    var json = JSON.parse(data);
    var plaintext = json.result.result.plaintext;
    alert(json.result.input + ": " + plaintext);
  }).on('error', function(err) {
    console.log('Error:' + err)
  })

}
