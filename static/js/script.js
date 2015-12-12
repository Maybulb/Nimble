var $ = require('jquery');
var request = require('request');
var util = require('util');

$(document).ready(function() {
  var suggestions = [
    '256/8', 'How big is the Atlantic Ocean?',
    'Distance of Earth from Mars', 'Distance of Voyager 1',
    'Words that rhyme with Bright', 'Donald Trump\'s mother',
    '#FFCA30 in HSL', 'Protons in Lithium'
  ]
  $('#input').attr('placeholder', randomValue(suggestions));
})

var url = "https://nimble-backend.herokuapp.com/input?i=%s";

var randomValue = function(array) {
  return array[Math.floor(Math.random()*array.length)];
}

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
