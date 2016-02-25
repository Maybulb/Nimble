Nimble
======
<img align="right" width="20%" style="float:right;padding:20px;" src="https://raw.githubusercontent.com/madebybright/Nimble/master/assets/512.png">

The cross-platform personal assistant that just works. Built with the wonderful [Electron](http://electron.atom.io/), as well as many useful libraries. [Follow us on Twitter for updates](https://twitter.com/madebybright).

For the Xcode (Swift) build of the same name, see [Nimble-Swift](https://github.com/madebybright/Nimble-Swift).

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
{
  "api": "KEY"
}
 ```

Run electron in the project directory to get it up and running.

```
# Compiles Sass and starts (gulp && electron .)
npm start
```

## Packaging/Bundling
If you'd like to package Nimble as an app, or bundle it as a DMG, you can use our gulp tasks.

```bash
gulp package # nimble -> .app
gulp bundle # .app -> .dmg
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
- [x] Change initial position of where Nimble loads (the x and y values) [Centre Maybe?]
- [x] Always offer a link to the Wolfram|Alpha page at the bottom

## Far Future Additions
Some ideas we've been kicking around that we think might have a spot in future versions of Nimble once we've actually gotten it working.

- Quick timezone conversions (possibly with Moment.js)
- Possible natural language for simple queries

## Contribution
Want to make a contribution? Fork the repo, add your changes, and submit a pull request. Any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated!

## Special Thanks To...
- Stephen Wolfram, for creating the wonderfully frustrating [Wolfram|Alpha®](http://www.wolframalpha.com/)
- All of the wonderful open source software we use with Nimble, viewable in [package.json](https://github.com/madebybright/Nimble/blob/master/package.json)
    - Specifically, we'd like to thank the packages [math.js](http://mathjs.org/), [menubar](https://github.com/maxogden/menubar), and [wolfram-alpha](https://www.npmjs.com/package/wolfram-alpha) for making the bulk of this project possible.
- Lastly, we'd like to thank everyone who's supported us from day one.
    - Ethan would like to thank Lucas Steuber of [LanguageCraft](http://portlandlanguagecraft.com/), as well as the rest of the Bright team, Trevor, Logan, Aaron, and [/r/webdev](http://reddit.com/r/webdev) on Reddit.

## License
[LICENSE](https://github.com/madebybright/Nimble/blob/master/LICENSE.md)

![Tag](http://i.imgur.com/etWLNKJ.gif) ![Tag](http://i.imgur.com/c4J95hH.gif) ![Tag](http://i.imgur.com/Sl7UbNI.gif) ![Tag](http://i.imgur.com/xaoeuKp.gif)
