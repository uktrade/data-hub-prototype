const React = require('react');
const Link = require('react-router').Link;
const companyRepository = require('../../repositorys/companyrepository');

class CompanyPage extends React.Component {
  static loadProps(context, cb) {
    const params = context.params;
    companyRepository.getCompany(params.token, params.sourceId, params.source)
      .then((company) => {
        cb(null, { company, source: params.source, sourceId: params.sourceId });
      })
      .catch((error) => {
        cb(error);
      });
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
    const { source, sourceId, company, children } = this.props;
    const path = this.props.routes[1].path;

    let title;
    if (!company.name && company.companies_house_data.name) {
      title = company.companies_house_data.name;
    } else {
      title = company.name;
    }

    console.log(path);

    return (
      <div>
        <h1 className="heading-xlarge record-title">
          { title }
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
            source,
            sourceId,
          } )}
        </div>

      </div>
    );
  }
}

module.exports = CompanyPage;
