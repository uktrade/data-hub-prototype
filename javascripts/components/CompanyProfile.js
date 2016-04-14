import React from 'react';
import { Link } from 'react-router';
const data = require('../../data/companies.json');

class CompanyProfile extends React.Component {

  componentWillMount() {
    for (var company of data) {
      if (company.id === this.props.params.id) {
        this.setState({
          company
        });
        break;
      }
    }
  }

  render() {

    const company = this.state.company;
    const id = this.props.params.id;

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, { company: company }));

    return (
      <div className="profile">
        <div className="back">
          <Link to="/">&lt; Back to companies</Link>
        </div>
        <header>
          <h1 className="heading heading-xlarge">{company.name}
            <span className="label label-primary">Tier {company.investmentClassification}</span>
          </h1>
        </header>
        <div className="tabs tabs-left">
          <nav className="tabs-nav">
            <Link className="tabs-nav-link" to={`/company/${id}/profile`} activeClassName="active">
              Details
            </Link>
            <Link className="tabs-nav-link" to={`/company/${id}/contacts`} activeClassName="active">
              Contacts
            </Link>
            <Link className="tabs-nav-link" to={`/company/${id}/interactions`} activeClassName="active">
              Interactions
            </Link>
            <Link className="tabs-nav-link" to={`/company/${id}/projects`} activeClassName="active">
              Projects
            </Link>
            <Link className="tabs-nav-link" to={`/company/${id}/deliveries`} activeClassName="active">
              Deliveries
            </Link>
            <Link className="tabs-nav-link" to={`/company/${id}/documents`} activeClassName="active">
              Documents
            </Link>
          </nav>
          <div className="tabs-content">{childrenWithProps}</div>
        </div>
      </div>
    );
  }
}

CompanyProfile.propTypes = {
  company: React.PropTypes.object,
  params: React.PropTypes.object,
  children: React.PropTypes.object,
};

export default CompanyProfile;
