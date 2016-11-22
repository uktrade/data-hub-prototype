const React = require('react');

function CompanyInteractions(props) {

  return (
    <div>
      <h2>Company interactions</h2>
      {props.company.interactions.length}
    </div>
  );
}


module.exports = CompanyInteractions;
