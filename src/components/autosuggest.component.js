/* global document: true */

const React = require('react');
const Highlight = require('react-highlighter');
const axios = require('axios');
const debounce = require('lodash/debounce');
const guid = require('../lib/guid');
const AriaStatus = require('./ariastatus');


class AutosuggestComponent extends React.Component {
  // Component lifecycle
  constructor(props) {
    super(props);
    this.uuid = guid();

    const state = {
      value: { id: '', name: '' },
      highlightedIndex: null,
      suggestions: [],
      options: [],
      invalidValue: false,
      hasFocus: false,
      changed: false,
      loading: false,
    };

    if (props.options) {
      state.options = props.options;
    }

    if (props.value) {
      state.value = props.value;
    }

    this.state = state;

    if (this.props.fetchSuggestions) {
      this.fetcher = this.fetchSuggestionsFromProps;
    } else if (this.props.lookupUrl) {
      this.fetcher = debounce(this.fetchSuggestionsFromServer, 200);
    } else {
      this.fetcher = this.fetchSuggestionsFromLocalOptions;
    }
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.onDocumentMouseDown);

    if (this.props.optionsUrl && this.props.optionsUrl.length > 0) {
      axios.get(this.props.optionsUrl)
        .then((result) => {
          this.setState({ options: result.data });
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.options) {
      this.setState({ options: nextProps.options });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onDocumentMouseDown);
  }

  // event handlers
  // Listen for clicks on the document.
  // If the user clicks outside the autosuggest then clear it
  // otherwise the user clicked on the field or a suggestion, so
  // keep focus on the field.
  onDocumentMouseDown = (event) => {
    let node = (event.detail && event.detail.target) || event.target;

    do {
      if (node === this.container) {
        return;
      }
      node = node.parentNode;
    } while (node !== null && node !== document);

    // Must have been outside the controls, so clear the suggestions
    this.leaveField();
  };
  // When the user types, change any currently selcted value
  // and set the value to just be the text entered
  // reset all the checks then go look for suggestions
  onChange = (event) => {
    const newValue = event.target.value;

    this.setState({
      value: {
        id: null,
        name: newValue,
      },
      highlightedIndex: null,
      invalidValue: false,
      changed: true,
    });

    this.props.onChange({
      name: this.props.name,
      value: {
        id: null,
        name: newValue,
      },
    });

    this.fetchSuggestions(newValue);
  };
  // Need to use a combination of keydown and keyup to get
  // keyboard navigation events.
  keydown = (event) => {
    // Tab
    if (event.keyCode === 9) {
      this.leaveField();
    }
  };
  keyup = (event) => {
    event.preventDefault();
    event.stopPropagation();

    switch (event.keyCode) {
      case 13: // enter
        this.selectSuggestion();
        break;

      case 27: // escape
        this.clearSuggestions();
        break;

      case 38: // up arrow
        this.prev();
        break;

      case 40: // down arrow
        this.next();
        break;
    }
  };
  // Set a var to say if we currently have focus.
  // If the user types something in and moves off the field
  // before the results come back then this helps decide
  // to throw them away as we are no longer using the field.
  focus = () => {
    this.setState({hasFocus: true});
  };

  // Calculate suggestions
  // Decides how to get suggestions, local, remotely or via a provided function
  fetchSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0) {
      this.setState({ suggestions: [] });
      return;
    }

