var request = require('request');
var util = require('util');
baseURL = "https://nimble-backend.herokuapp.com/input?i=%s";

var sendRequest = function(query) {
  queryURL = util.format(baseURL, query)
  console.log("URL: " + queryURL); // boo, i'm going to sleep
}
