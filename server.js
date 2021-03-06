var express = require('express');
var app = express();
var subsreader = require('./app/subsreader');
var sublist = subsreader.getSubs();
var subshit = require('./app/subshit');

// Needed to deliver static files (css, img, etc) 
app.use(express.static('public'));
// Sets the template engine. We use jade
app.set('views', __dirname + '/app/tpl');
app.set('view engine', 'jade');

// Routing
// Home
app.get('/', function (req, res) {
	res.render('home', {
		subs: sublist
	});
	res.end();
});

// Single Movie by id (only digits)
app.get(/^\/\d+$/, function (req, res) {
	var subtitleID = Number(req.url.slice(1));
	// Returns the best rated subtitle string for the requested movie by imdbid
	subshit.getSubtitle(subtitleID, function (data) {
		if(data) {
			res.render('single', {
				sub: data,
				subJSON: transformJSONObject(data)
			});
		} else {
			res.send(false);
		}
		res.end();
	});
});

function transformJSONObject(data) {
	var newObj = JSON.parse(JSON.stringify(data));
	for (var key in data) {
		if (typeof data[key] === 'function') {
			newObj[key] = data[key].toString();
		}
	}
	return newObj;
}

// Single Movie by Name (every character allowed)

app.get(/./, function (req, res) {
	res.send(false);
	res.end();
});


// Multiple Movies
app.get('/multi', function (req, res) {
	res.send('Multi');
});

var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log(host, port);
});