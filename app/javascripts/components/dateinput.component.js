import React, { Component } from 'react';

function getNewState(props) {

  let newProps = Object.assign({}, props);

  try {

    if (!newProps || !newProps.value) {
      return {
        day: '',
        month: '',
        year: ''
      };
    }

    const {year, month, day} = newProps.value.split('/');
    return { year, month, day };

  } catch (e) {
    return null;
  }
}

export class DateInputComponent extends Component {

  constructor(props) {
    super(props);
    this.state = getNewState(props);
  }

  updateDatePart = (part, value) => {

    let state = this.state;
    state[part] = value;

    this.setState({[part]: value});

    this.props.onChange({
      name: this.props.name,
      value: `${state.year}/${state.month}/${state.day}`
    });



  };

  render() {

    let groupClass = 'form-group form-date';

    let error;
    if (this.props.errors && this.props.errors.length > 0) {
      error = this.props.errors[0];
      groupClass += ' error';
    }

    return (
      <div className={groupClass}>
        <fieldset>
          <legend className="form-label">{this.props.label}</legend>
          {error &&
          <span className="error-message">{{error}}</span>
          }

          <div className="form-group form-group-day">
            <label htmlFor={`${this.props.name}_day`}><span className="form-hint">DD</span></label>
            <input type="text"
                   id={`${this.props.name}_day`}
                   className="form-control"
                   name={`${this.props.name}_day`}
                   value={this.state.day}
                   onChange={(event) => {this.updateDatePart('day', event.target.value)}}
                   maxLength="2"
                   autoComplete="off"/>
          </div>

          <div className="form-group form-group-month">
            <label htmlFor={`${this.props.name}_month`}>
              <span className="form-hint">MM</span>
            </label>
            <input type="text"
                   id={`${this.props.name}_month`}
                   className="form-control"
                   name={`${this.props.name}_month`}
                   value={this.state.month}
                   onChange={(event) => {this.updateDatePart('month', event.target.value)}}
                   maxLength="2"
                   autoComplete="off"/>
          </div>

          <div className="form-group form-group-year">
            <label htmlFor={`${this.props.name}_year`}>
              <span className="form-hint">YYYY</span>
            </label>
            <input type="text"
                   id={`${this.props.name}_year`}
                   className="form-control"
                   name={`${this.props.name}_year`}
                   value={this.state.year}
                   onChange={(event) => {this.updateDatePart('year', event.target.value)}}
                   maxLength="4"
                   autoComplete="off"/>
          </div>
        </fieldset>
      </div>

    );
  }
}

DateInputComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array
};