    this.fetcher(inputValue);
  };
  fetchSuggestionsFromLocalOptions = (value) => {
    const suggestions = this.state.options.filter(suggestion =>
      suggestion.name.toLowerCase().slice(0, value.length) === value
    );

    this.setState({ suggestions });
  };
  fetchSuggestionsFromServer = (value) => {
    this.setState({loading: true});
    let url;
    if (typeof this.props.lookupUrl === 'function') {
      url = this.props.lookupUrl(value);
    } else {
      url = `${this.props.lookupUrl}?term=${value}`;
    }

    axios.get(url)
      .then(response => {
        if (this.state.hasFocus) {
          this.setState({
            suggestions: response.data,
            loading: false,
          });
        }
      });
  };
  fetchSuggestionsFromProps = (value) => {
    this.setState({loading: true});
    this.props.fetchSuggestions(value)
      .then(suggestions => {
        if (this.state.hasFocus) {
          this.setState({ suggestions, loading: false });
        }
      });
  };
  clearSuggestions = () => {
    this.setState({ suggestions: [], highlightedIndex: null });
  };

  // Navigate suggestions
  setSelected(suggestion) {
    this.setState({value: suggestion});
    this.props.onChange({
      name: this.props.name,
      value: suggestion
    });
    this.clearSuggestions();
  }
  leaveField() {
    // If there is a highlighted field, select it, otherwise
    // if the current field value exactly matches the first suggestion
    // then select that
    if (this.state.suggestions.length > 0) {
      if (this.state.highlightedIndex !== null) {
        this.setSelected(this.state.suggestions[this.state.highlightedIndex]);
        return;
      }

      const currentValue = this.state.value.name.toLocaleLowerCase();
      const firstSuggestionName = this.state.suggestions[0].name.toLocaleLowerCase();

      if (currentValue === firstSuggestionName) {
        this.setSelected(this.state.suggestions[0]);
        return;
      }
    }

    if (!this.props.allowOwnValue && !this.state.value.id && this.state.changed) {
      this.setState({invalidValue: true});
    }

    this.clearSuggestions();
  }
  next() {
    const length = this.state.suggestions.length - 1;
    if (this.state.highlightedIndex === null || this.state.highlightedIndex === length) {
      this.setState({ highlightedIndex: 0 });
    } else {
      this.setState({ highlightedIndex: (this.state.highlightedIndex + 1) });
    }
  }
  prev() {
    const length = this.state.suggestions.length - 1;
    if (!this.state.highlightedIndex || this.state.highlightedIndex === 0) {
      this.setState({ highlightedIndex: length });
    } else {
      this.setState({ highlightedIndex: this.state.highlightedIndex - 1 });
    }
  }
  selectSuggestion(suggestion) {

    let selectedSuggestion;

    if (suggestion) {
      selectedSuggestion = suggestion;
    } else if (this.state.highlightedIndex !== null) {
      selectedSuggestion = this.state.suggestions[this.state.highlightedIndex];
    }

    if (selectedSuggestion) {
      this.setState({ value: selectedSuggestion, changed: true });
      this.props.onChange({name: this.props.name, value: selectedSuggestion});
    }

    this.clearSuggestions();
    this.textInput.focus();
  }

  // stuff
  getAriaMessage() {
    return '';
  }

  // Render markup

  renderSuggestion = (suggestion, key) => {
    const id = `${this.uuid}-suggestion-${key}`;
    let className = 'autosuggest__suggestion';
    let isSelected;

    if (key === this.state.highlightedIndex) {
      className += ' autosuggest__suggestion--active';
      isSelected = true;
    } else {
      isSelected = false;
    }

    return (
      <li id={id}
          key={id}
          className={className}
          role="option"
          aria-selected={isSelected}
      >
        <a onClick={() => { this.selectSuggestion(suggestion); }}>
          <Highlight search={this.state.value.name}>{suggestion.name}</Highlight>
        </a>
      </li>
    );
  };
  renderSuggestions(suggestions) {

    if (!suggestions || suggestions.length === 0) return null;

    const suggestionsMarkup = suggestions.map((suggestion, index) => {
      return this.renderSuggestion(suggestion, index);
    });

    return (
      <ul className="autosuggest__suggestions" role="listbox" id={`${this.uuid}-options`}>
        {suggestionsMarkup}
      </ul>
    );
  }
  renderLoading() {
    return (
      <div className="loading">
        <i className="fa fa-refresh fa-spin fa-3x fa-fw"/>
        <span className="sr-only">Loading...</span>
      </div>);
  }
  render() {
    const { value, suggestions, loading, highlightedIndex } = this.state;
    let className = 'form-group autosuggest__container';
    let error;
    if (this.props.errors && this.props.errors.length > 0) {
      error = this.props.errors[0];
      className += ' error';
    } else if (this.state.invalidValue) {
      className += ' error';
      error = 'Invalid selection';
    }

    const labelClass = this.props.labelClass || 'form-label-bold';
    const displayValue = (value instanceof Object) ? value.name : value;
    const descendant = (highlightedIndex !== null) ? `${this.uuid}-suggestion-${highlightedIndex}`: null;
    const owns = (suggestions && suggestions.length > 0) ? `${this.uuid}-options` : null;
    const id = `${this.uuid}-input`;
    const ariaMessage = this.getAriaMessage();

    return (
      <div className={className} id={this.uuid + '-wrapper'} onClick={this.test} ref={(div) => {this.container = div;}}>
        { this.props.label &&
          <label className={labelClass} htmlFor={id}>
            {this.props.label}
            { (this.props.searchingFor && !loading) &&
              <span className="form-hint">Please start typing to search for {this.props.searchingFor}</span>
            }
            { (this.props.searchingFor && loading) &&
              <span className="form-hint">Searching for {this.props.searchingFor}...</span>
            }
            { error &&
              <span className="error-message">{error}</span>
            }
          </label>
        }
        <input
          id={id}
          className="form-control"
          name={this.props.name}
          value={displayValue}
          onChange={this.onChange}
          onKeyPress={this.keypress}
          onKeyDown={this.keydown}
          onKeyUp={this.keyup}
          onFocus={this.focus}
          autoComplete="off"
          ref={(input) => {this.textInput = input;}}
          role="combobox"
          aria-owns={owns}
          aria-autocomplete='both'
          aria-activedescendant={descendant}
        />
        { loading && this.renderLoading() }
        { (suggestions && suggestions.length > 0) && this.renderSuggestions(suggestions)}
        <AriaStatus message={ariaMessage} />
      </div>
    );
  }

}

AutosuggestComponent.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  label: React.PropTypes.string,
  searchingFor: React.PropTypes.string,
  options: React.PropTypes.array,
  optionsUrl: React.PropTypes.string,
  fetchSuggestions: React.PropTypes.func,
  lookupUrl: React.PropTypes.any,
  value: React.PropTypes.any,
  name: React.PropTypes.string.isRequired,
  allowOwnValue: React.PropTypes.bool,
  errors: React.PropTypes.array,
  labelClass: React.PropTypes.string
};

module.exports = AutosuggestComponent;
