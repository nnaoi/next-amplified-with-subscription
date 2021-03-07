#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script develop\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"nnaoi-amplify\",\
\"accessKeyId\":\"$AWS_ENV_ACCESS_KEY_ID\",\
\"secretAccessKey\":\"$AWS_ENV_SECRET_ACCESS_KEY\",\
\"region\":\"ap-northeast-1\"\
}"
AMPLIFY="{\
\"projectName\":\"nextamplified\",\
\"appId\":\"$AWS_APP_ID\",\
\"envName\":\"$AWS_ENV_NAME\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes