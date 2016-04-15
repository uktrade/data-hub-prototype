import React from 'react';

class Button extends React.Component {
  render() {
    return (
      <button className="button">{this.props.label}</button>
    );
  }
}

Button.propTypes = {
  label: React.PropTypes.string,
};

export default Button;
