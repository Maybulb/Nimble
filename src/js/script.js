var $ = require('jquery'),
    util = require('util'),
    rand = require('rand-paul'),
    electron = require('electron'),
    ipcRenderer = electron.ipcRenderer,
    request = require('request'),
    progress = require('request-progress'),
    URL = "https://nimble-backend.herokuapp.com/input?i=%s";

function resizeWindow(h) {
  ipcRenderer.send('resize', {height: h});
}

$(document).ready(function() {
  $.getJSON('js/suggestions.json', function(json) {
    var placeholder = rand.paul(json)
    $('#input').attr('placeholder', placeholder);
    console.log('Placeholder set to: ' + placeholder);
  })
})

$(document).keypress(function(event) {
  if (event.which === 13) query();
});

var query = function () {
  var encodedQuery = encodeURIComponent($('#input').val());
  var queryURL = util.format(URL, encodedQuery);

  console.log('Queried with: ' + queryURL)

  progress(request(queryURL))
  .on('progress', function(state) {
    console.log('progress: ' + state.percent) // Not working at all ¯\_(ツ)_/¯
  })
  .on('data', function(data) {
    var json = JSON.parse(data);
    var plaintext = json.result.result.plaintext;
    resizeWindow(300); // Throwing an error at the moment but continuing
    alert(json.result.input + ": " + plaintext);
  })
  .on('error', function(err) {
    console.log('Error:' + err)
  })

}
