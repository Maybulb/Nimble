var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;
var menubar = require('menubar');
var fs = require("fs");
var globalShortcut = electron.globalShortcut;
var AutoLaunch = require('auto-launch');

var mb = menubar({
    height: 42,
    width: 380,
    icon: __dirname + '/assets/img/menubar_iconTemplate.png',
    index: 'file://' + __dirname + '/src/index.html'
});

ipc.on('resize', function(event, arg) {


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

    var finalDim = {
        height: null,
        width: null
    };

    if (arg.height > 500) {
        // if height is way too big, then just set it short and scroll
        mb.window.setBounds({
            x: mb.window.getPosition()[0],
            y: mb.window.getPosition()[1],
            width: arg.width,
            height: 500
        });

        finalDim.height = 500;
        finalDim.width = arg.width;
    } else {
        mb.window.setBounds({
            x: mb.window.getPosition()[0],
            y: mb.window.getPosition()[1],
            width: arg.width,
            height: arg.height
        });

        finalDim.height = arg.height;
        finalDim.width = arg.width;
    }

    console.log("Resizing window to " + finalDim.width + " x " + finalDim.height + "\n");
});

// console.log handler
ipc.on('node_console', function(event, arg) {
    console.log(arg.m + "\n")
});

ipc.on('save_options', function(event, arg) {
    fs.writeFile(__dirname + "/options.json", arg, function(err) {
        if(err) {
            console.log(err);
        }

        console.log("Options were saved.\n");
    });

    // make options available here too
    global.options = JSON.parse(arg);

    // things to do
    startup();
});

function startup() {
    var nimbleAutoLauncher = new AutoLaunch({
        name: 'Nimble',
        path: '/Applications/Nimble.app',
    });

    // startup?
    if (global.options.startup === true) {
        console.log("Loading Nimble on startup: on.\n")
        nimbleAutoLauncher.enable();
    } else {
        console.log("Loading Nimble on startup: off.\n")
        nimbleAutoLauncher.disable();
    }
}

mb.on('after-create-window', function() {
    mb.window.setResizable(false);
    mb.tray.setPressedImage(__dirname + '/assets/img/menubar_icon_pressed.png');

    mb.window.setBounds({
        x: mb.window.getPosition()[0],
        y: mb.window.getPosition()[1],
        width: 380,
        height: 42
    });
});

mb.on('ready', function() {
    // global hotkeys to show/hide Nimble
    // Feel free to change the accelerators, I'm not sure if I like them but they'll make due
    globalShortcut.register('CmdOrCtrl+Shift+S', function() {
        mb.showWindow();
    });
    globalShortcut.register('CmdOrCtrl+Shift+H', function() {
        mb.hideWindow();
    })

    // screen size
    var screen = electron.screen;
    global.screenSize = screen.getPrimaryDisplay().size;

    mb.tray
        .on('click', click)
        .on('right-click', rightClick)

    function click(e, bounds) {
        if (e.shiftKey) {
            // This is throwing an error, if you don't load Nimble by clicking on it
            mb.window.openDevTools({
                detach: true
            })
        }
    }

    // In the future it'd be nice if right clicking would show the menu instead of quitting
    // We'd have some trouble getting this right, though
    function rightClick(e, bounds) {
        app.quit();
    }
});

mb.on('will-quit', function() {
    globalShortcut.unregisterAll();
})