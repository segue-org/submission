#!/bin/bash

BASE=`pwd`
INDEX="$BASE/app/index.html"
DIST="$BASE/dist"

cd $DIST

# vendor:css
VENDOR_CSS=`find . -iname '*.css' | cut -b 3-`

echo $VENDOR_CSS
