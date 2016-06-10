'use strict';

const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const companyViewController = require('./app/controller/companycontroller');
const contactViewController = require('./app/controller/contactcontroller');
const interactionViewcController = require('./app/controller/interactioncontroller');
const apiController = require('./app/controller/apicontroller');
const nunjucks = require('express-nunjucks');
const filters = require('./app/lib/filters');
const compression = require('compression');
const seed = require('./app/seed');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({
  customValidators: {
    hasOneOrMoreValues: (value) => {
      if (!value || value.length === 0) {
        return false;
      }

      if (Array.isArray(value)) {
        for (let item of value) {
          if (item.length === 0) return false;
        }
      }

      return true;
    }
  },
  customSanitizers: {
    trimArray: (value) => {
      if (Array.isArray(value)) {
        return value.filter((item) => item.length > 0);
      } else if (value && value.length > 0) {
        return [value];
      }
      return null;
    }
  }
}));
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
  `${__dirname}/node_modules/govuk_template_jinja/views`,
  `${__dirname}/node_modules/govstrap/nunjucks`
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
app.use('/images', express.static(`${__dirname}/node_modules/govuk_frontend_toolkit/images`));
app.use('/images', express.static(`${__dirname}/node_modules/govstrap/images`));
app.use('/fonts', express.static(`${__dirname}/node_modules/govuk_template_mustache/assets/stylesheets`));
app.use(express.static(`${__dirname}/app/public`));
app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/node_modules/govuk_template_jinja/assets`));

app.get('/api/search?', apiController.search);

app.get('/companies/:id?', companyViewController.get);
app.post('/companies/:id?', companyViewController.post);

app.get('/companies/:companyId/contact/view/:contactId?', contactViewController.get);
app.get([
  '/companies/:companyId/contact/edit/:contactId?',
  '/companies/:companyId/contact/add?'],
  contactViewController.edit);
app.post([
  '/companies/:companyId/contact/edit/:contactId?',
  '/companies/:companyId/contact/add?'],
  contactViewController.post);

app.get('/companies/:companyId/interaction/view/:interactionId?', interactionViewcController.get);

app.get([
  '/companies/:companyId/interaction/edit/:interactionId?',
  '/companies/:companyId/contact/:contactId/interaction/add?',
  '/companies/:companyId/interaction/add?'],
  interactionViewcController.edit);

app.post([
  '/companies/:companyId/interaction/edit/:interactionId?',
  '/companies/:companyId/contact/:contactId/interaction/add?',
  '/companies/:companyId/interaction/add?'],
  interactionViewcController.post);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/search?', function(req, res) {
  res.render('search');
});

app.listen(config.port);

seed.seedUktiCustomers();
