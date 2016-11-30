const axios = require('axios');

function getInteraction(token = null, id) {
  return axios.get(`/api/interaction/${id}`)
    .then(response => response.data);
}

module.exports = {
  getInteraction,
};
