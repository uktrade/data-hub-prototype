const axios = require('axios');

function getCompany(token = null, id, source) {
  return axios.get(`/api/company/${source}/${id}`)
    .then(response => response.data);
}

module.exports = {
  getCompany,
};
