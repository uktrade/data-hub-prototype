import React from 'react';

class RadioGroup extends React.Component {
  render() {
    const props = this.props;
    const field = this.props.field;

    return (
      <fieldset className={`form-group form-group--compact ${this.props.inline ? ' inline' : ''}`}>
        <legend className="form-label">{this.props.label}</legend>
        {this.props.options.map(function(item, i) {
          return (
            <label className="block-label" key={i}>
              <input id={`${props.id}-${i}`} type="radio" {...field} value={item} checked={field.value === item}/>{item}
            </label>
          );
        })}
      </fieldset>
    );
  }
}

RadioGroup.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  options: React.PropTypes.array.isRequired,
  field: React.PropTypes.object.isRequired,
  inline: React.PropTypes.bool,
};

export default RadioGroup;
