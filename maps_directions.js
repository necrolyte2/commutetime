var casper = require('casper').create({
	logLevel: "debug",
	viewportSize: {
		width: 1280,
		height: 1024
	},
    timeout: 15000
});


// Command line arguments
var from = casper.cli.get(0);
var to = casper.cli.get(1);

casper.start()
// Fake Chrome browser
casper.userAgent('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36');
// Open maps.google.com
casper.thenOpen('http://maps.google.com', function() {
});
// Wait for the search box to show up
casper.waitForSelector('input.tactile-searchbox-input', function() {
	this.click('input.tactile-searchbox-input');
});
// Wait for the dropdown list to show up then enter in the search
casper.waitForSelector('div.cards-expanded', function() {
	this.evaluate(function(from, to) {
		// This is the inital search box
		document.getElementById('searchboxinput').value = from + ' to ' + to;
		// This is the initial search icon
		//document.getElementsByClassName('searchbutton')[0].click()
	/*
		i1 = document.getElementById('gs_tti51').childNodes[0].value = '8711 Georgia Ave, Silver Spring, MD'
		i2 = document.getElementById('gs_tti52').childNodes[0].value = 'Tysons Corner, VA'
		document.getElementsByClassName('searchbutton')[1].click()
	*/
	}, from, to);
});
// Click the search button after entrying in our search
casper.waitForSelector('button.searchbutton', function() {
	this.click( 'button.searchbutton' )
});
// Wait for the directions list to show up
casper.waitForSelector('div.gsq_a', function() {
	this.click('div.gsq_a');
});
// Wait 5 seconds for the page to load then capture the left corner of the screen
casper.wait(5000);
casper.then(function() {
	this.capture( 'directions.png', {
		top: 0,
		left: 0,
		width: 640, 
		height: 480 
	});
});
// Capture commute time, distance and summary and echo them to terminal
casper.wait(1000, function() {
	var time = this.evaluate(function() {
        // This is wrong if the traffic is heavy. It would change traffic-light-text to traffic-medium-text or traffic-heavy-text
		comtime = document.getElementsByClassName('cards-directions-traffic-light-text')[0].innerHTML;	
        dist = document.getElementsByClassName('cards-directions-details cards-directions-distance')[0].innerHTML;
        path = document.getElementsByClassName('cards-directions-summary')[0].childNodes[0].childNodes[2].childNodes[1].innerHTML;
        return [path,comtime,dist]
	});
	this.echo(time);
});
casper.run();
