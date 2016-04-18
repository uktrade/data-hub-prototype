import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';
import FieldText from './FieldText';
import FieldTextRepeater from './FieldTextRepeater';
import FieldTextarea from './FieldTextarea';
import RadioGroup from './RadioGroup';
import { addCompany } from '../actions/CompanyActions';

export const fields = [
  'name',
  'city',
  'country',
  'accountManager',
  'primaryContact',
  'businessType',
  'primarySector',
  'investmentClassification',
  'website',
  'businessDescription',
  'investmentExperience',
  'exportExperience',
  'otherSectors[]',
  'subsidiarys[]',
];

class CompanyCreate extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  onSubmit = (props) => {
    this.props.addCompany(props)
      .then((action) => {
        this.context.router.push(`/company/${action.payload.data.company.id}/profile`);
      });
  }

  render() {

    const {
      fields: { name, city, country, accountManager, primaryContact, businessType, primarySector,
        investmentClassification, website, businessDescription,
        investmentExperience, exportExperience, otherSectors, subsidiarys
    }, handleSubmit } = this.props;

    return (
      <div>
        <h1>Add new company</h1>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <FieldText id="company-name" label="Company name" field={name} />
          <FieldText id="company-city" label="City" field={city} />
          <FieldText id="company-country" label="Country" field={country} />
          <FieldText id="acount-manager" label="Account manager" field={accountManager} />
          <FieldText id="primary-contact" label="Primary contact" field={primaryContact} />
          <FieldText id="company-type" label="Business type" field={businessType} />
          <FieldText id="company-sector" label="Primary sector" field={primarySector} />
          <RadioGroup
            id="company-classification"
            label="The One List account type"
            options={['A', 'A1', 'A2', 'B', 'C', 'D', 'Other']}
            inline
            field={investmentClassification} />
          <FieldText id="company-website" label="Website" field={website} />
          <FieldTextarea id="company-description" label="Business description" field={businessDescription} />
          <FieldText id="company-inv-experience" label="Investment experience" field={investmentExperience} />
          <FieldText id="company-exp-experience" label="Export experience" field={exportExperience} />
          <FieldTextRepeater
            id="company-sectors"
            label="Other sectors (optional)"
            repeatLabel="sector"
            fields={otherSectors}
          />
          <FieldTextRepeater
            id="company-subsidiarys"
            label="Subsidiary (optional)"
            repeatLabel="subsidiary"
            fields={subsidiarys}
          />

          <div className="form-group">
            <p><button type="submit" className="button button-primary">Save</button></p>
            <Link to="/">Cancel</Link>
          </div>
        </form>
      </div>
    );
  }
}

CompanyCreate.propTypes = {
  addCompany: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  fields: React.PropTypes.object.isRequired,
};

function validate(values) {
  const errors = {};

  if (!values.name) {
    errors.name = 'Enter company name';
  }

  return errors;
}


export default reduxForm({
  form: 'PostNewForm',
  fields,
  validate
}, null, { addCompany })(CompanyCreate);
