var electron = require('electron');
var app = electron.app;
var menubar = require('menubar');

var mb = menubar({
	height:60,
	width: 480,
	icon: './static/img/menubar_icon.png',
});

mb.on('after-create-window', function() {
	// mb.tray.setPressedImage('./static/img/menubar_icon_pressed.png');
	// mb.window.openDevTools()
	mb.window.setResizable(false);
})

mb.on('ready', function ready ()  {
	console.log('Te is ready');
})
