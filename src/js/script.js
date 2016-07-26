var $ = require('jquery'),
    util = require('util'),
    rand = require('rand-paul'),
    electron = require('electron'),
    format = require('string-format'),
    key = require('./js/key.json'),
    os = require('os'),
    wolfram = require('wolfram-alpha').createClient(key.api, {
        width: 348,
        maxwidth: 380
    }),
    math = require("mathjs"),
    Shell = electron.shell,
    msg = new SpeechSynthesisUtterance(),
    clipboard = electron.clipboard,
    nativeImage = electron.nativeImage,
    ipcRenderer = electron.ipcRenderer,
    URL = "https://nimble-backend.herokuapp.com/input?i=%s",
    unicode = /(?:\\:)(([a-z]|[0-9])+)/g,
    imagesLoaded = require('imagesloaded'),
    WebFrame = require('web-frame');

window.suggestions = getSuggestions();

function getSuggestions() {
    var suggestions = [];
    var defaultSuggestions = require('./js/suggestions.json');
    suggestions = suggestions.concat(defaultSuggestions);
    try {
        if (window.options.enableDefaultSuggestions === false) {
            suggestions.length = 0;
        }
        if (window.options.customSuggestions) {
            suggestions = suggestions.concat(rc.customSuggestions);
        }
    } catch(err) {
        Bugsnag.notifyException(err);
    }
    if (!suggestions.length) {
        suggestions.push('');
    }
    return suggestions;
}

var clipboardCopy = {
    link: function() {
        clipboard.writeText(window.links.wolfram);
    },
    text: function() {
        if ($(".image-output").length) {
            clipboard.writeText(backdoor.unicodeRegex(window.json[window.imgHover[0]].subpods[window.imgHover[1]].text)[1]);
        } else {
            clipboard.writeText($("#output").text())
        }
    },
    image: function() {
        // send with ipc to index.js, for now a WIP
        var image = nativeImage.createFromPath(webContents.downloadURL(window.json[1].subpods[0].image))
        clipboard.writeImage(image);
    }
}

