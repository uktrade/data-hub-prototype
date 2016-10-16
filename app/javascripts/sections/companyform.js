import React, { Component } from 'react';

import RadioWithId from '../components/radiowithid';
import {AddressComponent as Address} from '../components/address.component';
import {AutosuggestComponent as Autosuggest} from '../components/autosuggest.component';
import {inputTextComponent as InputText} from '../components/inputtext.component';
import {errorListComponent as ErrorList} from '../components/errorlist.component';

import axios from 'axios';

const LABELS = {
  'name': 'Registered name',
  'uk_based': 'Is the business based in the UK?',
  'business_type': 'Type of business',
  'sector': 'Sector',
  'registered_address': 'Registered address',
  'uk_region': 'Region',
  'alias': 'Trading name (optiona)',
  'trading_address': 'Trading address (optional)',
  'website': 'Website (optional)',
  'description': 'Business description (optional)',
  'employee_range': 'Number of employees (optional)',
  'turnover_range': 'Annual turnover (optional)',
  'account_manager': 'Account manager',
  'export_to_countries': 'Export market',
  'future_interest_countries': 'Future countries of interest (optional)'
};

const defaultCompany = {
  name: '',
  uk_based: true,
  business_type: {
    id: null,
    name: null
  },
  sector: {
    id: null,
    name: null
  },
  uk_region: {
    id: null,
    name: null
  },
  registered_address: {
    address_1: '',
    address_2: '',
    address_town: '',
    address_county: '',
    address_postcode: '',
    address_country: null
  },
  alias: '',
  trading_address: {
    address_1: '',
    address_2: '',
    address_town: '',
    address_county: '',
    address_postcode: '',
    address_country: null
  },
  website: '',
  description: '',
  employee_range: {
    id: null,
    name: null
  },
  turnover_range: {
    id: null,
    name: null
  },
  account_manager: {
    id: null,
    name: null
  },
  export_to_countries: [
    {id: null, name: ''}
  ],
  future_interest_countries: [
    {id: null, name: ''}
  ]
};

function setDefaults(company) {
  const fieldNames = Object.keys(company);
  for (const fieldName of fieldNames) {
    if (company[fieldName] === null) {
      company[fieldName] = defaultCompany[fieldName];
    }
  }
}


export class CompanyForm extends Component {

  constructor(props) {
    super(props);

    let company;
    if (props.company) {
      company = Object.assign({}, props.company);
      setDefaults(company);
    } else {
      company = Object.assign({}, defaultCompany);
    }

    this.state = {
      advisors: [],
      countryOptions: [],
      show_account_manager: (company.account_manager.id !== null),
      show_exporting_to: (company.export_to_countries.length > 0),
      errors: null,
      saving: false,
      company
    };
  }

  componentDidMount() {
    axios.get('/api/meta/advisors')
      .then((result) => {
        this.setState({advisors: result.data});
      });

    axios.get('/api/meta/countries')
      .then(result => {
        this.setState({countryOptions: result.data});
      });
  }

  updateField = (event) => {
    const key = event.target.name;
    let value;
    if (event.target.value.toLocaleLowerCase() === 'yes') {
      value = true;
    } else if (event.target.value.toLocaleLowerCase() === 'no') {
      value = false;
    } else {
      value = event.target.value;
    }
    let newCompanyState = this.state.company;
    newCompanyState[key] = value;
    this.setState({company: newCompanyState });
  };

  updateRadioWithId = ({name, value}) => {
    this.changeCompanyState(name, value);
  };

  changeCompanyState(key, value) {
    let newCompanyState = this.state.company;
    newCompanyState[key] = value;
    this.setState({company: newCompanyState });
  }

  updateAddress = ({name, value}) => {
    this.changeCompanyState(name, value);
  };

  updateAccountManager = (accountManager) => {
    this.changeCompanyState('account_manager', accountManager);
  };

  updateExpandingSection = (event) => {
    const key = event.target.name;
    let value;

    if (event.target.value.toLocaleLowerCase() === 'yes') {
      value = true;
    } else if (event.target.value.toLocaleLowerCase() === 'no') {
      value = false;
    } else {
      value = event.target.value;
    }
    this.setState({[key]: value});
  };

  updateExportingTo = (newValue, index) => {
    let exportToCountries = this.state.company.export_to_countries;
    exportToCountries[index] = newValue.value;
    this.changeCompanyState('export_to_countries', exportToCountries);
  };

