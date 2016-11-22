const axios = require('axios');

function getRemoteCompany(token = null, id, source) {
  return axios.get(`api/company/${source}/${id}`)
    .then((response) => {
      return response.data;
    });
}

module.exports = {
  getRemoteCompany,
};
