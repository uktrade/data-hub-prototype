import React from 'react';

class FieldText extends React.Component {

  render() {
    let additionalClasses = '';
    const field = this.props.field;

    if (field.touched && field.error) {
      additionalClasses += 'error';
    }

    return (
      <div className={`form-group form-group--compact ${additionalClasses}`}>
        <label className="form-label" htmlFor={this.props.id}>{this.props.label}</label>
        {(this.props.field.touched && this.props.field.error) &&
          <span className="error-message">{this.props.field.error}</span>
        }
        <input className="form-control" id={this.props.id} type="text" { ...this.props.field } />
      </div>
    );
  }
}

FieldText.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  field: React.PropTypes.object.isRequired,
};

export default FieldText;
