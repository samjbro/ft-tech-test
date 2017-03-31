var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var request = require('request');

var app = express();

var apiKey = process.env.ftHeadlineAPIKey;
var port = process.env.PORT || 3000;
var resultsPerPage = 20;

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
  callAPI(res, '', 0);
});

app.get('/search', function(req,res) {
  console.log({page: req.query.page})
  req.query.page = typeof req.query.page === 'undefined' ? '1' : req.query.page;
  console.log({page: req.query.page})
  var offset = (parseInt(req.query.page) - 1) * resultsPerPage;
  console.log(offset)
  callAPI(res, req.query.q, offset);
});

app.listen(port);
console.log('listening on port ' + port);

function callAPI(res, query, offset) {
  if (!apiKey) console.error('Error: No API Key');
  var data = composeRequest(query, offset);

  request(data, function(error,response,body) {
    if(error) return console.error('request failed:', error);
    var results = body.results ? body.results[0].results : {};
    // console.log(results[0].lifecycle.lastPublishDateTime)
    res.render('layout.html', { results: results, query: query, offset: offset });
  });
}

function composeRequest(q="", offset=0) {
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
        'aspects': ['title', 'lifecycle','summary','location','editorial'],
        'maxResults': resultsPerPage.toString(),
        'offset': offset.toString()
      }
    }
  };
}
