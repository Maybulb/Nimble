# clean build
node_version=$(node -v)
echo $node_version
n 5.11.1
node -v
git pull
rm -rf node_modules/
npm install
gulp sass
gulp package
codesign --deep --force --verbose --sign "$CODESIGN_KEY" Nimble-darwin-x64/Nimble.app
codesign --verify -vvvv Nimble-darwin-x64/Nimble.app
gulp build
n "$node_version"