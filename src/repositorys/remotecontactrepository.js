const axios = require('axios');

function getContact(token = null, id) {
  return axios.get(`/api/contact/${id}`)
    .then(response => response.data);
}

module.exports = {
  getContact,
};
