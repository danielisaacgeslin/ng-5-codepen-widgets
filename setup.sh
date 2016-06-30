cd "$(dirname "$0")"
INSTALL_DIRECTORY=`pwd`
echo -e "\n\x1B[0;32mSeedtag local environment will be installed in "$INSTALL_DIRECTORY"\x1B[0m"
read -p "[Enter] if OK, [Ctrl+C] for abort"
echo

repositories=("backoffice" "tag-manager" "studio" "user-service" "sherlock-service" "email-service" "tag-manager-service")

for repository in "${repositories[@]}"; do
  if [ ! -d "$repository" ]; then
    echo "Cloning $repository"
    git clone git@github.com:seedtag/$repository.git
  else
    echo "Updating $repository"
    cd $repository
    git checkout master
    git pull
    cd ..
  fi
done

if [ ! -d "user-service/ssh-keys" ]; then
# User-service specific procedure:
  mkdir user-service/ssh-keys
fi
cp ~/.ssh/* user-service/ssh-keys

# Studio-service specific procedure:
if [ ! -d "studio/server/ssh-keys" ]; then
# User-service specific procedure:
  mkdir studio/server/ssh-keys
fi
cp ~/.ssh/* studio/server/ssh-keys

docker-compose build

echo -e "\x1B[0;32mNow run (if you haven't already done it)\x1B[0m"
echo '        printf "127.0.0.1\tlogin.seedtag.local\n127.0.0.1\tstudio.seedtag.local\n" | sudo tee -a /etc/hosts'
echo -e "\x1B[0;32mAnd your installation will be finished, you will be able to do 'docker-compose up' in "$INSTALL_DIRECTORY" and browse seedtag services\x1B[0m"
