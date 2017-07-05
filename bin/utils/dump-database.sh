#!/bin/bash

BACKUP_NAME="backup-"`date +%Y%m%d`
COLLECTIONS=(blacklist campaign customcategories email reporting seedtag_new studio user audit)
SERVER=mongodb1-instance-2

ssh $SERVER "rm -Rf $BACKUP_NAME"

for collection in "${COLLECTIONS[@]}"; do
    ssh $SERVER "mongodump --gzip -d $collection -o $BACKUP_NAME"
done

ssh $SERVER "mongodump --gzip -d analytics -c PublisherReportData -o $BACKUP_NAME"

echo "Transfering backup"
rsync --progress -a $SERVER:$BACKUP_NAME initial-data

echo "Done! Saved as $BACKUP_NAME"
