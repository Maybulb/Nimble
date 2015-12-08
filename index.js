var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

// Report crashes to server
electron.crashReporter.start();

// Keep global reference of window object
var mainWindow = null;

// Quit when all windows are closed
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

// Called when Electron has finished initialization
app.on('ready', function() {
	// Create browser window
	mainWindow = new BrowserWindow({width: 800, height: 600});

	// load index.html
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// open devtools
	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		// dereference window object
		mainWindow = null;
	});
});
