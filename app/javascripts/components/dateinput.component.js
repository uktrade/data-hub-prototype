import React, { Component } from 'react';

function getDateParts(dateStr) {
  try {
    return dateStr.substr(0, 10).split('-');
  } catch(e) {
    return ['', '', ''];
  }
}

export class DateInputComponent extends Component {

  constructor(props) {
    super(props);

    if (!props || !props.value) {
      this.state = {
        day: '',
        month: '',
        year: ''
      };
      return;
    }

    const {year, month, day} = getDateParts(props.value);
    this.state = {year, month, day};

  }

  updateDatePart = (part, value) => {

    let state = this.state;
    state[part] = value;

    this.setState({[part]: value});

    this.props.onChange({
      name: this.props.name,
      value: `${state.year}-${state.month}-${state.day}T00:00:00Z`
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
          <span className="error-message">{error}</span>
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
