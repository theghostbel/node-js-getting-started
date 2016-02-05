var express = require('express');
var app = express();
var xml2js = require('xml2js');
var request = require('request');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/arduino', function(request, response) {
  response.send("Hello World! \n");
});

app.get('/arduino2', function(req, res) {
  request('https://snap-ci.com/theghostbel/travis-mocha/branch/master/cctray.xml', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body)
      console.log(body) // Show the HTML for the Google homepage. 
    }
  })
});



app.all('*', function(req, res, next) {
       res.header("X-Version", "1");

       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});

app.get('/api/dictionary', function(req, res){
  res.json({ 
  	nouns: [
		'time',
		'person',
		'year',
		'way',
		'day',
		'thing',
		'man',
		'world',
		'life',
		'hand'
  	],
  	adjectives: [
		'different',
		'used',
		'important',
		'every',
		'large',
		'available',
		'popular',
		'able',
		'basic',
		'known',
		'various',
		'difficult',
		'several',
		'united'
  	]
  })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


