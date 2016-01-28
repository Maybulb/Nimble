var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;
var menubar = require('menubar');

var mb = menubar({
    height: 42,
    width: 380,
    icon: './assets/img/menubar_icon.png',
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

mb.on('after-create-window', function() {
    mb.window.setResizable(false);
    mb.tray.setPressedImage('./src/img/menubar_icon_pressed.png');

    mb.window.setBounds({
        x: mb.window.getPosition()[0],
        y: mb.window.getPosition()[1],
        width: 380,
        height: 42
    });
});

mb.on('ready', function() {
    // screen size
    var screen = electron.screen;
    global.screenSize = screen.getPrimaryDisplay().size;

    mb.tray
        .on('click', click)
        .on('right-click', rightClick)
        .on('click', devTools);

    function click(e, bounds) {}

    function devTools(e, bound) {
        if (e.shiftKey) {
            mb.window.openDevTools({
                detach: true
            }) // This is throwing an error, if you don't load Nimble by clicking on it
        }
    }

    function rightClick(e, bounds) {
        app.quit();
    }
});
