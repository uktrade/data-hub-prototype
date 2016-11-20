'use strict';

const React = require('react');
const generateID = require('../lib/elementstuff').generateID;

class RadioComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  focus = () => {
    this.setState({focused: true});
  };

  blur = () => {
    this.setState({focused: false});
  };

  render() {
    const id = generateID();

    let className = 'block-label selection-button-radio';
    if (this.props.checked) className += ' selected';
    if (this.state.focused) className += ' focused';

    return (
      <label
        className={className}
        htmlFor={id}
        onBlur={this.blur}
        onFocus={this.focus}
      >
        <input
          id={id}
          type="radio"
          name={this.props.name}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        {this.props.label}
      </label>
    );
  }

}

RadioComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  checked: React.PropTypes.bool,
  onChange: React.PropTypes.func.isRequired
};

module.exports = RadioComponent;
