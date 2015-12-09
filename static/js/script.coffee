$ = require('jquery')
$('#input').focus()
$(document).keypress (e) ->
  if e.which == 13
    alert 'query: ' + $('#input').val()
  return