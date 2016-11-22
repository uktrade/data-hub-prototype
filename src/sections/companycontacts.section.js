const React = require('react');

function CompanyContacts(props) {

  return (
    <div>
      <h2>Company Contacts</h2>
      {props.company.contacts.length}
    </div>
  );
}


module.exports = CompanyContacts;
