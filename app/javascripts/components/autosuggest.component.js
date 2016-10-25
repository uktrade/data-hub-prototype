import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Highlight from 'react-highlighter';

const getSuggestionValue = suggestion => suggestion.name;


export class AutosuggestComponent extends Component {

  constructor(props) {
    super(props);

    if (props.value) {
      this.state = {
        selected: props.value,
        suggestions: []
      };
    } else {
      this.state = {
        selected: {
          name: '',
          id: null
        },
        suggestions: []
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.value) {
      this.setState({selected: nextProps.value});
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

    const suggestions = inputLength === 0 ? [] : this.props.suggestions.filter(suggestion =>
      suggestion.name.toLowerCase().slice(0, inputLength) === inputValue
    );

    this.setState({ suggestions });
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  onBlur = () => {
    // If the user moves off the field and didn't click something,
    // then pick the first suggestion is there is one
    if (!this.state.selected.id && this.state.suggestions.length > 0) {
      this.setState({
        selected: this.state.suggestions[0]
      });
      this.props.onChange(this.state.suggestions[0]);
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
    const { selected, suggestions } = this.state;

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
          suggestions={suggestions}
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
    suggestions: React.PropTypes.array.isRequired,
    value: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string
    }),
    name: React.PropTypes.string
  }
}
