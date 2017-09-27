#!/bin/bash

BACKUP_NAME="backup-"`date +%Y%m%d`
COLLECTIONS=(blacklist campaign customcategories email reporting seedtag_new studio user audit)
SERVER=mongodb1-instance-2

gcloud compute ssh $SERVER -- "rm -Rf $BACKUP_NAME"

for collection in "${COLLECTIONS[@]}"; do
  gcloud compute ssh $SERVER -- "mongodump --gzip -d $collection -o $BACKUP_NAME"
done

### START: ANALYTICS DUMPS (Aprox 3,5 minutes of dump) (Aprox 5,5 minutes of restore)

# ANALYTICS_DATE='20170921'
# AGGREGATION_QUERY_DATE="\"{ \\\"_id.date\\\": { \\\"\\\$gt\\\": '$ANALYTICS_DATE' } }\""
# BIG_AGGREGATIONS_QUERY_TagManagerUrlCoverage="\" { \\\"_id.date\\\": { \\\"\\\$gt\\\": '$ANALYTICS_DATE' }, \\\"_id.token\\\": { \\\"\\\$regex\\\": '^(32).*' } } \""
# # TOO BIG BIG_AGGREGATIONS_QUERY_PivotData="\"{ \\\"_id.date\\\": { \\\"\\\$gt\\\": '$ANALYTICS_DATE' }, \\\"_id.token\\\": { \\\"\\\$regex\\\": '^(3).*' } }\""
# # TOO BIG BIG_AGGREGATIONS_QUERY_AdPerformance="\"{ \\\"_id.date\\\": { \\\"\\\$gt\\\": '$ANALYTICS_DATE' }, \\\"_id.token\\\": { \\\"\\\$regex\\\": '^(25).*' } }\""
#
# ANALYTICS_AGGREGATION_COLLECTIONS=(FunnelSafety Inventory Bidding Times Video Publisher TagManagerCoverage)
# for aggregation in "${ANALYTICS_AGGREGATION_COLLECTIONS[@]}"; do
#   gcloud compute ssh $SERVER -- "mongodump --gzip -d analytics -c StatBase_$aggregation --query $AGGREGATION_QUERY_DATE -o $BACKUP_NAME"
# done
#
# gcloud compute ssh $SERVER -- "mongodump --gzip -d analytics -c StatBase_TagManagerUrlCoverage --query $BIG_AGGREGATIONS_QUERY_TagManagerUrlCoverage -o $BACKUP_NAME"
# # TOO BIG gcloud compute ssh $SERVER -- "mongodump --gzip -d analytics -c StatBase_PivotData --query $BIG_AGGREGATIONS_QUERY_PivotData -o $BACKUP_NAME"
# # TOO BIG gcloud compute ssh $SERVER -- "mongodump --gzip -d analytics -c StatBase_AdPerformance --query $BIG_AGGREGATIONS_QUERY_AdPerformance -o $BACKUP_NAME"
#
# REPORT_DATA_QUERY_DATE="\"{ \\\"dateAndHour\\\": { \\\"\\\$gt\\\": '2017-09-18 00:00' } }\""
# gcloud compute ssh $SERVER -- "mongodump --gzip -d analytics -c AdserverReportData --query $REPORT_DATA_QUERY_DATE -o $BACKUP_NAME"
# gcloud compute ssh $SERVER -- "mongodump --gzip -d analytics -c PublisherReportData --query $REPORT_DATA_QUERY_DATE -o $BACKUP_NAME"
# gcloud compute ssh $SERVER -- "mongodump --gzip -d analytics -c TopUrl -o $BACKUP_NAME"
#
### END: ANALYTICS DUMPS

echo "Transfering backup"
gcloud compute scp $SERVER:$BACKUP_NAME initial-data --recurse

echo "Done! Saved as $BACKUP_NAME"
