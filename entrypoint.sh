#!/bin/bash
echo "git archive --format=zip --remote=git@bitbucket.org:$REPOSITORY $WEB_CONFIG_BRANCH:$WEB_CONFIG_APP config.js | gunzip > config.js"
git archive --format=zip --remote=git@bitbucket.org:$REPOSITORY $WEB_CONFIG_BRANCH:$WEB_CONFIG_APP config.js | gunzip > config.js

npm start