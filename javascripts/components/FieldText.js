import React from 'react';

class FieldText extends React.Component {
  render() {
    return (
      <div className="form-group form-group--compact">
        <label className="form-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input className="form-control" id={this.props.id} type="text" />
      </div>
    );
  }
}

FieldText.propTypes = {
  id: React.PropTypes.string,
  label: React.PropTypes.string,
};

export default FieldText;
