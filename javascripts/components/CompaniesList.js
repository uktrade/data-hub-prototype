import React from 'react';
import Griddle from 'griddle-react';
import Pagination from './Pagination';
import CompanyLink from './CompanyLink';
import ContactLink from './ContactLink';

const data = require('../../data/companies.json');
const columns = [
  { displayName: 'Company name', columnName: 'name', customComponent: CompanyLink },
  { displayName: 'Primary contact', columnName: 'primaryContact', customComponent: ContactLink },
  { displayName: 'Sector', columnName: 'sector' },
  { displayName: 'Country', columnName: 'country' }
];

export default class CompaniesList extends React.Component {
  render() {
    return (
      <Griddle
        columns={['name', 'primaryContact', 'sector', 'country']}
        columnMetadata={columns}
        results={data}
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
