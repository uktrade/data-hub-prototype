const React = require('react');
const Link = require('react-router').Link;
const companyRepository = require('../repositorys/companyrepository');
const axios = require('axios');
const ErrorList = require('../components/errorlist.component.js');
const formatDate = require('../lib/date').formatDate;
const InputText = require('../components/inputtext.component.js');


const DISSOLVED_REASON = 'Company is dissolved';

class CompanyApp extends React.Component {
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

    const {company} = props;

    const state = {
      archiveVisible: false,
      saving: false,
      errors: null,
      company,
    };

    if (company.archived_reason && company.archived_reason.length > 0) {
      if (company.archived_reason = DISSOLVED_REASON) {
        state.archived_reason_dropdown = DISSOLVED_REASON;
        state.archived_reason_other = null;
      } else {
        state.archived_reason_dropdown = 'Other';
        state.archived_reason_other = company.archived_reason;
      }
    }

    this.state = state;
  }

  updateToken(response) {
    if (response && response.headers && response.headers['x-csrf-token']) {
      window.csrfToken = response.headers['x-csrf-token'];
    }
  }

  unarchive = (event) => {
    event.preventDefault();
    event.target.blur();
    this.setState({ saving: true });
    const token = window.csrfToken;
    axios.post('/api/company/unarchive',
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
    const reason = this.state.archived_reason_dropdown === DISSOLVED_REASON ? DISSOLVED_REASON : this.state.archived_reason_other;

    if (!reason || reason.length === 0) {
      this.setState({ errors : { error: 'You must provide a reason to archive' }});
      return;
    }

    const token = window.csrfToken;
    axios.post('/api/company/archive', {
        id: company.id,
        reason
      },
      { headers: {'x-csrf-token': token }})
      .then((response) => {
        this.updateToken(response)
        this.setState({
          archiveVisible: false,
          saving: false,
          company: response.data,
          errors: null,
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
    if (event.target.name === 'archived_reason') {
      this.setState({ archived_reason_dropdown: event.target.value });
    } else {
      this.setState({ archived_reason_other: event.target.value });
    }
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
    this.setState({
      archiveVisible: false,
      errors: null,
    });
  }

  archiveSection() {
    return (
      <form onSubmit={this.archive}>
        <div className="form-group">
          <label className="form-label" htmlFor="archived_reason">
            Reason for archiving company
          </label>

          <select className="form-control" name="archived_reason" onChange={this.changeArchiveReason} value={this.state.archived_reason_dropdown}>
            <option value="">Select a value</option>
            <option value={DISSOLVED_REASON}>{DISSOLVED_REASON}</option>
            <option value="Other">Other</option>
          </select>
        </div>

        { (this.state.archived_reason_dropdown === 'Other') &&
          <InputText name="archived_reason_other" label="Other" value={this.state.archived_reason_other} onChange={this.changeArchiveReason} />
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
        <div className="error-summary" role="group" aria-labelledby="error-summary-heading" tabIndex="-1">
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
        <div className="error-summary" role="group" aria-labelledby="error-summary-heading" tabIndex="-1">
          <h1 className="heading-medium error-summary-heading" id="error-summary-heading">
            Add related company contacts before adding a new interaction
          </h1>
          <p>
            You need to add the related contacts from the company under contacts section before
            adding a new interaction
          </p>
          <ul className="error-summary-list">
            <li>
              <a href={`/contact/add?companyId=${ company.id }`}>Add new contact</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.saving) {
      return (
        <div className="saving">Saving...</div>
      );
    }

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
        { company.archived && this.archivedInfoSection() }
        { this.state.errors && <ErrorList errors={this.state.errors} /> }
        { this.state.archiveVisible && this.archiveSection() }
        { (!company.archived && path === 'contacts' && !company.id) && this.companyRequiredForContactsSection() }
        { (!company.archived && path === 'interactions' && company.contacts.length === 0) && this.contactsRequiredForInteractionSection() }

        <div className="tabs tabs--inline">
          <nav className="tabs-nav">
            <ul className="tabs-list">
              <li>
                <Link className={(!path || path === 'edit') && 'is-selected'} to={`/company/${source}/${sourceId}`}>Details</Link>
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

module.exports = CompanyApp;
