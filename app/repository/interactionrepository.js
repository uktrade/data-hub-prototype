'use strict';
const rp = require('request-promise');
const config = require('../../config');

function getInteraction(interactionId) {
  return rp({
    url: `${config.apiRoot}/interaction/${interactionId}/`,
    json: true
  });
}

function saveInteraction(interaction) {
  let options = {
    json: true,
    body: interaction
  };

  if (interaction.id && interaction.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/interaction/${interaction.id}/`;
    options.method = 'PUT';
  } else {
    options.url = `${config.apiRoot}/interaction/`;
    options.method = 'POST';
  }

  return rp(options);
}


module.exports = {
  saveInteraction,
  getInteraction
};
