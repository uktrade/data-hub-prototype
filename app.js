'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = (process.env.PORT || 8080);
const companyViewController = require('./controllers/CompanyViewController');
const searchController = require('./controllers/SearchController');

app.use(bodyParser.urlencoded());
app.use( express.static(__dirname + '/build') );
app.use( express.static(__dirname + '/public') );
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/search/:type?', searchController.get);

app.get('/companies/:id?', companyViewController.get);
app.post('/companies/:id?', companyViewController.post);

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(port);
