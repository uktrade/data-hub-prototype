const React = require('react');

function containsServerError(errors) {
  return errors.error;
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
          <li>{props.errors.error}</li>
        </ul>
      </div>
    );
  }

  const errorFields = Object.keys(props.errors);

  const errorListMarkup = errorFields.map((fieldName) => {
    const error = Array.isArray(props.errors[fieldName]) ? props.errors[fieldName][0] : props.errors[fieldName];
    const label = props.labels[fieldName] || fieldName;

    if (label === 'detail') {
      return (
        <li key={fieldName}>{error}</li>
      );
    }

    return (
      <li key={fieldName}>
        <a href={`#${fieldName}-wrapper`}>{label} - {error}</a>
      </li>
    );
  });

  return (
    <div className="error-summary" role="group" tabIndex="-1">
      <h1 className="heading-medium error-summary-heading" id="error-summary-heading">
        Errors
      </h1>
      <ul className="error-summary-list">{errorListMarkup}</ul>
    </div>
  );
}

errorListComponent.propTypes = {
  errors: React.PropTypes.object,
  labels: React.PropTypes.object,
};

module.exports = errorListComponent;
