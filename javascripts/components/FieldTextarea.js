import React from 'react';

class FieldTextarea extends React.Component {

  render() {

    let additionalClasses = '';

    if (this.props.field.touched && this.props.field.error) {
      additionalClasses += ' error';
    }

    return (
      <div className={`form-group form-group--compact ${additionalClasses}`}>
        <label className="form-label" htmlFor={this.props.id}>{this.props.label}</label>
        {(this.props.field.touched && this.props.field.error) &&
          <span className="error-message">{this.props.field.error}</span>
        }
        <textarea className="form-control"
          id={this.props.id}
          rows={this.props.rows} cols={this.props.cols}
          { ...this.props.field }></textarea>
      </div>
    );
  }
}

FieldTextarea.propTypes = {
  id: React.PropTypes.string,
  label: React.PropTypes.string,
  rows: React.PropTypes.number,
  cols: React.PropTypes.number,
  field: React.PropTypes.object,
};

export default FieldTextarea;
