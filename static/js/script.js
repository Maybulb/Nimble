var $ = require('jquery');

$(document).keypress(function(e) {
	if (e.which == 13) {
		alert('user pressed enter. submit query')
	}
})
