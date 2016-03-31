# Data hub prototype

This prototype is based on [middleman](https://middlemanapp.com/), a static site generator, and [mojular](https://github.com/mojular) for common [GOV.UK](https://gov.uk/) layouts and patterns.

## Dependencies

* [Ruby](https://www.ruby-lang.org/en/)
* [Node.js](https://nodejs.org/en/)
* [Foreman](http://ddollar.github.io/foreman/) (for development only)

## Installation

1. Clone repository:

  ```
  git clone https://github.com/UKTradeInvestment/data-hub-prototype
  ```

2. Install ruby dependencies:

  ```
  bundle install
  ```

3. Install node dependencies:

  ```
  npm install
  ```

4.
  Build static files from source to `./build/`:

  ```
  middleman build
  ```

  **OR**

  Run a middleman server

  ```
  middleman server
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

## Development

Assets are compiled using [webpack](https://webpack.github.io/). [Foreman](http://ddollar.github.io/foreman/) can be used to simultaneously run a middleman server and a webpack module bundler.

Run:

```
foreman start --procfile dev.Procfile
```
