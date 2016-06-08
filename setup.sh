DEFAULT_INSTALL_DIR=~/seedtag

echo -e "\x1B[0;33mDocker toolbox (https://www.docker.com/products/docker-toolbox) is needed to run seedtag"
echo -e "Where do you want to install your Seedtag local environment? ["$DEFAULT_INSTALL_DIR"]"
echo -e "Please, make sure you enter an absolute path\x1B[0m"
read INSTALL_DIRECTORY

if [ -z "$INSTALL_DIRECTORY" ]; then
  INSTALL_DIRECTORY=$DEFAULT_INSTALL_DIR
fi

echo -e "\n\x1B[0;32mSeedtag local environment will be installed in "$INSTALL_DIRECTORY

if [ -d "$INSTALL_DIRECTORY" ]; then
  read -p "The directory "$INSTALL_DIRECTORY" already exists [Enter] to override, [Ctrl+C] for abort"
  echo -e "\x1B[0m"
else
  mkdir -p $INSTALL_DIRECTORY
  echo -e $INSTALL_DIRECTORY" directory created\x1B[0m"
fi

cp docker-compose.yml $INSTALL_DIRECTORY/docker-compose.yml
cp -R nginx $INSTALL_DIRECTORY/nginx

cd $INSTALL_DIRECTORY

git clone git@github.com:seedtag/user-service.git

# User-service specific procedure:
mkdir user-service/ssh-keys
cp ~/.ssh/* user-service/ssh-keys

git clone git@github.com:seedtag/studio.git
git clone git@github.com:seedtag/backoffice.git
git clone git@github.com:seedtag/tag-manager.git

docker-compose build

echo -e "\x1B[0;32mNow run (if you haven't already done it)\x1B[0m"
echo '        printf "127.0.0.1\tlogin.seedtag.local\n127.0.0.1\tstudio.seedtag.local\n" | sudo tee -a /etc/hosts'
echo -e "\x1B[0;32mAnd you installation will be finished, you will be able to do 'docker-compose up' in "$INSTALL_DIRECTORY" and browse seedtag services\x1B[0m"
