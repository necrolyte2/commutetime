#!/bin/bash

THIS=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)
cd $THIS

export PATH=/usr/local/bin:/bin:/sbin:/usr/bin:/usr/sbin

export PATH=$PATH:$(pwd)/casperjs/bin:$(pwd)/phantomjs/bin
./makemaps.py
