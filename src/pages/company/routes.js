const React = require('react');
const axios = require('axios');
const { Route, IndexRoute, Link } = require('react-router');
const ContactTable = require('../../components/contacttable.component.js');
const InteractionTable = require('../../components/interactiontable.component.js');
const CompanyDetails = require('../../sections/companydetails.section.js');
const CompanyEdit = require('../../sections/companyedit.section.js');

class CompanyApp extends React.Component {

  static loadProps(context, cb) {
    axios.get(`/api/company/${context.params.source}/${context.params.sourceId}`)
      .then((response) => {
        const company = response.data;

        let title;
        if (!company.name && company.companies_house_data.name) {
          title = company.companies_house_data.name;
        } else {
          title = company.name;
        }

        cb(null, { company, title });
      })
      .catch(error => cb(error));
  }

  constructor(props) {
    super(props);
    this.state = { showArchive: false };
  }

  showArchive() {
    return (
      <form>
        <div className="form-group">
          <label className="form-label" htmlFor="archived_reason">
            Reason for archiving company
          </label>

          <select className="form-control" name="archived_reason">
            <option value="">Select a value</option>
            <option value="Company is dissolved">Company is dissolved</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="button-bar">
          <button className="button button-warning" type="submit">Archive now</button>
          <a className="button-link button-cancel js-button-cancel" href="#">Cancel</a>
        </div>
      </form>
    );
  }

  render() {
    const { company, title, params } = this.props;
    const { source, sourceId } = params;
    const path = this.props.routes[1].path;

    return (
      <div>
        <h1 className="heading-xlarge record-title">
          {title}
          { company.archived &&
          <span className="status-badge status-badge--archived">Archived</span>
          }
        </h1>
        { this.state.showArchive && this.showArchive() }
        <div className="tabs tabs--inline">
          <nav className="tabs-nav">
            <ul className="tabs-list">
              <li>
                <Link className={!path && 'is-selected'} to={`/company/${source}/${sourceId}`}>Details</Link>
              </li>
              <li>
                <Link className={(path === 'contacts') && 'is-selected'} to={`/company/${source}/${sourceId}/contacts`}>Contacts</Link>
              </li>
              <li>
                <Link className={(path === 'interactions') && 'is-selected'} to={`/company/${source}/${sourceId}/interactions`}>Interactions</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          { this.props.children && React.cloneElement(this.props.children, {
            company,
            contacts: company.contacts,
            interactions: company.interactions,
          })}
        </div>
      </div>
    );
  }

}

CompanyApp.propTypes = {
  children: React.PropTypes.object.isRequired,
  company: React.PropTypes.object,
  title: React.PropTypes.string,
  params: React.PropTypes.array,
  routes: React.PropTypes.array
};

const routes = (
  <Route path="/company/:source/:sourceId" component={CompanyApp}>
    <IndexRoute component={CompanyDetails} />
    <Route path="edit" component={CompanyEdit} />
    <Route path="contacts" components={ContactTable} />
    <Route path="interactions" components={InteractionTable} />
  </Route>
);

module.exports = routes;
