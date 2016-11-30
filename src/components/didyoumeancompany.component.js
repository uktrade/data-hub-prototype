'use strict';

const React = require('react');
const axios = require('axios');
const Autosuggest = require('./autosuggest.component');


class DidYouMeanCompanyComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visibleSuggestions: [],
      value: props.value || '',
      didYouMeanSuggestion: null
    };

  }

  onChange = ({ name, value }) => {
    this.setState({ value, didYouMeanSuggestion: null });
    this.props.onChange({ name, value: value.name });

    // if the item has an ID then look it up
    if (value.id) {
      // Get the company details for did you mean
      const url = `/api/company/${value._type}/${value.id}/json`;
      axios.get(url)
        .then(response => {
          this.setState({didYouMeanSuggestion: response.data});
        });
    }
  };

  lookupUrl(value) {
    return `/api/suggest?term=${value}&type=company_company&type=company_companieshousecompany`;
  }

  renderDidYouMean() {
    const company = this.state.didYouMeanSuggestion;

    if (!company) return null;

    let name, type, id, addressStr;

    if (!company.id && company.companies_house_data && company.companies_house_data.id) {
      addressStr = company.companies_house_data.registered_address_1;
      if (company.companies_house_data.registered_address_2 && company.companies_house_data.registered_address_2.length > 0) addressStr += `, ${company.companies_house_data.registered_address_2}`;
      if (company.companies_house_data.registered_address_town && company.companies_house_data.registered_address_town.length > 0) addressStr += `, ${company.companies_house_data.registered_address_town}`;
      if (company.companies_house_data.registered_address_county && company.companies_house_data.registered_address_county > 0) addressStr += `, ${company.companies_house_data.registered_address_county}`;
      if (company.companies_house_data.registered_address_postcode && company.companies_house_data.registered_address_postcode > 0) addressStr += `, ${company.companies_house_data.registered_address_postcode}`;
      name = company.companies_house_data.name;
      id = company.company_number;
      type = 'company_companieshousecompany';
    } else {
      let address;

      name = company.name;
      id = company.id;
      type = 'company_company';

      if (company.trading_address_1
        && company.trading_address_1.length > 0)
      {
        address = {
          address_1: company.trading_address_1,
          address_2: company.trading_address_2,
          address_town: company.trading_address_town,
          address_county: company.trading_address_county,
          address_postcode: company.trading_address_postcode,
          address_country: company.trading_address_country,
        }
      } else {
        address = {
          address_1: company.registered_address_1,
          address_2: company.registered_address_2,
          address_town: company.registered_address_town,
          address_county: company.registered_address_county,
          address_postcode: company.registered_address_postcode,
          address_country: company.registered_address_country,
        }
      }

      addressStr = address.address_1;
      if (address.address_2 && address.address_2.length > 0) addressStr += `, ${address.address_2}`;
      if (address.address_town && address.address_town.length > 0) addressStr += `, ${address.address_town}`;
      if (address.address_county && address.address_county.length > 0) addressStr += `, ${address.address_county}`;
      if (address.address_postcode && address.address_postcode.length > 0) addressStr += `, ${address.address_postcode}`;
    }

    return (
      <div className="indented-info">
        <h3 className="heading-small indented-info__heading">Did you mean this company?</h3>
        <a className="indented-info__link" href={`/company/${type}/${id}`}>{name}</a>
        <p className="indented-info__description">
          {company.company_number && <span>Company number: {company.company_number}<br/></span> }
          {addressStr}
        </p>
      </div>
    );
  }

  render() {
    const didYouMean = this.renderDidYouMean();

    return (
      <div>
        <Autosuggest
          name={this.props.name}
          label={this.props.label}
          value={this.state.selected}
          lookupUrl={this.lookupUrl}
          onChange={this.onChange}
          allowOwnValue
        />
        { didYouMean }
      </div>
    );
  }

}

DidYouMeanCompanyComponent.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  label: React.PropTypes.string,
  value: React.PropTypes.string,
  name: React.PropTypes.string
};

module.exports = DidYouMeanCompanyComponent;
