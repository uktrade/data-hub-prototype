import React from 'react';

class FieldTextarea extends React.Component {
  render() {
    return (
      <div className="form-group form-group--compact">
        <label className="form-label" htmlFor={this.props.id}>{this.props.label}</label>
        <textarea className="form-control" id={this.props.id} rows={this.props.rows} cols={this.props.cols}></textarea>
      </div>
    );
  }
}

FieldTextarea.propTypes = {
  id: React.PropTypes.string,
  label: React.PropTypes.string,
  rows: React.PropTypes.number,
  cols: React.PropTypes.number,
};

export default FieldTextarea;
