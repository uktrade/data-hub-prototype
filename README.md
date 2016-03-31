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
