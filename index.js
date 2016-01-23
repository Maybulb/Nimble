var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;
var menubar = require('menubar');

var mb = menubar({
	height: 50,
	width: 380,
	icon: './src/img/menubar_icon.png',
	index: 'file://' + __dirname + '/src/index.html'
});

ipc.on('resize', function(event, arg) {
	console.log("Resizing window to " + arg.width + " x " + arg.height);

	// this is the animation code that crashes
	/*
	var h = mb.window.getSize()[1];
	while(h !== arg.height) {
		setTimeout(function () {
			if(h > arg.height) {
				h--;
			} else if (h < arg.height) {
				h++;
			}

			console.log(h)
			mb.window.setSize(mb.window.getSize()[0], h)
		}, 1)
	}
	*/

	mb.window.setBounds({
		x: mb.window.getPosition()[0],
		y: mb.window.getPosition()[1],
		width: arg.width,
		height: arg.height
	});
});

// console.log handler
ipc.on('node_console', function(event, arg) {
	console.log(arg.m)
});

mb.on('after-create-window', function() {
	mb.window.setResizable(false);
	mb.tray.setPressedImage('./src/img/menubar_icon_pressed.png');
});

mb.on('ready', function ()  {
	mb.tray
		.on('click', click)
		.on('right-click', rightClick)
		.on('click', devTools);

	function click(e, bounds) {}
	function devTools(e, bound) {
		if (e.shiftKey) {
			mb.window.openDevTools({detach: true}) // This is throwing an error?
		}
	}
	function rightClick (e, bounds) { 
		app.quit();
	}
});
