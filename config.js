'use strict';

const port = process.env.PORT || 3000;

module.exports = {
  env: process.env.NODE_ENV,
  port: port,
  apiRoot: process.env.API_ROOT || 'http://localhost:8000',
  api: {
    authUrl: '/token/',
    clientId: process.env.API_CLIENT_ID,
    clientSecret: process.env.API_CLIENT_SECRET
  },
  postcodeLookup: {
    apiKey: process.env.POSTCODE_KEY,
    baseUrl: 'https://api.getAddress.io/v2/uk/{postcode}?api-key={api-key}'
  },
  redis: {
    url: process.env.REDIS_URL || process.env.REDISTOGO_URL,
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1'
  },
  session: {
    secret: process.env.SESSION_SECRET || 'howdoesyourgardengrow',
    // 30 mins timeout
    ttl: process.env.SESSION_TTL || (30 * 60 * 1000)
  }
};
