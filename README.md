Nimble
======
<img align="right" width="20%" style="float:right;padding:20px;" src="https://github.com/madebybright/madebybright.github.io/raw/master/img/nimble/256.png">

A Wolfram|Alpha® menu bar application, built with the wonderful [Electron](http://electron.atom.io/).

For the Xcode (Swift) build of the same name, see [Nimble-Swift](https://github.com/madebybright/Nimble-Swift).

## Development
Electron and gulp required to be installed on your machine. Clone the repository, install dependencies, run gulp, then run electron in the project directory.

```bash
git clone https://github.com/madebybright/Nimble.git

# cd into the directory and install dependencies
cd Nimble && npm install

# Compiles Sass and starts (gulp && electron .)
npm start
```

## Checklist
- [x] Fix overflow problem
- [x] Add Random Placeholder Query Suggestions
- [x] Add search button
- [x] Clean up request
- [ ] Add content-dynamic window support
- [x] Improve file structure/skeleton
- [ ] Right click on the icon -> Preferences and Exit
- [ ] Change initial position of where Nimble loads (the x and y values)
- [ ] Add math.js support
  - [ ] Allow option for query to be processed with W|A if it's first processed with math.js
- [ ] Add error messages
- [ ] Graphing?
- [ ] Loading indicator
- [ ] Always offer a link to the Wolfram|Alpha page at the bottom
- [ ] Un-round the top border

## Far Future Additions
Some ideas we've been kicking around that we think might have a spot in future versions of Nimble once we've actually gotten it working.

- Quick timezone conversions (possibly with Moment.js)

## Contribution
Want to make a contribution? Fork the repo, add your changes, and submit a pull request. Any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated!

## License
[LICENSE](https://github.com/madebybright/Nimble/blob/master/LICENSE)
