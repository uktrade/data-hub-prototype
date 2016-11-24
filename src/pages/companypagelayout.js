const React = require('react');
const Link = require('react-router').Link;
const companyRepository = require('../repositorys/companyrepository');
const axios = require('axios');
const ErrorList = require('../components/errorlist.component');
const formatDate = require('../lib/date').formatDate;
const InputText = require('../components/inputtext.component');


class CompanyPage extends React.Component {
  static loadProps(context, cb) {
    const params = context.params;
    companyRepository.getCompany(params.token, params.sourceId, params.source)
      .then((company) => {
        cb(null, { company, source: params.source, sourceId: params.sourceId });
      })
      .catch((error) => {
        console.log(error);
        cb(error);
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      archiveVisible: false,
      saving: false,
      errors: null,
      company: props.company,
    };
  }

  updateToken(response) {
    if (response && response.headers && response.headers['x-csrf-token']) {
      window.csrfToken = response.headers['x-csrf-token'];
    }
  }

  unarchive = (event) => {
    event.preventDefault();
    event.target.blur();
    const token = window.csrfToken;
    axios.post(`/company/unarchive`,
      { id: this.state.company.id},
      { headers: {'x-csrf-token': token }}
    )
      .then((response) => {
        this.updateToken(response)
        this.setState({
          archiveVisible: false,
          saving: false,
          company: response.data,
        });
      })
      .catch((error) => {
        if (error.response) this.updateToken(error.response);
        this.setState({
          archiveVisible: false,
          saving: false,
          errors: { error: error.message },
        });
      });
  };

  archive = (event) => {
    event.preventDefault();
    this.setState({ saving: true });
    const {company} = this.state;

    const token = window.csrfToken;
    axios.post(`/company/archive`, {
        id: company.id,
        reason: company.archive_reason
      },
      { headers: {'x-csrf-token': token }})
      .then((response) => {
        this.updateToken(response)
        this.setState({
          archiveVisible: false,
          saving: false,
          company: response.data,
        });
      })
      .catch((error) => {
        if (error.response) this.updateToken(error.response);
        this.setState({
          archiveVisible: false,
          saving: false,
          errors: { error: error.message }
        });
      });
  }

  changeArchiveReason = (event) => {
    const company = Object.assign({}, this.state.company);
    company.archive_reason = event.target.value;
    this.setState({company});
  }

  showArchiveSection = (event) => {
    event.preventDefault();
    event.target.blur();
    this.setState({archiveVisible: true});
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  hideArchiveSection = (event) => {
    event.preventDefault();
    event.target.blur();
    this.setState({ archiveVisible: false});
  }

  archiveSection() {
    const reason = this.state.company.archive_reason;
    let selectOption = '';
    let otherReason;

    if (reason && reason.length > 0) {
      if (reason === 'Company is dissolved') {
        selectOption = reason;
      } else {
        selectOption = 'Other';
        otherReason = reason;
      }
    }

    return (
      <form onSubmit={this.archive}>
        <div className="form-group">
          <label className="form-label" htmlFor="archived_reason">
            Reason for archiving company
          </label>

          <select className="form-control" name="archived_reason" onChange={this.changeArchiveReason} value={selectOption}>
            <option value="">Select a value</option>
            <option value="Company is dissolved">Company is dissolved</option>
            <option value="Other">Other</option>
          </select>
        </div>

        { otherReason &&
          <InputText name="archived_reason" label="Other" value={otherReason} onChange={this.changeArchiveReason} />
        }

        <div className="button-bar">
          <button className="button button-warning" type="submit">Archive now</button>
          <a className="button-link button-cancel js-button-cancel" href="#" onClick={this.hideArchiveSection}>Cancel</a>
        </div>
      </form>
    );
  }

  archivedInfoSection() {
    const {company} = this.state;
    return (
      <p className="indented-info">
        This company has been archived on {formatDate(company.archived_on)} by {company.archived_by.first_name} {company.archived_by.last_name}. <br />
        Reason: {company.archived_reason}
      </p>
    );
  }

  companyRequiredForContactsSection() {
    const { source, sourceId } = this.props.params;
    return (
      <div id="tab-error-contacts" className="tabs-errors">
        <div className="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1">
          <h1 className="heading-medium error-summary-heading" id="error-summary-heading">
            Complete company profile details before adding a new contact
          </h1>
          <p>
            You need to add required details to company profile before adding a new contact
          </p>
          <ul className="error-summary-list">
            <li>
              <Link to={`/company/${source}/${sourceId}/edit`} className="button button-secondary js-button-edit">Add company details</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  contactsRequiredForInteractionSection() {
    const company = this.state.company;

    return (
      <div id="tab-error-interactions" className="tabs-errors">
        <div className="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1">
          <h1 className="heading-medium error-summary-heading" id="error-summary-heading">
            Add related company contacts before adding a new interaction
          </h1>
          <p>
            You need to add the related contacts from the company under contacts section before
            adding a new interaction
          </p>
          <ul className="error-summary-list">
            <li>
              <a href={`/contact/add?company_id=${ company.id }`}>Add new contact</a>
            </li>
          </ul>
        </div>
      </div>
    )


  }

  render() {
    const { source, sourceId, children } = this.props;
    const { company } = this.state;
    const path = this.props.routes[1].path;

    if (!company) {
      return (<h1>Error...</h1>);
    }

    let title;
    if (!company.name && company.companies_house_data.name) {
      title = company.companies_house_data.name;
    } else {
      title = company.name;
    }

    return (
      <div>
        <h1 className="heading-xlarge record-title">
          { title }
          { company.archived &&
            <span className="status-badge status-badge--archived">Archived</span>
          }
        </h1>

        { this.state.archiveVisible && this.archiveSection() }
        { company.archived && this.archivedInfoSection() }
        { this.state.errors && <ErrorList errors={this.state.errors} /> }
        { (path === 'contacts' && !company.id) && this.companyRequiredForContactsSection() }
        { (path === 'interactions' && company.contacts.length === 0) && this.contactsRequiredForInteractionSection() }

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
          { children && React.cloneElement(children, {
            company,
            contacts: company.contacts,
            interactions: company.interactions,
            source,
            sourceId,
            showArchiveSection: this.showArchiveSection,
            unarchive: this.unarchive,
            archiveVisible: this.state.archiveVisible,
          } )}
        </div>

      </div>
    );
  }
}

module.exports = CompanyPage;
