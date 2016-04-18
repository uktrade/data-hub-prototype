import React from 'react';
import Griddle from 'griddle-react';
import { connect } from 'react-redux';
import ContactLink from './ContactLink';

const columns = [
  { displayName: 'Name', columnName: 'name', customComponent: ContactLink },
  { displayName: 'Email', columnName: 'email'},
  { displayName: 'Phone', columnName: 'phone'},
  { displayName: 'Role', columnName: 'role', cssClassName: 'nowrap' }
];

class CompanyContacts extends React.Component {

  render() {
    const contacts = this.props.company.contacts;

    return (
      <Griddle
        columns={['name', 'email', 'phone', 'role']}
        columnMetadata={columns}
        results={contacts}
        tableClassName="table-list"
        useGriddleStyles={false}
        resultsPerPage={20}
        initialSort="name"
        showPager={false}
        noDataMessage={"No contacts found"} />
    );
  }
}

CompanyContacts.propTypes = {
  company: React.PropTypes.object,
};

function mapStateToProps({ companies }) {
  return {
    company: companies.company
  };
}

export default connect(mapStateToProps)(CompanyContacts);
