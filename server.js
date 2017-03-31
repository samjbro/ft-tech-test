var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var request = require('request');

var app = express();

var apiKey = process.env.ftHeadlineAPIKey;
var port = process.env.PORT || 3000;

app.set('assets_path', 'build');
app.set('views', path.join(__dirname, app.get('assets_path') + '/views'));
app.use(express.static(path.join(__dirname, app.get('assets_path'))));

nunjucks.configure(app.get('views'), {
  autoescape: true,
  noCache: true,
  watch: true,
  express: app
});

app.get('/', function(req,res) {
  callAPI(res);
});

app.get('/search', function(req,res) {
  callAPI(res, req.query.q);
});

app.listen(port);
console.log('listening on port ' + port);

function callAPI(res, query) {
  if (!apiKey) console.error('Error: No API Key');
  var data = composeRequest(query);

  request(data, function(error,response,body) {
    if(error) return console.error('request failed:', error);
    var results = body.results ? body.results[0].results : {};
    res.render('layout.html', {results: results});
  });
}

function composeRequest(q="") {
  return {
    url: 'http://api.ft.com/content/search/v1?apiKey=' + apiKey,
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      'queryString': q,
      'queryContext': {
        "curations": ["ARTICLES"]
      },
      'resultContext': {
        'aspects': ['title', 'lifecycle','summary']
      }
    }
  };
}