  updateFutureExportTo = (newValue, index) => {
    let futureCountries = this.state.company.future_interest_countries;
    futureCountries[index] = newValue.value;
    this.changeCompanyState('future_interest_countries', futureCountries);
  };

  addCurrentExportCountry = (event) => {
    event.preventDefault();
    let currentExportCountries = this.state.company.export_to_countries;
    currentExportCountries.push({ id: null, name: '' });
    this.changeCompanyState('export_to_countries', currentExportCountries);
  };

  addFutureExportCountry = (event) => {
    event.preventDefault();
    let futureExportCountries = this.state.company.future_interest_countries;
    futureExportCountries.push({ id: null, name: '' });
    this.changeCompanyState('future_interest_countries', futureExportCountries);
  };

  getCurrentlyExportingTo() {
    return this.state.company.export_to_countries.map((country, index) => {
      let label;

      if (index === 0) {
        label = 'Export market';
      } else {
        label = null;
      }

      return (
        <Autosuggest
          key={index}
          label={label}
          suggestions={this.state.countryOptions}
          onChange={(countryUpdate) => {
            this.updateExportingTo(countryUpdate, index);
          }}
          value={country}
        />
      );
    });
  }

  getFutureCountriesOfInterest() {
    return this.state.company.future_interest_countries.map((country, index) => {
      let label;

      if (index === 0) {
        label = 'Future countries of interest (optional)';
      } else {
        label = null;
      }

      return (
        <Autosuggest
          key={index}
          label={label}
          suggestions={this.state.countryOptions}
          onChange={(countryUpdate) => {
            this.updateFutureExportTo(countryUpdate, index);
          }}
          value={country}
        />
      );
    });
  }

  getSaving() {
    return (
      <div className="saving">Saving...</div>
    );
  }

  getErrors(name) {
    if (this.state.errors && this.state.errors[name]) {
      return this.state.errors[name];
    }
    return null;
  }

  save = () => {
    // Just post the company and let the server do the rest. (Get it.. REST)
    this.setState({saving: true});
    axios.post('/company/add', { company: this.state.company })
      .then((response) => {
        window.location.href = `/company/combined/${response.data.id}`;
      })
      .catch((error) => {
        this.setState({
          errors: error.response.data.errors,
          saving: false
        });
      });
  };

