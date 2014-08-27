Install

1. Download and unpack casperjs
    
    ```
    git clone https://github.com/n1k0/casperjs.git
    ```
    
2. Install phantomjs
    
    ```
    wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-linux-x86_64.tar.bz2 -O - | tar xjvf -
    ln -s phantomjs-1.9.7* phantomjs
    ```
3. Put casperjs and phantomjs in your path
    
    ```
    export PATH=$PATH:$(pwd)/casperjs/bin:$(pwd)/phantomjs/bin
    ```

Running maps_directions.js with capser manually

```
casperjs maps_directions.js "some start location" "some end location"
```

Will produce directions.png with just the snippet of the top left of the google map with directions that shows time and distance

Run the makemaps.py

Just run makemaps.py
It will create a maps_DD_MM_YYYY_HH_MM directory and put an image of each of the commute times called directions_#.png where the # is the index of the item in the makemaps.py end tuple(1-indexed)
Then it will put all commute times in a nice csv file named DD_MM_YYYY_HH_MM.csv

You can also add cron.sh to your crontab and run it every 15 minutes and it will just keep compiling results into this directory


TODO:

* Instead of individual csv files for every run, might be nice to put the data into a sqlite db
* Look into using Google Maps API instead of this silly capserjs/phantomjs business
