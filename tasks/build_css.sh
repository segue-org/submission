#!/bin/bash

BASE=`pwd`

COPY="gcp"
SASS="$BASE/node_modules/node-sass/bin/node-sass"

DIST="$BASE/dist/styles"
APP="$BASE/app"

mkdir -p $DIST

cd $APP
# custom styles
$SASS --stdout modules/styles/*.scss > $DIST/custom.css

# vendor scripts
$COPY -v --parents bower_components/font-awesome/css/font-awesome.min.css $DIST

cd -
