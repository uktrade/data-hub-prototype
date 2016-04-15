import React from 'react';
import ContactLink from './ContactLink';

class CompanyDetails extends React.Component {

  renderList(item, i) {
    return (
      <li key={i}>
        {item}
      </li>
    );
  }

  render() {
    const company = this.props.company;

    return (
      <table className="table-detail">
        <tbody>
          <tr>
            <th>City</th>
            <td>{company.city}</td>
          </tr>
          <tr>
            <th>Country</th>
            <td>{company.country}</td>
          </tr>
          <tr>
            <th>Account manager</th>
            <td><ContactLink data={company.accountManager} /></td>
          </tr>
          <tr>
            <th>Primary contact</th>
            <td><ContactLink data={company.primaryContact} /></td>
          </tr>
          <tr>
            <th>Business type</th>
            <td>{company.businessType}</td>
          </tr>
          <tr>
            <th>Primary sector</th>
            <td>{company.sector}</td>
          </tr>
          <tr>
            <th>Website</th>
            <td><a href={company.website}>{company.website}</a></td>
          </tr>
          <tr>
            <th>Business description</th>
            <td>{company.businessDescription}</td>
          </tr>
          <tr>
            <th>Investment experience</th>
            <td>{company.investmentExperience}</td>
          </tr>
          <tr>
            <th>Export experience</th>
            <td>{company.exportExperience}</td>
          </tr>
          <tr>
            <th>Other sectors</th>
            <td>
              <ul>
                {company.otherSectors.map(this.renderList)}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

CompanyDetails.propTypes = {
  company: React.PropTypes.object,
};

export default CompanyDetails;
