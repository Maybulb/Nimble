var $ = require('jquery');
var request = require('request');
var util = require('util');

function get_type(thing){
    if(thing===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
}

var baseURL = "https://nimble-backend.herokuapp.com/input?i=%s";

// clean this miserable piece of shit up
$(document).keypress(function(e) {
  if (e.which === 13) {
    var encodedQuery = encodeURIComponent($('#input').val());
    var queryURL = util.format(baseURL, encodedQuery);

    // this is messy af. fix it!!!!!!!!!
    request(queryURL, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        var json = JSON.parse(body);
        alert("\"" + json.result.input + "\" : " + json.result.result.plaintext);
      } else {
        alert('Error parsing: ' + queryURL);
      }
    })

  }
});
