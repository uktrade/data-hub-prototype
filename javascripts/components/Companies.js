import React from 'react';

const Companies = ({children}) =>
  <div>
    <h1 className="compact-heading">Companies</h1>
    <div className="table-list-actions">
      <a className="button button-secondary" href="#">Add new company</a>
    </div>
    {children}
  </div>;


Companies.propTypes = {
  children: React.PropTypes.object
};

export default Companies;
