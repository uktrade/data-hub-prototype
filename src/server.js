const config = require('./config');
const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const expressNunjucks = require('express-nunjucks');
const compression = require('compression');
const logger = require('morgan');
const session = require('express-session');
const redis = require('redis');
const redisCrypto = require('connect-redis-crypto');
const flash = require('connect-flash');
const url = require('url');
const winston = require('winston');
const forceSSL = require('express-force-ssl');

const companyController = require('./controllers/companycontroller');
const contactController = require('./controllers/contactcontroller');
const interactionController = require('./controllers/interactioncontroller');
const searchController = require('./controllers/searchcontroller');
const apiController = require('./controllers/apicontroller');
const loginController = require('./controllers/logincontroller');
const myAccountController = require('./controllers/myaccountcontroller');
const indexController = require('./controllers/indexcontroller');

const customValidators = require('./lib/validators');
const customSanitizers = require('./lib/sanitizers');
const filters = require('./lib/nunjuckfilters');
const datahubFlash = require('./middleware/flash');
const auth = require('./middleware/auth');
const user = require('./middleware/user');
const csrf = require('./middleware/csrf');
const locals = require('./middleware/locals');

const metadata = require('./repositorys/metadatarepository');

const app = express();
const isDev = app.get('env') === 'development';
winston.level = isDev ? 'debug' : 'error';


const RedisStore = redisCrypto(session);

let client;

if (config.redis.url) {
  const redisURL = url.parse(config.redis.url);
  /* eslint-disable camelcase */
  client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true });
  /* eslint-enable camelcase */
  client.auth(redisURL.auth.split(':')[1]);
} else {
  client = redis.createClient(config.redis.port, config.redis.host);
}

client.on('error', (e) => {
  winston.log('error', 'Error connecting to redis');
  winston.log('error', e);
  throw e;
});

client.on('connect', () => {
  winston.log('info', 'connected to redis');
});

client.on('ready', () => {
  winston.log('info', 'connection to redis is ready to use');
});

const redisStore = new RedisStore({
  client,
  // config ttl defined in milliseconds
  ttl: config.session.ttl / 1000,
  secret: config.session.secret,
});

app.use(session({
  store: redisStore,
  proxy: !isDev,
  cookie: {
    secure: !isDev,
    maxAge: config.session.ttl,
  },
  rolling: true,
  key: 'datahub.sid',
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(expressValidator({ customValidators, customSanitizers }));

app.use(compression());
app.set('views', [`${__dirname}/../src/views`]);

filters.stringify = JSON.stringify;

expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
  filters,
});

// Static files
app.use('/javascripts', express.static(`${__dirname}/../build/javascripts`));
app.use('/stylesheets', express.static(`${__dirname}/../build/stylesheets`));
app.use(express.static(`${__dirname}/../src/public`));
app.use('/images', express.static(`${__dirname}/../node_modules/govuk_frontend_toolkit/images`));
app.use('/fonts', express.static(`${__dirname}/../node_modules/font-awesome/fonts`));
app.use('/javascripts/react', express.static(`${__dirname}/../node_modules/react/dist`));
app.use('/javascripts/react-dom', express.static(`${__dirname}/../node_modules/react-dom/dist`));
app.use(express.static(`${__dirname}/../node_modules/govuk_template_jinja/assets`));

app.use(logger((isDev ? 'dev' : 'combined')));

if (!isDev) {
  app.use(forceSSL);
}

app.use(locals);
app.use(datahubFlash);
app.use(auth);
app.use(user);
app.use(csrf);

app.use('/login', loginController.router);
app.use('/myaccount', myAccountController.router);
app.use(companyController.router);
app.use(contactController.router);
app.use('/interaction', interactionController.router);
app.use('/search', searchController.router);
app.use(apiController.router);
app.get('/', indexController);


metadata.setRedisClient(client);
metadata.fetchAll((errors) => {
  if (errors) {
    winston.log('error', 'Unable to load all metadataRepository, cannot start app');

    for (const err of errors) {
      throw err;
    }
  } else {
    app.listen(config.port, () => {
      winston.log('info', 'app listening on port %s', config.port);
    });
  }
});
