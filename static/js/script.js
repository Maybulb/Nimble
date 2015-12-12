var $ = require('jquery');
var request = require('request');
var util = require('util');

var url = "https://nimble-backend.herokuapp.com/input?i=%s";

// clean this miserable piece of shit up
$(document).keypress(function(e) {
  if (e.which === 13) {
    var encodedQuery = encodeURIComponent($('#input').val());
    var queryURL = util.format(url, encodedQuery);

    // this is messy af. fix it!!!!!!!!!
    request(queryURL, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        var json = JSON.parse(body);
        alert(json.result.input + ": " + json.result.result.plaintext);
      } else {
        alert('Error parsing: ' + queryURL);
      }
    })

  }
});
