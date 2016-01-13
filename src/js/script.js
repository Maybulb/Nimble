var $ = require('jquery'),
    util = require('util'),
    rand = require('rand-paul'),
    electron = require('electron'),
    ipcRenderer = electron.ipcRenderer,
    request = require('request'),
    progress = require('request-progress'),
    math = require("mathjs"),
    URL = "https://nimble-backend.herokuapp.com/input?i=%s";
    remote = electron.remote;
    MenuItem = remote.MenuItem;
    Menu = remote.Menu;
    Shell = electron.shell;

function resizeWindow() {
  var h = $("body").height();
  ipcRenderer.send('resize', {height: h});
}

// error forwarding
window.onerror = function(e) {
  window.log("Error \"" + e + "\" caught. Being forwarded to Node.js console.")
  ipcRenderer.send('node_console', {m: e})
}
// please use window.log instead of console.log, as it forwards it to the backend (node.js console)
// therefore bugs are easier to troubleshoot :)
window.log = function(log) {
  ipcRenderer.send('node_console', {m: log})
  console.log(log)
}

$(document).ready(function() {
  $.getJSON('js/suggestions.json', function(json) {
    var placeholder = rand.paul(json);
    $('#input').attr('placeholder', placeholder);
    window.log('Placeholder set to: ' + placeholder);
  });
});

$(document).keypress(function(event) {
  if (event.which === 13) query();
});

var query = function () {
  var input = $('#input').val();
  var encodedQuery = encodeURIComponent(input);
  var queryURL = util.format(URL, encodedQuery);
  var result;

  // in this try block, we check if things work
  try {
    if (input === "What is Nimble?" || input === "What is Nimble" || input === "what is Nimble?" || input === "what is nimble" || input === "what is Nimble" || input === "What is nimble" || input === "What is nimble?") {
      // if user asks what nimble is, tell them
      result = "Nimble is Wolfram|Alpha for your menubar. It is designed, coded, and crafted by <a href='#' onclick='Shell.openExternal(\"http://madebybright.com\")'>Bright</a>. We really hope you enjoy Nimble, and we tirelessly work on it as much as we can.<hr/>Nimble is built on Electron and Mathjs, as well as our blood, sweat, and keystrokes."
    } else {
      result = math.eval(input);
    }

    $(".output").html(result);
    resizeWindow();
  } catch(e) {
    // if input isn't math throw error and use wolfram code
    window.log("Input is not math. Using Wolfram|Alpha. If you'd like, the error message given by MathJS is as follows:\n" + e);

    progress(request(queryURL))
    .on('progress', function(state) {
      ipcRenderer.send('progress', {p: state.percentage});
    })
    .on('data', function(data) {
      var json = JSON.parse(data);
      result = json.result.result.plaintext;

      $(".output").text(result);
      resizeWindow();
    })
    .on('error', function(err) {
      window.log('Error:' + err);
    });
  }

  window.log('Queried with: ' + queryURL);
}
