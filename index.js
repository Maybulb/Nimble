var electron = require('electron');
var app = require('electron').app;
var ipc = require('electron').ipcMain;
var globalShortcut = require('electron').globalShortcut;
var autoUpdater = require('electron').autoUpdater;
var menubar = require('menubar');
var fs = require('fs');
var AutoLaunch = require('auto-launch');
var pjson = require('./package.json');
global.options = require('./options.json') || {
    "mathjs": true,
    "startup": true,
    "center": false,
    "bugreport": true,
    "autoupdate": true,
    theme: {
        "red": false,
        "orange": true,
        "yellow": false,
        "green": false,
        "blue": false,
        "purple": false,
        "pink": false,
        "contrast": false
    }
}
const path = require('path');
require('shelljs/global');

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
            y: optfunc.getYValue(),
            width: arg.width,
            height: 533
        }, true);

        finalDim.height = 533;
        finalDim.width = arg.width;
    } else {
        mb.window.setBounds({
            x: mb.window.getPosition()[0],
            y: optfunc.getYValue(),
            width: arg.width,
            height: arg.height
        }, true);

        finalDim.height = arg.height;
        finalDim.width = arg.width;
    }

    optfunc.position();

    console.log("Resizing window to " + finalDim.width + " x " + finalDim.height + "\n");
});

ipc.on('toggleview', function(event) {
    var position = [mb.window.getPosition()[0], mb.window.getPosition()[1]];
    
    if(mb.window.isVisible() === true) {
        mb.hideWindow();
    } else if (mb.window.isVisible() === false) {
        mb.showWindow();
    }

    mb.window.setPosition(position[0], position[1]);
});

ipc.on('reset-window', function(event) {
    mb.window.setBounds({
        x: mb.window.getPosition()[0],
        y: optfunc.getYValue(),
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
            path: path.resolve(app.getAppPath(), '../../../')
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
    },
    getYValue: function() {
        try {
            if (global.autohide === true && global.options.center === false) {
                return 22
            } else {
                return mb.window.getPosition()[1]
            }
        } catch (e) {
            return mb.window.getPosition()[1]
        }
    }
}

ipc.on('quit', function(){
    app.quit();
})

mb.on('after-create-window', function() {
    mb.window.setResizable(false);
    mb.tray.setPressedImage(__dirname + '/assets/img/menubar_icon_pressed.png');

    mb.tray
        .on('click', click)
        .on('right-click', rightClick)

    // check if menubar is set to autohide
    var script = "defaults read NSGlobalDomain _HIHideMenuBar -bool"
    var output = exec(script, {async:true})

    output.stdout.on("data", function(data) {
        if (data == 1) {
            global.autohide = true
        } else if (data == 0) {
            global.autohide = false
        }

        mb.window.setBounds({
            x: mb.window.getPosition()[0],
            y: optfunc.getYValue(),
            width: 380,
            height: 42
        });
    })  

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

        mb.window.setPosition(position[0], position[1]);
    });
});

mb.on('after-show', function() {
    if (mb.window) {
        mb.window.webContents.send("window-open");
        mb.window.setPosition(mb.window.getPosition()[0], optfunc.getYValue());
    }
})

mb.on('ready', function() {
    // screen size
    var screen = require('electron').screen;
    global.screenSize = screen.getPrimaryDisplay().size;

    // auto update
    if (global.options.autoupdate === true) {
        var updateFeed = 'https://nimble-autoupdate.herokuapp.com/update/osx/';
        autoUpdater.setFeedURL(updateFeed + pjson.version);
        autoUpdater.checkForUpdates();

        autoUpdater.on('update-available', function() {
            console.log('update available and downloading');
            require('electron').dialog.showMessageBox({
                "message": "Update Downloading",
                "detail": "A new update is currently available and downloading. Nimble will let you know before it quits to install the update.",
                "buttons": []
            })
        });

        autoUpdater.on('update-downloaded', function(event) {
            console.log('update downloaded: ' + event);
            require('electron').dialog.showMessageBox({
                "message": "Update Ready To Install",
                "detail": "Nimble has downloaded a new update. Would you like to quit Nimble and install it?",
                "buttons": ["Yes", "No"],
            }, function(response) {
                switch(response) {
                    case 0:
                        break;
                    case 1:
                        autoUpdater.quitAndInstall();
                        break;
                }
            });
        });
    }
});

mb.on('will-quit', function() {
    globalShortcut.unregisterAll();
});