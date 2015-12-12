var $ = require('jquery');
var request = require('request');
var util = require('util');

var baseURL = "https://nimble-backend.herokuapp.com/input?i=%s";

// clean this miserable piece of shit up
$(document).keypress(function(e) {
  if (e.which === 13) {
    var encodedQuery = encodeURIComponent($('#input').val());
    var queryURL = util.format(baseURL, encodedQuery);

    alert(queryURL);

    // boo, request
    request(queryURL, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        alert(body);
      } else {
        alert('Error parsing: ' + queryURL);
      }
    })

  }
});
