Nimble
======
<img align="right" width="20%" style="float:right;padding:20px;" src="https://github.com/madebybright/madebybright.github.io/raw/master/img/nimble/256.png">

A Wolfram|Alpha® menu bar application, built with the wonderful [Electron](http://electron.atom.io/).

For the Xcode (Swift) build of the same name, see [Nimble-Swift](https://github.com/madebybright/Nimble-Swift).

## Development
Electron and gulp required to be installed on your machine. Clone the repository, install dependencies, run gulp, then run electron in the project directory.

```bash
git clone https://github.com/madebybright/Nimble

# cd into the directory and install dependencies
cd Nimble && npm install

# Run gulp to compile files
gulp

# Run electron to start
electron .
```

Alternatively, you can skip gulp and electron with npm.

```bash
# Runs gulp to compile and electron to start
npm start
```

## Checklist
- [ ] Clean up request
- [ ] Fix overflow problem
- [x] Add Random Placeholder Query Suggestions
- [ ] Add content-dynamic window support
- [ ] Improve file structure/skeleton
- [ ] Right click on the icon -> Preferences and Exit
- [ ] Add search button

## Contribution
Want to make a contribution? Fork the repo, add your changes, and submit a pull request. Any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated!

## License
[LICENSE](https://github.com/madebybright/Nimble/blob/master/LICENSE)
