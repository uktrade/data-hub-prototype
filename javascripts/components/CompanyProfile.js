import React from 'react';
import { Link } from 'react-router';
import { getCompany } from '../actions/CompanyActions';
import { connect } from 'react-redux';

class CompanyProfile extends React.Component {

  componentWillMount() {
    this.props.getCompany(this.props.params.id);
  }

  render() {

    if (!this.props.company) {
      return <p>Loading...</p>;
    }

    const company = this.props.company;
    const id = this.props.params.id;

    return (
      <div className="profile">
        <div className="back">
          <Link to="/">&lt; Back to companies</Link>
        </div>
        <header>
          <h1 className="heading heading-xlarge">{company.name}
            <span className="label label-primary">Account {company.investmentClassification}</span>
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
          <div className="tabs-content">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

CompanyProfile.propTypes = {
  company: React.PropTypes.object,
  getCompany: React.PropTypes.func,
  params: React.PropTypes.object,
  children: React.PropTypes.object,
};

function mapStateToProps({ companies }) {
  return {
    company: companies.company
  };
}

export default connect(mapStateToProps, { getCompany })(CompanyProfile);
