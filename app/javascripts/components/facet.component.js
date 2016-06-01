import React, { Component } from 'react';

class Facet extends Component {

  renderOption = (optionKey) => {

    let option = this.props.options[optionKey];

    if (option.checked) {
      return (
        <label key={optionKey}>
          <input
            name={this.props.name}
            type="checkbox"
            value={optionKey}
            onChange={this.props.onChange}
            checked="true"
          />
          {optionKey}
        </label>
      );
    }

    return (
      <label key={optionKey}>
        <input
          name={this.props.name}
          type="checkbox"
          value={optionKey}
          onChange={this.props.onChange}
        />
        {optionKey}
      </label>
    );
  }

  render() {
    let keys = Object.keys(this.props.options);

    if (keys.length > 1) {

      return (
        <div className="govuk-option-select js-collapsible">
          <button className="js-container-head" type="button" aria-expanded="false">
            <div className="option-select-label">{this.props.title}</div>
          </button>
          <div className="options-container">
            <div className="js-auto-height-inner">
              {keys.map(this.renderOption)}
            </div>
          </div>
        </div>
      );
    }

    return (<div/>);

  }

}

Facet.propTypes = {
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  options: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired
};

export default Facet;
