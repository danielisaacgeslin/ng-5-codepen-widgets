#!/bin/bash
cd "$(dirname "$0")"
INSTALL_DIRECTORY=`pwd`
echo -e "\n\x1B[0;32mSeedtag local environment will be installed in "$INSTALL_DIRECTORY"\x1B[0m"
read -p "[Enter] if OK, [Ctrl+C] for abort"
echo

repositories=(
"backoffice"
"publisher-panel"
"studio"
"user-service"
"sherlock-service"
"email-service"
"tag-manager-service"
"tagging-service"
"adserver-proxy-service"
"event-bigdata-service"
"error-service"
"watson-service"
"campaign-service"
"gohan"
)

for repository in "${repositories[@]}"; do
  if [ ! -d "$repository" ]; then
    echo "Cloning $repository"
    git clone git@github.com:seedtag/$repository.git
  else
    echo "Skipping $repository"
  fi
done

# Studio-service specific procedure:
if [ ! -d "studio/server/ssh-keys" ]; then
# User-service specific procedure:
  mkdir studio/server/ssh-keys
fi
cp ~/.ssh/* studio/server/ssh-keys

docker-compose build

echo -e "\x1B[0;32mNow run (if you haven't already done it)\x1B[0m"
echo '        printf "127.0.0.1\tlogin.seedtag.local\n127.0.0.1\tstudio.seedtag.local\n127.0.0.1\tstudio.api.seedtag.local\n127.0.0.1\tadmin.seedtag.local\n127.0.0.1\ttms.api.seedtag.local\n127.0.0.1\tsherlock.api.seedtag.local\n127.0.0.1\ttagging.api.seedtag.local\n127.0.0.1\terrors.api.seedtag.local\n127.0.0.1\tpublishers.seedtag.local\n127.0.0.1\te2.seedtag.local\n127.0.0.1\tclient.seedtag.local\n127.0.0.1\tcampaigns.api.seedtag.local\n" | sudo tee -a /etc/hosts'
echo -e "\x1B[0;32mAnd your installation will be finished, you will be able to do 'docker-compose up' in "$INSTALL_DIRECTORY" and browse seedtag services\x1B[0m"
echo -e "\x1B[0;32mOnce everything is set up, ¡f you want to load initial data, just do 'docker-compose exec mongo mongo initial-data/user.js'\x1B[0m"
