npm install -g yarn
sudo rm -rf /var/www/html/*
git pull --progress -v --no-rebase "origin"
yarn install
yarn build
sudo cp -R build/* /var/www/html
echo "Deploy successful"
