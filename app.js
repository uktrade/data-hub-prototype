'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = (process.env.PORT || 8080);
const companyController = require('./controllers/CompanyController');
const companyViewController = require('./controllers/CompanyViewController');
const searchController = require('./controllers/SearchController');

app.use(bodyParser.json());
app.use( express.static(__dirname + '/build') );
app.use( express.static(__dirname + '/public') );
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/api/companies', companyController.getCompanies);
app.get('/api/companies/:id', companyController.getCompany);
app.post('/api/companies', companyController.postCompany);
app.put('/app/companies/:id', companyController.putCompany);

app.get('/search/:type?', searchController.get);

app.get('/companies/:id?', companyViewController.get);

// All undefined routes get send to the homepage for
// react to handle.
app.get('*', function(req, res) {
  res.render('index');
});

app.listen(port);