// share buttons
var shareButton = {
    twitter: function() {
        var tweet = $("#input").val() + ":\n" + window.links.wolfram + " (via @nimbledotapp)";
        Shell.openExternal("https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet))
    }
}

function defaults(test, fallback) {
    return typeof test !== 'undefined' ? test : fallback;
}

// options
var preferences = {
    save: function() {
        var submenu = menuthing.items[menuthing.items.length - 1].submenu.items;
        var themeMenu = menuthing.items[menuthing.items.length - 2].submenu.items;
        
        window.options = {
            mathjs: defaults(submenu[0].checked, true),
            startup: defaults(submenu[1].checked, true),
            center: defaults(submenu[2].checked, false),
            bugreport: defaults(submenu[3].checked, true),
            autoupdate: defaults(submenu[4].checked, true),
            theme: {
                "red": themeMenu[0].checked,
                "orange": themeMenu[1].checked,
                "yellow": themeMenu[2].checked,
                "green": themeMenu[3].checked,
                "blue": themeMenu[4].checked,
                "purple": themeMenu[6].checked,
                "pink": themeMenu[5].checked,
                "contrast": themeMenu[7].checked
            },
            enableDefaultSuggestions: defaults(submenu[5].checked, true),
            customSuggestions: defaults(window.options.customSuggestions, [])
        };

        ipcRenderer.send("save_options", JSON.stringify(window.options, null, "  "));

        preferences.theme();
    },
    theme: function() {
        if (window.options.theme["red"] === true) {
            $("#style").attr("href", "css/colours/red.css")
        } else if (window.options.theme["contrast"] === true) {
            $("#style").attr("href", "css/highcontrast.css")
        } else if (window.options.theme["orange"] === true) {
            $("#style").attr("href", "css/style.css")
        } else if (window.options.theme["yellow"] === true) {
            $("#style").attr("href", "css/colours/bright-yellow.css")
        } else if (window.options.theme["green"] === true) {
            $("#style").attr("href", "css/colours/green.css")
        } else if (window.options.theme["blue"] === true) {
            $("#style").attr("href", "css/colours/blue.css")
        } else if (window.options.theme["purple"] === true) {
            $("#style").attr("href", "css/colours/purple.css")
        } else if (window.options.theme["pink"] === true) {
            $("#style").attr("href", "css/colours/pink.css")
        }
    }
};

// most misc backdoor/electron/helper functions here
var backdoor = {
    resizeWindow: function(error) {
        var h = $("body").height();
        var w = $(".output").width() + 32;

        if (w < 380 && error !== true) {
            w = 380;
        }

        ipcRenderer.send("resize", {
            height: h,
            width: w
        });
    },
    speak: function(text) {
        msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1
        msg.rate = 0.8; // 0.1 to 10
        msg.pitch = 1; //0 to 2
        msg.text = text;
        msg.lang = 'en-UK';

        console.log("Nimble just said \"" + text + "\" using the Speech Synthesizer.")
        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
    },
    unicodeRegex: function(text) {
        // html encoded unicode string (&#unicode;)
        var newHtml = text.replace(unicode, function(match, p1, p2) {
            return "&#" + parseInt(p1, 16).toString(10) + ";";
        });

        // plain ol straight unicode string (used for copying to clipboard)
        var newText = text.replace(unicode, function(match, p1, p2) {
            return String.fromCodePoint(parseInt(p1, 16).toString(10))
        });

        return [newHtml, newText]
    }
}

var loader = function(state) {
    if (state === true) {
        $("div.input i").slideUp(200, function() {
            $("div.input i").attr("class", "fa fa-refresh").attr("disabled", "disabled").addClass("animateLoader");
        }).slideDown(500);
        ipcRenderer.send("reset-window");
    } else {
        $("div.input i").slideUp(200, function() {
            $("div.input i").attr("class", "fa fa-search").removeAttr("disabled").removeClass("animateLoader");
        }).slideDown(500);
        backdoor.resizeWindow();
    }
}

// error forwarding
var _windowonerror = window.onerror;
window.onerror = function(e) {
    ipcRenderer.send('node_console', {
        m: e
    });
    if (typeof _windowonerror === 'function') {
        _windowonerror.apply(this, arguments);
    }
}

var _consolelog = console.log.bind(console);
console.log = function log(message) {
    ipcRenderer.send('node_console', {m: message});
    _consolelog(message);
};

// check if everything is alright before querying wolfram
function preQuery() {
    if ($('#input').val() !== "") {
        query();
    } else if ($('#input').val() === "") {
        // save current placeholder
        var currentPlaceholder = $("#input").attr('placeholder');
        
        // ask user to use their words
        $("#input").attr('placeholder', "Error: Use your words.");

        // go back to placeholders
        window.setTimeout(function() {
            $('#input').attr('placeholder', currentPlaceholder);
        }, 3000);
    }
}

$(document).keypress(function(event) {
    // if the key ya pressed is enter, start to query
    if(event.which === 13) {
        preQuery();
    }
});

$(document).keydown(function(event) {
    // placeholder plop
    if(event.which === 39 && $("#input").val() === "") {
        $("#input").val($("#input").attr("placeholder"))
    }
});

$(document).ready(function() {
    function newPlaceholder() {
        // set placeholder
        var placeholder = rand.paul(window.suggestions);
        $('#input').attr('placeholder', placeholder);
    }

    setInterval(newPlaceholder, 10000);

    // search button
    $("#input").keyup(function() {
        if (this.value == "") {
            $(".input button").css("opacity", "0.7");
        } else {
            $(".input button").css("opacity", "1");
        }
    });

    // on window open select the input for conveinence
    ipcRenderer.on("window-open", function() {
        $("#input").focus().select();
    });

    ipcRenderer.on("log", function(m) {
        _consolelog(m)
    }) 

    ipcRenderer.on("error", function(e) {
        _consolelog("Error from backend:" + e)
    })

    ipcRenderer.on("did-save-options", function(e) {
        window.suggestions = getSuggestions();
        newPlaceholder();
    });

    // on right click
    ipcRenderer.on("tray-rightclick", function() {
        // pop up menu
        menuthing.popup(remote.getCurrentWindow());
    });

    // make image loaded checker a jquery plugin for god's sake
    imagesLoaded.makeJQueryPlugin($);

    // set zoom level limits
    WebFrame.setZoomLevelLimits(1,1);

    // set theme
    preferences.theme();
});

// main shit here boys
var query = function() {
    var input = $('#input').val();
    var result;

    var encodedQuery = encodeURIComponent(input);
    var queryURL = util.format(URL, encodedQuery);

    window.links = {
        wolfram: "http://www.wolframalpha.com/input/?i=" + encodedQuery
    };

    // in this try block, we try mathjs
    try {
        if (window.options.mathjs === true) {
            result = math.eval(input);
            if (math.typeof(result) === "Function") {
                throw(new Error("Math.js is sending us a function again..."));
            } else {
                result = result.toString();
            }
        } else if (window.options.mathjs === false) {
            throw(new Error("Math.js has been disabled by the user."))
        }

        $("#output").html(result);
        $(".interpret, #wolfram-credit").css("display", "none");
        backdoor.resizeWindow();

        // speak result if speech is on
        if(window.options.speech === true) {
            backdoor.speak($('#output').text())
        }
    } catch (e) {
        // if input isn't math throw error and use wolfram code
        console.log("Input is not math. Using Wolfram|Alpha. If you'd like, the error message given by MathJS is as follows:\n" + e);
        var encodedQuery = encodeURIComponent(input);
        var queryURL = util.format(URL, encodedQuery);

        window.links = {
            // google: "https://www.google.ca/#q=" + encodedQuery,
            wolfram: "http://www.wolframalpha.com/input/?i=" + encodedQuery
        };

        // loader
        loader(true);

        wolfram.query(input, function(err, queryResult) {
            try {
                window.json = queryResult;

                var inputInterpretation = backdoor.unicodeRegex(window.json.shift().subpods[0].text)[0];
                
                $(".interpret, #wolfram-credit").css("display", "block");
                $("#wolframlink").attr("onclick", "Shell.openExternal(\"" + window.links.wolfram + "\");");
                $("#queryInterpretation").html(inputInterpretation);

                var output = "";

                // look through each pod
                for (i = 0; i !== window.json.length; i++) {
                    // title each pod
                    if (window.json.length !== 1) {
                        output += "<h3>" + window.json[i].title + "</h3>"
                    }

                    // look through the subpods of each pod
                    for (j = 0; j !== window.json[i].subpods.length; j++) {
                        // add each subpod
                        // sidenote: the onmouseover thing is a hacky solution
                        //           that tells the copy plaintext function what 
                        //           subpod's text to copy based on what you're hovering over

                        output += "<img onmouseover='window.imgHover = [" + i + "," + j + "]' alt=\"" + window.json[i].subpods[j].text + "\" class=\"image-output\" src=\"" + window.json[i].subpods[j].image + "\">";

                        // if the for loop hasn't reached it's last subpod, 
                        // remember to put in a line break because the images would just be on one line

                        if (j !== window.json[i].subpods.length - 1) {
                            output += "<br>";
                        }
                    }
                }

                // set the output to inline block because whenever the error shows up it switches to block
                // hacky solutions!!! yay!
                $(".output").css("display", "inline-block");
                $("#output").html(output)

                // when all images are loaded, remember to resize the window and turn off the loader
                $("#output").imagesLoaded(function() {
                    console.log("Images are ready, resizing window.");
                    loader(false);
                    backdoor.resizeWindow();
                });
            } catch (e) {
                console.log(e.toString())

                // try again if error
                retry(input)
            }

            if (err) {
                console.log(err.toString())

                // try again
                retry(input);
            }
        });

        console.log('Queried with: ' + queryURL);
    }
}

var retry = function(input) {
    var input = $('#input').val();
    var encodedInput = encodeURIComponent(input);
    var result;

    console.log("Error was thrown. Attempting to query again...");

    var errorMsg = format("<div class=\"sorry\">&#61721;</div><p class=\"err\">Sorry! I can't find the answer.<br/>Try searching it on <a href='#' onclick='Shell.openExternal(\"{}\")'>WolframAlpha</a>.</p>", window.links.wolfram);

    wolfram.query(input, function(err, queryResult) {
        try {
            window.json = queryResult;

            var inputInterpretation = backdoor.unicodeRegex(window.json.shift().subpods[0].text)[0];
            
            $(".interpret, #wolfram-credit").css("display", "block");
            $("#wolframlink").attr("onclick", "Shell.openExternal(\"" + window.links.wolfram + "\");");
            $("#queryInterpretation").html(inputInterpretation);

            var output = "";

            // look through each pod
            for (i = 0; i !== window.json.length; i++) {
                // title each pod
                if (window.json.length !== 1) {
                    output += "<h3>" + window.json[i].title + "</h3>"
                }

                // look through the subpods of each pod
                for (j = 0; j !== window.json[i].subpods.length; j++) {
                    // add each subpod
                    // sidenote: the onmouseover thing is a hacky solution
                    //           that tells the copy plaintext function what 
                    //           subpod's text to copy based on what you're hovering over

                    output += "<img onmouseover='window.imgHover = [" + i + "," + j + "]' alt=\"" + window.json[i].subpods[j].text + "\" class=\"image-output\" src=\"" + window.json[i].subpods[j].image + "\">";

                    // if the for loop hasn't reached it's last subpod, 
                    // remember to put in a line break because the images would just be on one line

                    if (j !== window.json[i].subpods.length - 1) {
                        output += "<br>";
                    }
                }
            }

            // set the output to inline block because whenever the error shows up it switches to block
            // hacky solutions!!! yay!
            $(".output").css("display", "inline-block");
            $("#output").html(output)

            // when all images are loaded, remember to resize the window and turn off the loader
            $("#output").imagesLoaded(function() {
                console.log("Images are ready, resizing window.");
                loader(false);
                backdoor.resizeWindow();
            });
        } catch (e) {
            $(".interpret, #wolfram-credit").css("display", "none");
            $("#output").html(errorMsg)
            $(".output").css("display", "block");

            loader(false);
            backdoor.resizeWindow(true);
            throw e;
        }

        if (err) {
            $("#output").html(errorMsg)
            // couldn't get the error msg to work on inline block so I just decided to change it back and forth depending on the output
            $(".output").css("display", "block");

            backdoor.resizeWindow(true);
            loader(false);
            throw err;
        }
    });
}
