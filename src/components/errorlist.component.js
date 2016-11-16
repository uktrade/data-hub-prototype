'use strict';

const React = require('react');

function containsServerError(errors) {
  for (const error of errors) {
    if (error.error) return true;
  }
  return false;
}


function errorListComponent(props) {
  if (!props.errors) return null;

  if (containsServerError(props.errors)) {
    return (
      <div className="error-summary" role="group" tabIndex="-1">
        <h1 className="heading-medium error-summary-heading" id="error-summary-heading">
          Error
        </h1>
        <ul className="error-summary-list">
          <li>{props.errors[0].error}</li>
        </ul>
      </div>
    );
  }

  const errorFields = Object.keys(props.errors);

  const errorListMarkup = errorFields.map(fieldName => {
    const error = props.errors[fieldName];
    return (
      <li key={fieldName}>
        <a href={'#' + fieldName + '-wrapper'}>{props.labels[fieldName]} - { error[0] }</a>
      </li>
    );
  });

  return (
    <div className="error-summary" role="group" tabIndex="-1">
      <h1 className="heading-medium error-summary-heading" id="error-summary-heading">
        Incomplete Information
      </h1>
      <ul className="error-summary-list">{errorListMarkup}</ul>
    </div>
  );
}

errorListComponent.propTypes = {
  errors: React.PropTypes.object,
  labels: React.PropTypes.object.isRequired,
};

module.exports = errorListComponent;
