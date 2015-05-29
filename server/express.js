var express = require('express');
var https = require("https");

var app = express();
app.set('views', './views')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/public'));

app.get('/canteen', function (req, res) {
 	https.get("https://fenix.tecnico.ulisboa.pt/api/fenix/v1/canteen", function(r) {
 		var body = '';

	  	console.log("Got response: " + r.statusCode + " -> " + r.statusMessage);

	  	r.on('data', function(chunk) {
		    body += chunk;
		});

		r.on('end', function() {
	    	var ob = JSON.parse("" + body);
		    res.render('canteen', {_menu : JSON.stringify(ob)});
	  	});

	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	  res.render('canteen', {});
	});
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});