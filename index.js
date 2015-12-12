var electron = require('electron');
var app = electron.app;
var menubar = require('menubar');

var mb = menubar({
	height:55,
	width: 380,
	icon: './static/img/menubar_icon.png',
	index: 'file://' + __dirname + '/static/index.html'
});

mb.on('after-create-window', function() {
	// mb.window.openDevTools()
	mb.tray.setPressedImage('./static/img/menubar_icon_pressed.png');
	mb.window.setResizable(false);
})

mb.on('ready', function ready ()  {
	console.log('Nimble is ready');
})
