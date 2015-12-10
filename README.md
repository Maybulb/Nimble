Nimble
==
*[Tech Teen Voice]* An opinionated Wolfram|Alpha® OS X menu bar, built with the wonderful [Electron](http://electron.atom.io/).

For the Xcode (Swift) build of the same name, see [Nimble-Swift](https://github.com/madebybright/Nimble-Swift).

## Development
Nimble won't be bundled as an app for a bit but it'll still be worked on. You should try get it working on your system, and add something cool while you're at it.

```bash
git clone git@github.com:madebybright/nimble
cd Nimble
npm install
npm start
```

This'll run a Gulp process in the background so if you want to kill the process once you're done just kill all processes related to Electron.

```bash
killall Electron
```

For an alternative method (the method I'm using until I find a cleaner way of performing the above), you can try this

```bash
git clone git@github.com:madebybright/nimble
cd Nimble
gulp compile && gulp watch
```

At this point, open a new Terminal tab or prompt, etc.

```bash
electron .
```

Control-C every time you make a change and want to see an updated version of Nimble. Once changes have been made, to see the updated product, run the above again (`electron .`)

## Checklist
- [ ] Improve file structure/skeleton
