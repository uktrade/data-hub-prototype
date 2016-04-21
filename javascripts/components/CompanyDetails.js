import React from 'react';
import { connect } from 'react-redux';
import ContactLink from './ContactLink';
import FlashMessage from './FlashMessage';

class CompanyDetails extends React.Component {

  renderlist(item, i) {
    return (
      <li key={i}>
        {item}
      </li>
    );
  }

  render() {
    const company = this.props.company;
    let sectorList = company.otherSectors ? company.otherSectors.map(this.renderlist) : '';
    let subsidiaryList = company.subsidiarys ? company.subsidiarys.map(this.renderlist) : '';

    return (
      <div>
        <FlashMessage />
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
              <td>{company.primarySector}</td>
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
                <ul>{sectorList}</ul>
              </td>
            </tr>
            <tr>
              <th>Subsidiary</th>
              <td>
                <ul>{subsidiaryList}</ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

CompanyDetails.propTypes = {
  company: React.PropTypes.object,
};


function mapStateToProps({ companies }) {
  return {
    company: companies.company
  };
}

export default connect(mapStateToProps)(CompanyDetails);
