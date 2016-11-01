import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Highlight from 'react-highlighter';
import axios from 'axios';
import {debounce} from 'lodash';

const getSuggestionValue = suggestion => suggestion.name;
const baseUrl = '/api/suggest';


export class DidYouMeanCompanyComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: { id: '', name: '' },
      visibleSuggestions: [],
      value: props.value || '',
      didYouMeanSuggestion: null
    };

    this.onSuggestionsFetchRequested = debounce(this.onSuggestionsFetchRequested, 300);
  }

  onChange = (event, { newValue }) => {
    this.setState({value: newValue, didYouMeanSuggestion: null});
    this.props.onChange(event);
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      selected: suggestion
    });

    // Get the company details for did you mean
    axios.get(`/company/${suggestion._type}/${suggestion.id}/json`)
      .then(response => {
        this.setState({didYouMeanSuggestion: response.data});
      });

  };

  onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
      this.setState({ suggestions: [] });
      return;
    }

    axios.get(`${baseUrl}?term=${inputValue}&type=company_company&type=company_companieshousecompany`)
      .then(response => {
        const filtered = response.data
          .filter(suggestion => suggestion.name.substr(0, inputLength).toLocaleLowerCase() === inputValue);
        this.setState({visibleSuggestions: filtered});
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({ visibleSuggestions: [] });
  };

  renderSuggestion = (suggestion) => {
    return (
      <div className="autosuggest__suggestion">
        <Highlight search={this.state.selected.name}>
          {suggestion.name}
        </Highlight>
      </div>
    );
  };

  renderDidYouMean() {
    const company = this.state.didYouMeanSuggestion;

    if (!company) return null;

    let name, type, id, addressStr;

    if (!company.id && company.ch && company.ch.id) {
      addressStr = company.ch.registered_address_1;
      if (company.ch.registered_address_2 && company.ch.registered_address_2.length > 0) addressStr += `, ${company.ch.registered_address_2}`;
      if (company.ch.registered_address_town && company.ch.registered_address_town.length > 0) addressStr += `, ${company.ch.registered_address_town}`;
      if (company.ch.registered_addres_county && company.ch.registered_address_county > 0) addressStr += `, ${company.ch.registered_address_county}`;
      if (company.ch.registered_address_postcode && company.ch.registered_address_postcode > 0) addressStr += `, ${company.ch.registered_address_postcode}`;
      name = company.ch.name;
      id = company.company_number;
      type = 'company_companieshousecompany';
    } else {
      let address;

      name = company.name;
      id = company.id;
      type = 'company_company';

      if (company.trading_address
        && company.trading_address.address_1
        && company.trading_address.address_1.length > 0)
      {
        address = company.trading_address;
      } else {
        address = company.registered_address;
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
    const { visibleSuggestions } = this.state;
    const inputProps = {
      className: 'form-control',
      value: this.state.value,
      onChange: this.onChange,
      name: this.props.name
    };
    const didYouMean = this.renderDidYouMean();

    return (
      <div className="form-group">
        { this.props.label &&
        <label className="form-label">{this.props.label}</label>
        }
        <Autosuggest
          suggestions={visibleSuggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          focusFirstSuggestion
        />

        {didYouMean}
      </div>
    );
  }

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    name: React.PropTypes.string
  }
}
