# clean build
node_version=$(node -v)
echo $node_version
n 5.11.1
node -v
git pull
rm -rf node_modules/
rm -rf options.json
npm install
gulp build
n "$node_version"