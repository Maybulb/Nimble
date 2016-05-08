# <img src="http://i.imgur.com/cxoAh6L.png" width="80%">

Seamless Wolfram-Alpha® in your OS X menubar.

> “The menubar client is every bit as intuitive as the web interface, meaning it’s easy to use...” – [TheNextWeb](http://thenextweb.com/insider/2016/02/08/nimble-brings-wolfram-alpha-to-your-menubar-on-os-x/)

> “Nimble can handle pretty much anything you’d normally throw at Wolfram Alpha...” – [LifeHacker](http://lifehacker.com/nimble-crams-wolfram-alpha-into-your-macs-menu-bar-1758071364)

## Installation

[Download Nimble](https://github.com/madebybright/Nimble/releases/latest), mount the .dmg, and move it to your Applications. You can open it by clicking on its menubar icon, or by using the <kbd>⌘</kbd> <kbd>Shift</kbd> <kbd>=</kbd> hotkey.

## Development
Electron and gulp required to be installed on your machine (`npm install -g electron-prebuilt gulp`). You'll also need a [Wolfram Alpha API Key](http://products.wolframalpha.com/api/).

Clone the repository, install dependencies, then run gulp.

```bash
git clone https://github.com/madebybright/Nimble.git

# cd into the directory and install dependencies
cd Nimble && npm install
```

Create `src/js/key.json` for your key.

```js
{ "api": "KEY" }
 ```

Run electron in the project directory to get it up and running.

```
# Compiles Sass and starts (gulp && electron .)
npm start
```

## Packaging/Bundling
If you'd like to package Nimble as an app, or build it as a DMG, you can use our gulp tasks.

```bash
gulp package # nimble -> .app
gulp build # .app -> .dmg
```

If you're bundling it, make sure to package it beforehand so that the `.app` exists for the disk image.

## Checklist
- [x] Fix overflow problem
- [x] Add Random Placeholder Query Suggestions
  - [x] Make it fade between placeholders every few seconds or so (no animation, impossible)
- [x] Add search button
- [x] Clean up request
- [x] Improve file structure/skeleton
- [x] Right click icon to exit
  - [x] Provide mini menu for Preferences and Exit
- [x] Add math.js support
  - [x] Allow option for query to be processed with W|A if it's first processed with math.js
- [x] Add error messages
	- [x] Style error messages (@gthn)
- [x] Graphing?
- [x] Indeterminate Loading indicator
- [ ] Add auto-updating ([Electron provides a module built on Squirrel](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md))
- [ ] Add URL Scheme (and Alfred workflow to go with it)
- [x] Change initial position of where Nimble loads (the x and y values) [Centre Maybe?]
- [x] Always offer a link to the Wolfram|Alpha page at the bottom

## Contribution
Want to make a contribution? Fork the repo, add your changes, and submit a pull request. Any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated!

## Special Thanks To...
- Stephen Wolfram, for creating the wonderfully frustrating [Wolfram|Alpha®](http://www.wolframalpha.com/)
- All of the wonderful open source software we use with Nimble, viewable in [package.json](https://github.com/madebybright/Nimble/blob/master/package.json)
    - Specifically, we'd like to thank the packages [math.js](http://mathjs.org/), [menubar](https://github.com/maxogden/menubar), and [wolfram-alpha](https://www.npmjs.com/package/wolfram-alpha) for making the bulk of this project possible.
- Lastly, we'd like to thank everyone who's supported us from day one.
    - Ethan would like to thank Lucas Steuber of [LanguageCraft](http://portlandlanguagecraft.com/), as well as the rest of the Bright team, Trevor, Logan, Aaron, and [/r/webdev](http://reddit.com/r/webdev) on Reddit.

## License
Nimble is licensed under [Creative Commons Attribution-NonCommercial 4.0](https://github.com/madebybright/Nimble/blob/master/LICENSE.md).
