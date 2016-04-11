import React from 'react';

const Companies = ({children}) =>
  <div>
    <div className="summary">
      <div className="grid-row">
        <div className="column-two-thirds">
          <h1 className="heading">Companies</h1>
        </div>
        <div className="column-third get-started">
          <a className="button button-secondary">Add company</a>
        </div>
      </div>
    </div>
    {children}
  </div>;


Companies.propTypes = {
  children: React.PropTypes.object
};

export default Companies;
