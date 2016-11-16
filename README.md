# Data hub prototype

This prototype uses node to provide a simple prototype for the Data hub app with a [GOV.UK](https://gov.uk/) look and feel.

## Dependencies

* [Node.js](https://nodejs.org/en/) (>= 6.9.1)

## Installation

1. Clone repository:

  ```
  git clone https://github.com/UKTradeInvestment/data-hub-prototype
  ```

2. Install node dependencies:

  ```
  npm install
  ```

You will need Redis running - if you don't have it installed locally you can run from a docker container:

```bash
docker run -d -p 6379:6379 redis
```


## Running locally
Run the server in either production mode or develop mode

### Production
Builds static assets and runs a server using node

```
npm run build
npm start
```

### Development
Server watches for changes, builds and updates browser with browser-sync

```
npm run develop
```


## Browser Testing

There are notes in the readme file in the test folder to describe the best way to run regular tests and how to attempt to run those same tests with a real browser via browserstack.

With special thanks to [BrowserStack](https://www.browserstack.com) for providing cross browser testing.

