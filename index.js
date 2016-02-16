var express = require('express');
var app = express();
var xml2js = require('xml2js');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

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
      console.log('Body: ')
      console.log(body) // Show the HTML for the Google homepage. 
    	
    	xml2js.parseString(body, function (err, result) {
    	  console.log('Parsed: ')
    	  console.dir(result);
    	  console.log('Data: ')
    	  console.dir(result.lastBuildStatus);
    	  
    	  var lastBuildStatus = result.Projects.Project[0].$.lastBuildStatus
    	  var activity = result.Projects.Project[0].$.activity
    	  
    	  if (lastBuildStatus == "Success" && activity == "Sleeping") res.send('<0>')
    	  if (lastBuildStatus == "Success" && activity != "Sleeping") res.send('<1>')
    	  if (lastBuildStatus != "Success" && activity == "Sleeping") res.send('<2>')
    	  if (lastBuildStatus != "Success" && activity != "Sleeping") res.send('<3>')
    	});
    }
  })
});

app.all('*', function(req, res, next) {
       res.header("X-Version", "2");

       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});

app.get('/api/user/:userId', function(req, res, next) {
	var filePath = 'user' + req.params.userId + '.json'
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
	    if (!err) {
	      console.log('Reading file: ' + data);	      
	      res.header('Content-Type', 'application/json');
	      res.send(data);
	    } else {
	      console.log(err);
	      res.send('Error: ' + JSON.stringify(err));	      
	    }
	});    
});


app.post('/api/user/:userId', function(req, res, next) {
	var filePath = 'user' + req.params.userId + '.json'

	console.log('File, body');      // your JSON
	console.log(filePath, req.body);      // your JSON
	res.header('Content-Type', 'application/json');
  	res.send(req.body);    // echo the result back

	// fs.writeFile(filePath, {encoding: 'utf-8'}, function(err,data){
	//     if (!err) {
	//       console.log('Reading file: ' + data);	      
	//       res.header('Content-Type', 'application/json');
	//       res.send(data);
	//     } else {
	//       console.log(err);
	//       res.send('Error: ' + JSON.stringify(err));	      
	//     }
	// });    
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


