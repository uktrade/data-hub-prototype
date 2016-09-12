var url = process.env.TRAVIS ? 'http://ukti-navigator-staging.herokuapp.com' : 'http://localhost:3000';

module.exports = {
  navigate: {
    home: url + '/'
  }
};
