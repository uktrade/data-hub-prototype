'use strict';

const companyRepository = require('../lib/companyrepository');

function get(req, res) {
  let companyNum = req.params.id;
  let query = req.query.query;

  if (!companyNum) {
    res.redirect('/');
  }

  companyRepository.getCompany(companyNum)
    .then((company) => {
      res.render('company/company', {query, company, searchSearch: true});
    })
    .catch((error) => {
      res.render('error', {error});
    });
}

function post(req, res) {
  let companyNum = req.params.id;
  let data = req.body;
  let query = req.query.query || '';

  handleFormPostFields(companyNum, data)
    .then(() => {
      res.redirect(`/companies/${companyNum}?query=${query}`);
    })
    .catch((company, errors) => {
      res.render('company/company', {
        query: query,
        company: company,
        searchSearch: true,
        errors: errors});
    });

}


function handleFormPostFields(id, data) {
  // Get the existing company;

  //uktiCompanyData[companyNum] = {
  //  website: req.body.website,
  //  businessDescription: req.body.businessDescription,
  //  countryOfInterest: req.body.countryOfInterest
  //};

  console.log(data);
  return companyRepository.getCompany(id);

  // Then merge the form data over the top of the company


  // Then save it back to the store.

  // Later add validation and return errors.


}


module.exports = {
  get: get,
  post: post,
  handleFormPostFields: handleFormPostFields
};
