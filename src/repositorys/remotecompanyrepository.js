const axios = require('axios')

function getCompany (token = null, id, source) {
  return new Promise((resolve, reject) => {
    axios.get(`/api/company/${source}/${id}`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = {
  getCompany
}
