import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Highlight from 'react-highlighter';
import axios from 'axios';
import {debounce} from 'lodash';

const getSuggestionValue = suggestion => suggestion.name;


export class AutosuggestComponent extends Component {

  constructor(props) {
    super(props);

    let state = {
      selected: {id: '', name: ''},
      visibleSuggestions: [],
      allSuggestions: []
    };

    if (props.suggestions) {
      state.allSuggestions = props.suggestions;
    }

    if (props.value) {
      state.selected = props.value;
    }

    this.state = state;
    this.fetchSuggestionsFromServer = debounce(this.fetchSuggestionsFromServer, 300);

  }

  componentDidMount() {
    if (this.props.suggestionUrl && this.props.suggestionUrl.length > 0) {
      axios.get(this.props.suggestionUrl)
        .then((result) => {
          this.setState({allSuggestions: result.data});
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) {
      return;
    }

    if (nextProps.value) {
      this.setState({selected: nextProps.value});
    }
    if (nextProps.suggestions) {
      this.setState({allSuggestions: nextProps.suggestions});
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({
      selected: {
        id: null,
        name: newValue
      }
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      selected: suggestion
    });

    // Send back the suggestion and this field name
    this.props.onChange({
      name: this.props.name,
      value: suggestion
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0) {
      this.setState({ suggestions: [] });
      return;
    }

    if (this.props.lookupUrl) {
      this.fetchSuggestionsFromServer(inputValue);
    } else {
      this.fetchSuggestionsFromLocalOptions(inputValue);
    }
  };

  fetchSuggestionsFromLocalOptions = (value) => {
    const visibleSuggestions = this.state.allSuggestions.filter(suggestion =>
      suggestion.name.toLowerCase().slice(0, value.length) === value
    );

    this.setState({ visibleSuggestions });
  };

  fetchSuggestionsFromServer = (value) => {
    axios.get(`${this.props.lookupUrl}?term=${value}`)
      .then(response => {
        this.setState({visibleSuggestions: response.data});
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({ visibleSuggestions: [] });
  };

  onBlur = () => {
    // If the user moves off the field and didn't click something,
    // then pick the first suggestion is there is one
    if (!this.state.selected.id && this.state.visibleSuggestions.length > 0) {
      this.setState({
        selected: this.state.visibleSuggestions[0]
      });
      this.props.onChange(this.state.visibleSuggestions[0]);
    }
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

  render() {
    const { selected, visibleSuggestions } = this.state;
    const inputProps = {
      className: 'form-control',
      value: selected.name,
      onChange: this.onChange,
      onBlur: this.onBlur
    };

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
          focusFirstSuggestion
          inputProps={inputProps}
        />
      </div>
    );
  }

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string,
    suggestions: React.PropTypes.array,
    suggestionUrl: React.PropTypes.string,
    lookupUrl: React.PropTypes.string,
    value: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string
    }),
    name: React.PropTypes.string
  }
}
