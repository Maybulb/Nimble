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
    index: 'file://' + __dirname + '/src/index.html',
    "preload-window": true
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

    if (arg.height > 533) {
        // if height is way too big, then just set it short and scroll
        mb.window.setBounds({
            x: mb.window.getPosition()[0],
            y: mb.window.getPosition()[1],
            width: arg.width,
            height: 533
        }, true);

        finalDim.height = 533;
        finalDim.width = arg.width;
    } else {
        mb.window.setBounds({
            x: mb.window.getPosition()[0],
            y: mb.window.getPosition()[1],
            width: arg.width,
            height: arg.height
        }, true);

        finalDim.height = arg.height;
        finalDim.width = arg.width;
    }

    optfunc.position();

    console.log("Resizing window to " + finalDim.width + " x " + finalDim.height + "\n");
});

ipc.on("toggleview", function(event) {
    var position = [mb.window.getPosition()[0], mb.window.getPosition()[1]];
        
    if(mb.window.isVisible() === true) {
        mb.hideWindow();
    } else if (mb.window.isVisible() === false) {
        mb.showWindow();
    }

    mb.window.setPosition(position[0], position[1], true);
});

ipc.on("reset-window", function(event) {
    mb.window.setBounds({
        x: mb.window.getPosition()[0],
        y: mb.window.getPosition()[1],
        width: 380,
        height: 42,
    }, true);

    optfunc.position();
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
    optfunc.startup();
    optfunc.position();
});

// various functions that make options work
var optfunc = {
    startup: function() {
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

        return null
    },
    position: function() {
        if(global.options.center === true) {
            mb.setOption("window-position", "center");
            mb.positioner.move("center");
        } else if (global.options.center === false) {
            mb.setOption("window-position", "trayCenter");
            if (global.bounds) {
                mb.positioner.move("trayCenter", global.bounds)
            }
        }

        return null
    }
}



mb.on('after-create-window', function() {
    mb.window.setResizable(false);
    mb.tray.setPressedImage(__dirname + '/assets/img/menubar_icon_pressed.png');

    mb.window.setBounds({
        x: mb.window.getPosition()[0],
        y: mb.window.getPosition()[1],
        width: 380,
        height: 42,
    }, true);

    mb.tray
        .on('click', click)
        .on('right-click', rightClick)

    function click(e, bounds) {
        if (e.shiftKey) {
            mb.window.openDevTools({
                detach: true
            })
        }

        global.bounds = bounds;
    }

    function rightClick(e, bounds) {
        mb.window.webContents.send("tray-rightclick");
    }

    // global hotkey to toggle nimble
    globalShortcut.register('CmdOrCtrl+Shift+=', function() {
        var position = [mb.window.getPosition()[0], mb.window.getPosition()[1]];
        
        if(mb.window.isVisible() === true) {
            mb.hideWindow();
        } else if (mb.window.isVisible() === false) {
            mb.showWindow();
        }

        mb.window.setPosition(position[0], position[1], true);
    });
});

mb.on("after-show", function() {
    if (mb.window) {
        mb.window.webContents.send("window-open");
    }
})

mb.on('ready', function() {
    // screen size
    var screen = electron.screen;
    global.screenSize = screen.getPrimaryDisplay().size;
});

mb.on('will-quit', function() {
    globalShortcut.unregisterAll();
});