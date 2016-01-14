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
	console.log("Resizing window to " + mb.window.getSize()[0] + " x " + arg.height);
	mb.window.setSize(mb.window.getSize()[0], arg.height);
});

ipc.on('progress', function(event, arg) {
	console.log("Load progress " + arg.p)
	mb.window.setProgress(arg.p);
});

// console.log handler
ipc.on('node_console', function(event, arg) {
	console.log(arg.m)
});

mb.on('after-create-window', function() {
  // mb.window.openDevTools({detach: true});
  mb.window.setResizable(false);
<<<<<<< HEAD
  mb.tray.setPressedImage('./src/img/menubar_icon_pressed.png');
})
=======
	mb.tray.setPressedImage('./src/img/menubar_icon_pressed.png');
});
>>>>>>> development

mb.on('ready', function ()  {
	console.log('Nimble is ready');

	mb.tray
		.on('click', click)
		.on('right-click', rightClick)
		.on('click', devTools);

	function click(e, bounds) {}
	function devTools(e, bound) {
		if (e.shiftKey) {
			mb.window.openDevTools({detach: true})
		}
	}
	function rightClick (e, bounds) { app.quit() }
});
