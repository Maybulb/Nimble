var $ = require('jquery'),
    util = require('util'),
    rand = require('rand-paul'),
    electron = require('electron'),
    ipcRenderer = electron.ipcRenderer,
    request = require('request'),
    progress = require('request-progress'),
    math = require("mathjs"),
    URL = "https://nimble-backend.herokuapp.com/input?i=%s",
    Shell = electron.shell,
    msg = new SpeechSynthesisUtterance(),
    clipboard = electron.clipboard,
    nativeImage = electron.nativeImage;

function speak(text) {
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 0.8; // 0.1 to 10
    msg.pitch = 1; //0 to 2
    msg.text = text;
    msg.lang = 'en-UK';

    window.log("Nimble just said \"" + text + "\" using the Speech Synthesizer.")
    speechSynthesis.speak(msg);
}

var clipboardCopy = {
    link: function() {
        clipboard.writeText(window.json[window.json.length - 1]["origin_url"]);
    },
    text: function() {
        clipboard.writeText(window.json[1].subpods[0].text);
    },
    image: function() {
        // send with ipc to index.js, for now a WIP
        var image = nativeImage.createFromPath(webContents.downloadURL(window.json[1].subpods[0].image))
        clipboard.writeImage(image);
    }
}

var shareButton = {
    twitter: function() {
        var tweet = $("#input").val() + ":\n" + window.json[1].subpods[0].image + " (via @nimbledotapp)";
        Shell.openExternal("https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet))
    }
}

// resize window to respond to content
function resizeWindow(other) {
    var h = $("body").height();
    var w;

    // if not resizing width to fit an image (when parameter "other" isn't true) then just resize to body width
    // this is a temporary fix for oversized images until we figure something else out...
    // basically if you're not putting an image inside the output just put true as a parameter of resizeWindow()
    if (other === false || other === undefined) {
        w = $("#image-output").width() + 32;

        // if the width isn't oversized just roll with it
        if (w < 348) {
            w = 380; // default
        }
    } else if (other === true) {
        w = $("body").width();
    }


    ipcRenderer.send('resize', {
        height: h,
        width: w
    });
}

// error forwarding
window.onerror = function(e) {
    ipcRenderer.send('node_console', {
        m: e
    })
}

// please use window.log instead of console.log, as it forwards it to the backend (node.js console)
// therefore bugs are easier to troubleshoot :)
window.log = function(log) {
    ipcRenderer.send('node_console', {
        m: log
    })
    console.log(log)
}

$(document).ready(function() {
    // set placeholder
    $.getJSON('js/suggestions.json', function(json) {
        var placeholder = rand.paul(json);
        $('#input').attr('placeholder', placeholder);
    });

    window.setInterval(function() {
        // new placeholder every 10 seconds
        $.getJSON('js/suggestions.json', function(json) {
            var placeholder = rand.paul(json);
            $('#input').attr('placeholder', placeholder);
        });
    }, 10000)

});

$(document).keypress(function(event) {
    if (event.which === 13) query();
});

var query = function() {
    var input = $('#input').val();
    var result;

    // in this try block, we check if things work
    try {
        if (input === "What is Nimble?" || input === "What is Nimble" || input === "what is Nimble?" || input === "what is nimble" || input === "what is Nimble" || input === "What is nimble" || input === "What is nimble?") {
            // if user asks what nimble is, tell them
            result = "Nimble is Wolfram|Alpha for your menubar. It is designed, coded, and crafted by <a href='#' onclick='Shell.openExternal(\"http://madebybright.com\")'>Bright</a>. We really hope you enjoy Nimble, and we tirelessly work on it as much as we can.<hr/>Nimble is built on Electron and Mathjs, as well as our blood, sweat, and keystrokes."
        } else {
            result = math.eval(input);
        }

        $(".output").html(result);
        resizeWindow(true);
    } catch (e) {
        // if input isn't math throw error and use wolfram code
        window.log("Input is not math. Using Wolfram|Alpha. If you'd like, the error message given by MathJS is as follows:\n" + e);
        var encodedQuery = encodeURIComponent(input);
        var queryURL = util.format(URL, encodedQuery);

        // loader
        $(".output").html("<div class='loader-inner ball-scale-ripple' id='loader'><div><span></span></div></div>");
        resizeWindow(true);

        progress(request(queryURL))
            .on('progress', function(state) {
                // figure something out here lol
            })
            .on('data', function(data) {
                try {
                    window.json = JSON.parse(data);
                    result = window.json[1].subpods[0];
                    var inputInterpretation = window.json[0].subpods[0].text;

                    $(".output").html("<img alt=\"" + result.text + "\" id=\"image-output\" src=\"" + result.image + "\">");
                    $("#queryInterpretation").text(inputInterpretation);
                    
                    $("#image-output").load(function() {
                        window.log("Image is ready, resizing window.")
                        resizeWindow();
                    });
                } catch (e) {
                    window.log(e.toString())

                    // try again if error
                    retry(queryURL)
                }
            })
            .on('error', function(err) {
                window.log(err.toString())

                // try again
                retry(queryURL);
            });

        window.log('Queried with: ' + queryURL);
    }
}

function retry(queryURL) {
    var input = $('#input').val();
    var result;
    window.log("Error was thrown. Attempting to query again...");

    // @gthn, design this as you need to.
    // also implement google and try again as links
    var errorMsg = "<div class=\"sorry\"></div><br/><br/>Sorry! I can't find the answer.<br/>Try looking it up on <a>Google</a> or <a>Wolfram|Alpha</a>.";

    progress(request(queryURL))
        .on("data", function(data) {
            // if there's another error, just give up
            try {
                window.json = JSON.parse(data);
                result = window.json[1].subpods[0];
                var inputInterpretation = window.json[0].subpods[0].text;

                $(".output").html("<img alt=\"" + result.text + "\" id=\"image-output\" src=\"" + result.image + "\">");
                $("#queryInterpretation").text(inputInterpretation);

                $("#image-output").load(function() {
                    window.log("Image is ready, resizing window.")
                    resizeWindow();
                });
            } catch (e) {
                $(".output").html(errorMsg)
                resizeWindow(true);
                throw e;
            }
        })
        .on('error', function(err) {
            $(".output").html(errorMsg)
            resizeWindow(true);
            throw err;
        });
}
