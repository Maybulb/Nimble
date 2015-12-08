var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var Tray = electron.Tray;

// Report crashes to server
electron.crashReporter.start();

var appIcon = null;
// Called when Electron has finished initialization
app.on('ready', function() {
	appIcon = new Tray('./icon.png');
	var contextMenu = Menu.buildFromTemplate([
		{ label: 'Item1', type: 'radio' },
		{ label: 'Item2', type: 'radio' }
	]);
	appIcon.setToolTip('Nimble');
	appIcon.setContextMenu(contextMenu);
});
