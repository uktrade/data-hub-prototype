# Data hub prototype

This prototype uses node and [mojular](https://github.com/mojular) to provide a simple hardcoded prototype for the Data hub app with a [GOV.UK](https://gov.uk/) look and feel.

## Dependencies

* [Node.js](https://nodejs.org/en/) (at least v4 and NPM v3)

## Installation

1. Clone repository:

  ```
  git clone https://github.com/UKTradeInvestment/data-hub-prototype
  ```

2. Install node dependencies:

  ```
  npm install
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

## Deployment

The app is currenlty deployed to [Heroku](http://heroku.com/) where it runs a [rack](http://rack.github.io/) application serving the static files.

The [production environment](https://data-hub-prototype.herokuapp.com/) is automatically deployed on changes to the `master` branch.

Heroku's [review apps beta](https://blog.heroku.com/archives/2015/5/19/heroku_review_apps_beta) is being used to create new instances for each [Pull Request](https://help.github.com/articles/using-pull-requests/) created.

If a more stable environment is required, for example, for a lab testing session, a new heroku instance can be created on the fly and a specific branch can be deployed.

The site may be protected by a username and password. If you have access to the heroku app these will be stored as environment variables.

If you have the [heroku toolbelt](https://toolbelt.heroku.com/) installed you can check environment variables by running:

```
heroku config
```

## Data
Dummy data from http://beta.json-generator.com/EkcMaAFy-
