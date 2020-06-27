# <img src="http://i.imgur.com/cxoAh6L.png" width="80%">

Seamless Wolfram-Alpha® in your OS X menubar.

> “The menubar client is every bit as intuitive as the web interface, meaning it’s easy to use...” – [The Next Web](http://thenextweb.com/insider/2016/02/08/nimble-brings-wolfram-alpha-to-your-menubar-on-os-x/)

> “Nimble can handle pretty much anything you’d normally throw at Wolfram Alpha...” – [Lifehacker](http://lifehacker.com/nimble-crams-wolfram-alpha-into-your-macs-menu-bar-1758071364)

## Notice of Deprecation
Nimble is **deprecated as of June 2020.** Within the current version are multiple privacy concerns (BugSnag bug reporting is on by default) and outdated dependencies. Really, we **don't think you should run Nimble as it is today.** If you must run it, compile it at your own risk following the development guide. 

## Development
Electron and gulp required to be installed on your machine (`npm install -g electron-prebuilt gulp`), as well as the Xcode Command Line Tools. You'll also need a [Wolfram Alpha API Key](http://products.wolframalpha.com/api/).

Clone the repository, install dependencies, then run gulp.

```bash
git clone https://github.com/Maybulb/Nimble.git

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
If you'd like to package Nimble, you can use our Gulp task for building Nimble.

```bash
gulp build # packages and builds Nimble into a ZIP and a DMG
sh clean-build.sh # clean build, reinstalls node modules and such
```

If you're bundling it, make sure to package it beforehand so that the `.app` exists for the disk image.

## Contribution
Want to make a contribution? Fork the repo, add your changes, and submit a pull request. Any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated!


## License
Nimble is licensed under [Creative Commons Attribution-NonCommercial 4.0](https://github.com/Maybulb/Nimble/blob/master/LICENSE.md).
