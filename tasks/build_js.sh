#!/bin/bash

COPY="gcp"

BASE=`pwd`
DIST="$BASE/dist"
APP="$BASE/app"

mkdir -p $DIST

# custom scripts
cd $APP
$COPY -v --parents          \
  modules/controllers/*.js  \
  modules/*.js              \
  config.js                 \
  $DIST

# vendor scripts
find . -name '*?min.js' | xargs $COPY -v --parents -t $DIST
cd -
