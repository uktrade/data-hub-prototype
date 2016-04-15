import React from 'react';
import { Link } from 'react-router';
import FieldText from './FieldText';
import FieldTextRepeater from './FieldTextRepeater';
import FieldTextarea from './FieldTextarea';
import RadioGroup from './RadioGroup';
import Button from './Button';

class CompanyCreate extends React.Component {
  render() {
    return (
      <div>
        <h1>Add new company</h1>

        <FieldText id="company-name" label="Company name" />
        <FieldText id="company-city" label="City" />
        <FieldText id="company-country" label="Country" />
        <FieldText id="company-type" label="Business type" />
        <FieldText id="company-sector" label="Primary sector" />
        <RadioGroup
          id="company-classification"
          label="The One List account type"
          options={['A', 'A1', 'A2', 'B', 'C', 'D', 'Other']}
          inline={true} />
        <FieldText id="company-website" label="Website" />
        <FieldTextarea id="company-description" label="Business description" />
        <FieldText id="company-inv-experience" label="Investment experience" />
        <FieldText id="company-exp-experience" label="Export experience" />
        <FieldTextRepeater id="company-sectors" label="Other sectors (optional)" repeatLabel="sector" />
        <FieldTextRepeater id="company-subsidiarys" label="Subsidiary (optional)" repeatLabel="subsidiary" />

        <div className="form-group">
          <Button label="Save" />
          <Link to="/">Cancel</Link>
        </div>
      </div>
    );
  }
}

CompanyCreate.propTypes = {

};

export default CompanyCreate;
