'use strict';

const React = require('react');
const axios = require('axios');

const defaultProps = {
  value: '',
  options: []
};

class SelectWithIdComponent extends React.Component {

  constructor(props) {
    super(props);
    const state = Object.assign({}, props, defaultProps);
    if (props.value) {
      state.value = props.value
    }

    this.state = state;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.value) {
      this.setState({value: nextProps.value});
    }
    if (nextProps && nextProps.options) {
      this.setState({options: nextProps.options});
    }
  }

  getNameForId(id) {
    for (const option of this.state.options) {
      if (option.id === id) return option;
    }
    return null;
  }

  componentDidMount() {
    if (this.state.url) {
      this.getOptions();
    }
  }

  onChange = (event) => {
    this.setState({value: event.target.value});

    const value = this.getNameForId(event.target.value);
    this.props.onChange({
      name: this.props.name,
      value
    });
  };

  getOptions() {
    // make a call to get the available options using the url
    axios.get(this.props.url)
      .then((result) => {
        this.setState({options: result.data});
      });
  }

  render() {
    let optionElements = this.state.options.map((option) =>
      <option key={option.id} value={option.id}>{option.name}</option>);

    let groupClass = 'form-group';

    let error;
    if (this.props.errors && this.props.errors.length > 0) {
      error = this.props.errors[0];
      groupClass += ' error';
    }

    return (
      <div className={groupClass} id={this.props.name + '-wrapper'}>
        <label className="form-label-bold" htmlFor={this.props.name}>
          {this.props.label}
          {error &&
            <span className="error-message">{error}</span>
          }
        </label>
        <select
          className="form-control"
          id={this.props.name}
          name={this.props.name}
          onChange={this.onChange}
          value={this.state.value}
        >
          <option value=''>Select option</option>
          {optionElements}
        </select>
      </div>
    );
  }
}

SelectWithIdComponent.propTypes = {
  value: React.PropTypes.string,
  url: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired,
  errors: React.PropTypes.array,
  options: React.PropTypes.array,
};

module.exports = SelectWithIdComponent;
