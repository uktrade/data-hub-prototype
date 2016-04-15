import React from 'react';
import { Link } from 'react-router';

const Companies = ({children}) =>
  <div>
    <h1 className="compact-heading">Companies</h1>
    <div className="table-list-actions">
      <Link className="button button-secondary" to="/company/add">Add new company</Link>
    </div>
    {children}
  </div>;


Companies.propTypes = {
  children: React.PropTypes.object
};

export default Companies;
