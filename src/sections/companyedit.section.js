const React = require('react');
const CHSection = require('./ch.section');
const CompanyForm = require('../forms/companyform');


function companyEditSection(props) {
  const company = props.company;

  return (
    <div>
      <CHSection company={company} />
      <CompanyForm company={company} />
    </div>
  );
}

companyEditSection.propTypes = {
  company: React.PropTypes.object,
};


module.exports = companyEditSection
