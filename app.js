'use strict';

const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const companyController = require('./app/controller/companycontroller');
const contactController = require('./app/controller/contactcontroller');
const interactionController = require('./app/controller/interactioncontroller');
const searchController = require('./app/controller/searchcontroller');
const apiController = require('./app/controller/apicontroller');
const expressNunjucks = require('express-nunjucks');
const compression = require('compression');
const customValidators = require('./app/lib/validators');
const customSanitizers = require('./app/lib/sanitizers');
const isDev = app.get('env') === 'development';
const filters = require('./app/lib/nunjuckfilters');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({ customValidators, customSanitizers }));

app.use(compression());
app.set('views', [
  `${__dirname}/app/views`,
  `${__dirname}/node_modules/govuk_template_jinja/views`
]);

filters.stringify = JSON.stringify;


expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
  filters: filters
});


// Insert useful variables into response for all controllers
app.use(require(`${__dirname}/app/middleware/locals`));

// Static files
app.use('/images', express.static(`${__dirname}/node_modules/govuk_frontend_toolkit/images`));
app.use('/fonts', express.static(`${__dirname}/node_modules/govuk_template_mustache/assets/stylesheets`));
app.use('/fonts', express.static(`${__dirname}/node_modules/font-awesome/fonts`));
app.use(express.static(`${__dirname}/app/public`));
app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/node_modules/govuk_template_jinja/assets`));

app.use('/company', companyController.router);
app.use('/contact', contactController.router);
app.use('/interaction', interactionController.router);
app.use('/search', searchController.router);
app.get('/postcodelookup/:postcode', apiController.postcodelookup);
app.get('/suggest', apiController.companySuggest);
app.get('/api/company/:source/:sourceId/?', apiController.companyDetail);

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(config.port);
