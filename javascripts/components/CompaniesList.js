import React from 'react';
import { connect } from 'react-redux';
import Griddle from 'griddle-react';
import Pagination from './Pagination';
import CompanyLink from './CompanyLink';
import ContactLink from './ContactLink';
import { getCompanies } from '../actions/CompanyActions';

const columns = [
  { displayName: 'Company name', columnName: 'name', customComponent: CompanyLink },
  { displayName: 'Primary contact', columnName: 'primaryContact', customComponent: ContactLink },
  { displayName: 'City', columnName: 'city' },
  { displayName: 'Country', columnName: 'country' }
];

class CompaniesList extends React.Component {

  componentWillMount() {
    this.props.getCompanies();
  }

  render() {
    return (
      <Griddle
        columns={['name', 'primaryContact', 'city', 'country']}
        columnMetadata={columns}
        results={this.props.companies}
        tableClassName="table-list"
        showFilter="true"
        filterPlaceholderText="Search, e.g. by company name or contact name"
        useGriddleStyles={false}
        useCustomPagerComponent="true"
        customPagerComponent={Pagination}
        resultsPerPage={20}
        initialSort="name"
        noDataMessage="No companies found" />
    );
  }
}

CompaniesList.propTypes = {
  companies: React.PropTypes.array,
  getCompanies: React.PropTypes.func,
};

function mapStateToProps({ companies }) {
  return {
    companies: companies.all
  };
}

export default connect(mapStateToProps, { getCompanies })(CompaniesList);
