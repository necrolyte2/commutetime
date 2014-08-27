#!/usr/bin/env python

import os
from os.path import *
import subprocess
from datetime import datetime
import shutil
import sys

start = "946 19th Ave NE, Minneapolis, MN 55418"
ends = (
    'Deephaven, MN',
    'Eden Prairie, MN',
    'St Paul, MN',
    'Maplewood, MN',
    'Burnsville, MN',
    'Golden Valley, MN',
    '405 S 8th St, Minneapolis, MN',
    'Bloomington, MN',
    '100 Melbourne Ave SE, Minneapolis, MN'
)

now = datetime.now();
nowstr = now.strftime('%d_%m_%Y_%H_%M')

THIS = dirname(abspath(__file__))
os.environ['PATH'] += os.pathsep + os.pathsep.join([join(THIS,pth,'bin') for pth in ('casperjs','phantomjs')])
basecmd = 'casperjs maps_directions.js "{start}" "{end}"'

mapdir = 'maps_{}'.format( nowstr )
if not isdir(mapdir):
    os.makedirs(mapdir)

def domap( begin, end ):
    if exists('directions.png'):
        os.unlink('directions.png')

    # Will hold the output string of path,commutetime,distance
    sout, serr = (None,None)
    while True:
        print "Getting commute time for {} to {}".format(begin,end)
        try:
            p = subprocess.Popen( basecmd.format(start=begin, end=end), shell=True, stderr=subprocess.PIPE, stdout=subprocess.PIPE )
            sout, serr = p.communicate()
        except subprocess.CalledProcessError as e:
            print "Error? " + e.output
            continue
        except OSError as e:
            if e.errno == 2:
                print "Is casperjs and phantomjs in your environment's PATH?"
                sys.exit(-1)

        # Check to see if the stupid wait timeout happened
        if exists('directions.png') and sout and 'timeout of' not in sout and 'null' not in sout:
            shutil.copy( 'directions.png', join(mapdir,'directions_{}.png'.format(i) ) )
            return '"{} to {}","'.format(begin,end) + '","'.join( sout.rstrip().split(',') ) + '","' + nowstr + '"'
        else:
            print "Trying again..."
            pass

outputs = []
for i, to in enumerate(ends,start=1):
    if now.hour < 14:
        outputs.append( domap( start, to ) )
    else:
        # In the pm reverse the commute
        outputs.append( domap( to, start ) )

with open(nowstr+'.csv','w') as fh:
    fh.write( '\n'.join( outputs ) )
    fh.write( '\n' )
