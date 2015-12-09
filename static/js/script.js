(function() {
  var $;

  $ = require('jquery');

  $('#input').focus();

  $(document).keypress(function(e) {
    if (e.which === 13) {
      alert('query: ' + $('#input').val());
    }
  });

}).call(this);
