'use strict';

const React = require('react');

class BaseForm extends React.Component {

  updateField = (update) => {
    let fieldName;
    let value;

    if (update.hasOwnProperty('target')) {
      fieldName = update.target.name;
      value = update.target.value;
    } else {
      fieldName = update.name;
      value = update.value;
    }

    if (typeof value === 'string') {
      if (value.toLocaleLowerCase() === 'yes') {
        value = true;
      } else if (value.toLocaleLowerCase() === 'no') {
        value = false;
      }
    }

    this.changeFormData(fieldName, value);
  };

  changeFormData = (fieldName, value) => {
    let newFormDataState = this.state.formData;
    newFormDataState[fieldName] = value;
    this.setState({formData: newFormDataState });
  };

  getErrors(name) {
    if (this.state.errors && this.state.errors[name]) {
      return this.state.errors[name];
    }
    return null;
  }

  getSaving() {
    return (
      <div className="saving">Saving...</div>
    );
  }

  setDefaults(object, defaultObject) {
    const fieldNames = Object.keys(defaultObject);
    for (const fieldName of fieldNames) {
      if (!object[fieldName]) {
        object[fieldName] = defaultObject[fieldName];
      }
    }
  }
}

module.exports = BaseForm;
