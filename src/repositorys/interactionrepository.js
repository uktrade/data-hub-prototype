const authorisedRequest = require('../lib/authorisedrequest');
const config = require('../config');

function getInteraction(token, interactionId) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/interaction/${interactionId}/`,
    json: true,
  });
}

function saveInteraction(token, interaction) {
  const options = {
    json: true,
    body: interaction,
  };

  if (interaction.id && interaction.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/interaction/${interaction.id}/`;
    options.method = 'PUT';
  } else {
    options.url = `${config.apiRoot}/interaction/`;
    options.method = 'POST';
  }

  return authorisedRequest(token, options);
}


module.exports = {
  saveInteraction,
  getInteraction,
};
