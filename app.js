'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const companyViewController = require('./app/controllers/CompanyController');
const searchController = require('./app/controllers/SearchController');
const nunjucks = require('express-nunjucks');
const filters = require('./app/lib/filters');
const compression = require('compression');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

let nunjucksConfig = {
  autoescape: true
};

if (config.env !== 'production') {
  nunjucksConfig.noCache = true;
}

app.set('view engine', 'html');
app.set('views', [
  `${__dirname}/app/views`,
  `${__dirname}/node_modules/govuk_template_jinja/views`
]);

nunjucks.setup(nunjucksConfig, app);

// Add extra filters to nunjucks
nunjucks.ready(function(nj) {
  Object.keys(filters).forEach(function(filterName) {
    nj.addFilter(filterName, filters[filterName]);
  });
});

// Insert usefull variables into response for all controllers
app.use(require(`${__dirname}/app/middleware/locals`));

app.use(express.static(`${__dirname}/app/public`));
app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/node_modules/govuk_template_jinja/assets`));

app.get('/search/:type?', searchController.get);
app.get('/companies/:id?', companyViewController.get);
app.post('/companies/:id?', companyViewController.post);

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(config.port);

console.log(`Application running on port ${config.port}`);
console.log(`To view it visit http://localhost:${config.port}`);
