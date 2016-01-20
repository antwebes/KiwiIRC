#!/bin/bash
chmod 600 /root/.ssh/*
echo "git archive --format=zip --remote=git@bitbucket.org:$REPOSITORY $WEB_CONFIG_BRANCH:$WEB_CONFIG_APP config.js | gunzip > config.js"
git archive --format=zip --remote=git@bitbucket.org:$REPOSITORY $WEB_CONFIG_BRANCH:$WEB_CONFIG_APP config.js | gunzip > config.js

./kiwi build
npm start