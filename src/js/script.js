var $ = require('jquery');
var util = require('util');
var electron = require('electron');
var ipc = electron.ipcMain;
var request = require('request');
var progress = require('request-progress');
var url = "https://nimble-backend.herokuapp.com/input?i=%s";

function resultsReturned(results) {
  ipc.send('resize', {
    height: results.getBoundingClient.height + 10;
  })
}

$(document).ready(function() {
  $.getJSON('js/suggestions.json', function(json) {
    $('#input').attr('placeholder', randomValue(json));
  })
})

$(document).keypress(function(event) {
  if (event.which === 13) query();
});

var randomValue = function(array) {
  return array[Math.floor(Math.random()*array.length)];
}

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
    resultsReturned();
    // alert(json.result.input + ": " + plaintext);
  }).on('error', function(err) {
    console.log('Error:' + err)
  })

}
