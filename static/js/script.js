var $ = require('jquery');

$(document).keypress(function(e) {
  if (e.which === 13) {
    alert('query: ' + $('#input').val());
  }
});
