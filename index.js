var electron = require('electron');
var app = electron.app;
var menubar = require('menubar');

var mb = menubar({
	height: 50,
	width: 380,
	icon: './src/img/menubar_icon.png',
	index: 'file://' + __dirname + '/src/index.html'
});

mb.on('after-create-window', function() {
  // mb.window.openDevTools()
  mb.window.setResizable(false);
  mb.tray.setPressedImage('./src/img/menubar_icon_pressed.png');
})

mb.on('ready', function ready ()  {
	console.log('Nimble is ready');
})
