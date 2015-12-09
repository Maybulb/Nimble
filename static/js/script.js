var $ = require('jquery');

// This isn't going to work
$('#input').focus();

$(document).keypress(function(e) {
	if (e.which == 13) alert('query: ' + $('#input').val());
})