  render() {

    if (this.state.saving) {
      return this.getSaving();
    }

    const company = this.state.company;

    return (
      <div>
        { this.state.errors &&
          <ErrorList labels={LABELS} errors={this.state.errors}/>
        }

        <InputText
          label={LABELS.name}
          name="name"
          value={company.name}
          onChange={this.updateField}
          errors={this.getErrors('name')}
        />
        <fieldset className="inline form-group form-group__checkbox-group form-group__radiohide">
          <legend className="form-label">Is the business based in the UK?</legend>
          <label className={company.uk_based ? 'block-label selected' : 'block-label'} htmlFor="uk_based-yes">
            <input
              id="uk_based-yes"
              type="radio"
              name="uk_based"
              value="Yes"
              checked={company.uk_based}
              onChange={this.updateField}
            />
            Yes
          </label>
          <label className={!company.uk_based ? 'block-label selected' : 'block-label'} htmlFor="uk_based-no">
            <input
              id="uk_based-no"
              type="radio"
              name="uk_based"
              value="No"
              checked={!company.uk_based}
              onChange={this.updateField}
            />
            No
          </label>
          { company.uk_based &&
          <p className="js-radiohide-content">
            You can add any type of company except UK based private and public limited
            companies. These companies are already on data hub as it uses companies
            house data. Please search for these companies first on data hub to add or
            edit their details.
          </p>
          }
        </fieldset>
        <RadioWithId
          value={company.business_type.id || null}
          url="/api/meta/typesofbusiness"
          name="business_type"
          label="Type of business"
          errors={this.getErrors('business_type')}
          onChange={this.updateRadioWithId}
        />
        <RadioWithId
          value={company.sector.id}
          url="/api/meta/sector"
          name="sector"
          label="Sector"
          errors={this.getErrors('sector')}
          onChange={this.updateRadioWithId}
        />
        <Address
          name='registered_address'
          label='Registered address'
          onChange={this.updateAddress}
          errors={this.getErrors('registered_address')}
          value={company.registered_address}
        />
        { company.uk_based &&
        <RadioWithId
          value={company.uk_region.id}
          url="/api/meta/region"
          name="uk_region"
          label="Region"
          errors={this.getErrors('uk_region')}
          onChange={this.updateRadioWithId}
        />
        }
        <hr/>
        <InputText
          label={LABELS.alias}
          name="alias"
          value={company.alias}
          errors={this.getErrors('alias')}
          onChange={this.updateField}
        />
        <Address
          name='trading_address'
          label='Trading address'
          errors={this.getErrors('trading_address')}
          onChange={this.updateAddress}
          value={company.trading_address}
        />

        <InputText
          label={LABELS.website}
          name="website"
          errors={this.getErrors('website')}
          value={company.website}
          onChange={this.updateField}
        />
        <div className="form-group ">
          <label className="form-label" htmlFor="description">Business description (optional)</label>
          <textarea
            id="description"
            className="form-control"
            name="description"
            rows="5"
            onChange={this.updateField}
            value={company.description}/>
        </div>
        <RadioWithId
          value={company.employee_range.id}
          url="/api/meta/employee_range"
          name="employee_range"
          errors={this.getErrors('employee_range')}
          label="Number of employees (optional)"
          onChange={this.updateRadioWithId}
        />
        <RadioWithId
          value={company.turnover_range.id}
          url="/api/meta/turnover_range"
          name="turnover_range"
          errors={this.getErrors('turnover_range')}
          label="Annual turnover (optional)"
          onChange={this.updateRadioWithId}
        />
        <fieldset className="inline form-group form-group__checkbox-group form-group__radiohide">
          <legend className="form-label">Is there an agreed DIT account manager for this company?</legend>
          <label
            className={this.state.show_account_manager ? 'block-label selected' : 'block-label'}
            htmlFor="show_account_manager_yes"
          >
            <input
              id="show_account_manager_yes"
              type="radio"
              name="show_account_manager"
              value="Yes"
              checked={this.state.show_account_manager}
              onChange={this.updateExpandingSection}
            />
            Yes
          </label>
          <label
            className={this.state.show_account_manager ? 'block-label' : 'block-label selected'}
            htmlFor="show_account_manager_no"
          >
            <input
              id="show_account_manager_no"
              type="radio"
              name="show_account_manager"
              value="No"
              checked={!this.state.show_account_manager}
              onChange={this.updateExpandingSection}
            />
            No
          </label>

          { this.state.show_account_manager &&
          <div className="js-radiohide-content">
            <Autosuggest
              label='Account manager'
              suggestions={this.state.advisors}
              onChange={this.updateAccountManager}
              errors={this.getErrors('account_manager')}
              value={company.account_manager}
            />
          </div>
          }
        </fieldset>
        <fieldset className="inline form-group form-group__checkbox-group form-group__radiohide">
          <legend className="form-label">Is this company currently exporting to a market?</legend>
          <label
            className={this.state.show_exporting_to ? 'block-label selected' : 'block-label'}
            htmlFor="show_exporting_to_yes"
          >
            <input
              id="show_exporting_to_yes"
              type="radio"
              name="show_exporting_to"
              value="Yes"
              checked={this.state.show_exporting_to}
              onChange={this.updateExpandingSection}
            />
            Yes
          </label>
          <label
            className={this.state.show_exporting_to ? 'block-label' : 'block-label selected'}
            htmlFor="show_exporting_to_no"
          >
            <input
              id="show_exporting_to_no"
              type="radio"
              name="show_exporting_to"
              value="No"
              checked={!this.state.show_exporting_to}
              onChange={this.updateExpandingSection}
            />
            No
          </label>

          { this.state.show_exporting_to &&
          <div className="js-radiohide-content">
            { this.getCurrentlyExportingTo() }
            <a className="add-another-button" onClick={this.addCurrentExportCountry}>
              Add another country
            </a>

          </div>
          }
        </fieldset>
        <div className="form-group">
          {this.getFutureCountriesOfInterest()}
          <a className="add-another-button" onClick={this.addFutureExportCountry}>
            Add another country
          </a>
        </div>
        <div className="button-bar">
          <button className="button button--save" type="button" onClick={this.save}>Save</button>
          <a className="button-link button--cancel js-button-cancel" href="/">Cancel</a>
        </div>
      </div>
    );
  }

  static propTypes = {
    company: React.PropTypes.object
  };

}
