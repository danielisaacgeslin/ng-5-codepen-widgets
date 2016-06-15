cd "$(dirname "$0")"
INSTALL_DIRECTORY=`pwd`
echo -e "\n\x1B[0;32mSeedtag local environment will be installed in "$INSTALL_DIRECTORY"\x1B[0m"
read -p "[Enter] if OK, [Ctrl+C] for abort"
echo

git clone git@github.com:seedtag/user-service.git

# User-service specific procedure:
mkdir user-service/ssh-keys
cp ~/.ssh/* user-service/ssh-keys

git clone git@github.com:seedtag/studio.git

# Studio-service specific procedure:
mkdir studio/ssh-keys
cp ~/.ssh/* studio/ssh-keys

git clone git@github.com:seedtag/backoffice.git
git clone git@github.com:seedtag/tag-manager.git

docker-compose build

echo -e "\x1B[0;32mNow run (if you haven't already done it)\x1B[0m"
echo '        printf "127.0.0.1\tlogin.seedtag.local\n127.0.0.1\tstudio.seedtag.local\n" | sudo tee -a /etc/hosts'
echo -e "\x1B[0;32mAnd your installation will be finished, you will be able to do 'docker-compose up' in "$INSTALL_DIRECTORY" and browse seedtag services\x1B[0m"
