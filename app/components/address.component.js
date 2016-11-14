import React, { Component } from 'react';
import {AutosuggestComponent as Autosuggest} from './autosuggest.component';
import axios from 'axios';


export class AddressComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reveal: false,
      addressSuggestions: [],
      countryOptions: [],
      address: props.value,
      lookupPostcode: ''
    };

  }

  componentDidMount() {
    axios.get('/api/meta/countries')
      .then((result) => {
        this.setState({countryOptions: result.data});
      });
  }

  updateAddress(address) {
    this.setState({address});
    this.props.onChange({name: this.props.name, value: address});
  }

  updateAddressField = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    let address = this.state.address;
    address[key] = value;
    this.updateAddress(address);
    this.setState({addressSuggestions: []});
  };

  countryChange = (country) => {
    let address = this.state.address;
    address.address_country = country.value;
    this.updateAddress(address);
  };

  changeLookupPostcode = (event) => {
    this.setState({'lookupPostcode': event.target.value});
  };


  // Address lookup
  lookupPostcode = () => {
    let postcode = this.state.lookupPostcode;
    if (!postcode || postcode.length === 0) {
      return;
    }

    axios.get(`/api/postcodelookup/${postcode}`)
      .then((response) => {

        if (response.data.hasOwnProperty('error')) {
          this.setState({addressSuggestions: null});
          return;
        }

        this.setState({addressSuggestions: response.data});
      });
  };

  setAddressToSuggestion(suggestion) {
    const address = {
      address_1: suggestion.address1,
      address_2: suggestion.address2,
      address_town: suggestion.city,
      address_county: suggestion.county,
      address_postcode: suggestion.postcode,
      address_country: this.state.address.address_country
    };

    this.updateAddress(address);
  }

  selectSuggestion = (event) => {
    const index = parseInt(event.target.value, 10);
    this.setAddressToSuggestion(this.state.addressSuggestions[index]);
  };


  hasValidCountry() {
    return !(!this.state.address || !this.state.address.address_country || !this.state.address.address_country.id ||
    this.state.address.address_country.id.length === 0);
  }


  // Rendering
  getMainAddressSection() {
    if (!this.hasValidCountry()) return null;

    const address = this.state.address;

    return (
      <div>
        <div className="form-group">
          <label className="form-label">
            Building and street (optional)
          </label>
          <input

            className="form-control"
            name="address_1"
            onChange={this.updateAddressField}
            value={address.address_1}
          />
        </div>
        <div className="form-group">
          <label className="form-label hidden">Address line 1</label>
          <input
            className="form-control"
            name="address_2"
            onChange={this.updateAddressField}
            value={address.address_2}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Town or city (optional)
          </label>
          <input
            className="form-control"
            name="address_town"
            onChange={this.updateAddressField}
            value={address.address_town}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            County / region (optional)
          </label>
          <input
            className="form-control"
            name="address_county"
            onChange={this.updateAddressField}
            value={address.address_county}
          />
        </div>
        <div className="form-group form-group--postcode">
          <label className="form-label">
            Postcode (optional)
          </label>
          <input
            className="form-control"
            name="address_postcode"
            onChange={this.updateAddressField}
            value={address.address_postcode}
          />
        </div>
      </div>
    );
  }

  addressSuggestions() {
    if (this.state.addressSuggestions === null || this.state.addressSuggestions.length === 0) {
      return null;
    }

    const options = this.state.addressSuggestions
      .map((suggestion, index) => <option value={index} key={index}>{suggestion.address1}</option>);

    return (
      <div className="form-group form-group--pick-address">
        <label className="form-label">Pick an address</label>
        <select
          className="form-control"
          onChange={this.selectSuggestion}
        >
          {options}
        </select>
      </div>
    );
  }

  getPostcodeLookupSection() {
    if (!this.hasValidCountry()) return null;

    const country = this.state.address.address_country;

    if (country.name && country.name === 'United Kingdom') {
      const addressSuggestions = this.addressSuggestions();

      return (
        <div className="address__lookup-wrapper">
          <div className="form-group form-group--postcode">
            <label className="form-label">Postcode</label>
            <input
              className="form-control postcode-lookup-value"
              autoComplete="off"
              value={this.state.lookupPostcode}
              onChange={this.changeLookupPostcode}
            />
            <button
              className="button button-secondary lookup-postcode-button"
              onClick={this.lookupPostcode}
            >
              Find UK Address
            </button>
          </div>
          {addressSuggestions}
        </div>
      );
    }

    return null;

  }

  render() {
    let groupClass = 'fieldset--address';
    let error;
    if (this.props.errors && this.props.errors.length > 0) {
      error = this.props.errors[0];
      groupClass += ' incomplete';
    }

    const country = this.state.address.address_country;

    return (
      <fieldset className={groupClass} id={this.props.name + '-wrapper'}>
        <legend className="heading-medium">{this.props.label}</legend>
        {error &&
          <span className="error-message">{error}</span>
        }

        <Autosuggest
          name={this.props.name + '_country'}
          label='Country'
          value={country}
          options={this.state.countryOptions}
          onChange={this.countryChange}
        />

        { this.getPostcodeLookupSection() }
        { this.getMainAddressSection() }

      </fieldset>
    );
  }

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
    errors: React.PropTypes.array
  }

}
