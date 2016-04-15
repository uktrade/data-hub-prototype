import React from 'react';

class RadioGroup extends React.Component {
  render() {
    const props = this.props;

    return (
      <fieldset className={`form-group form-group--compact ${this.props.inline ? ' inline' : ''}`}>
        <legend className="form-label">{this.props.label}</legend>
        {this.props.options.map(function(item, i) {
          return (
            <label className="block-label" key={i}>
              <input id={`${props.id}-${i}`} name={props.id} type="radio" value={item} />{item}
            </label>
          );
        })}
      </fieldset>
    );
  }
}

RadioGroup.propTypes = {
  id: React.PropTypes.string,
  label: React.PropTypes.string,
  options: React.PropTypes.array,
  inline: React.PropTypes.bool,
};

export default RadioGroup;
