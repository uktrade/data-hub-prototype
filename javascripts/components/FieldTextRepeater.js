import React from 'react';

class FieldTextRepeater extends React.Component {

  componentWillMount() {
    if (this.props.fields.length === 0) {
      this.props.fields.addField();
    }
  }

  addItem = (e) => {
    e.preventDefault();
    this.props.fields.addField();
  }

  render() {
    const props = this.props;
    const fields = this.props.fields;

    return (
      <div className="form-group form-group--compact">
        <label className="form-label" htmlFor={this.props.id}>{this.props.label}</label>
        {fields.map(function(item, i) {
          return (<input key={i} className="form-control" id={`${props.id}-${i}`} type="text" {...item} />);
        })}
        <p>
          <a href={`#${this.props.id}`} onClick={this.addItem}>Add another {this.props.repeatLabel}</a>
        </p>
      </div>
    );
  }
}

FieldTextRepeater.propTypes = {
  id: React.PropTypes.string,
  label: React.PropTypes.string,
  repeatLabel: React.PropTypes.string,
  fields: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default FieldTextRepeater;
