import React from 'react';
import {Link} from 'react-router';

const CompanyLink = ({data, rowData}) =>
  <Link to={`/company/${rowData.id}/profile`}>
    {data}
  </Link>;

CompanyLink.propTypes = {
  data: React.PropTypes.string,
  rowData: React.PropTypes.object,
};

export default CompanyLink;
