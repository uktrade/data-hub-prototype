const React = require('react');
const Link = require('react-router').Link;
const contactService = require('../services/contactservice');
const axios = require('axios');
const ErrorList = require('../components/errorlist.component.js');
const formatDate = require('../lib/date').formatDate;
const InputText = require('../components/inputtext.component.js');
const getBackLink = require('../lib/urlstuff').getBackLink;

const REASONS_FOR_ARCHIVE = [
  'Contact has left the company',
  'Contact does not want to be contacted',
  'Contact changed role/responsibility'
]

class ContactApp extends React.Component {
  static loadProps (context, cb) {
    const params = context.params
    const backLink = getBackLink(params)
    contactService.getInflatedContact(params.token, params.contactId)
      .then((contact) => {
        cb(null, { contact, contactId: params.contactId, backLink })
      })
      .catch((error) => {
        if (error.error && error.error.detail) {
          cb(error.error.detail);
        } else {
          cb('Error loading contact')
        }
      });
  }

  constructor (props) {
    super(props)

    const {contact} = props

    const state = {
      archiveVisible: false,
      saving: false,
      errors: null,
      contact
    }

    if (contact.archived_reason && contact.archived_reason.length > 0) {
      if (REASONS_FOR_ARCHIVE.includes(contact.archived_reason)) {
        state.archived_reason_dropdown = contact.archived_reason
        state.archived_reason_other = null
      } else {
        state.archived_reason_dropdown = 'Other'
        state.archived_reason_other = contact.archived_reason
      }
    } else {
      state.archived_reason_dropdown = null
      state.archived_reason_other = null
    }

    this.state = state
  }

  updateContact = (newContactData) => {
    try {
      const updatedContact = Object.assign({}, this.state.contact, newContactData)
      if (updatedContact.teams.length === 1 && updatedContact.teams[0].id.length === 0) {
        delete updatedContact.teams
      }
      this.setState({ contact: updatedContact })
    } catch (e) {
      // do nothing;
    }
  }

  updateToken (response) {
    if (response && response.headers && response.headers['x-csrf-token']) {
      window.csrfToken = response.headers['x-csrf-token']
    }
  }

  unarchive = (event) => {
    event.preventDefault()
    event.target.blur()
    this.setState({ saving: true })
    const token = window.csrfToken
    axios.post('/api/contact/unarchive',
      { id: this.state.contact.id },
      { headers: { 'x-csrf-token': token } }
    )
      .then((response) => {
        this.updateToken(response)
        this.setState({
          archiveVisible: false,
          saving: false,
          contact: response.data
        })
      })
      .catch((error) => {
        if (error.response) this.updateToken(error.response)
        this.setState({
          archiveVisible: false,
          saving: false,
          errors: { error: error.message }
        })
      })
  };

  archive = (event) => {
    event.preventDefault()
    const archived_reason_dropdown = this.state.archived_reason_dropdown
    const archived_reason_other = this.state.archived_reason_other
    const contact = this.state.contact

    const reason = archived_reason_dropdown !== 'Other' ? archived_reason_dropdown : archived_reason_other

    if (!reason || reason.length === 0) {
      this.setState({ errors: { error: 'You must provide a reason to archive' } })
      return
    }

    this.setState({ saving: true })
    const token = window.csrfToken

    axios.post('/api/contact/archive', {
      id: contact.id,
      reason
    },
      { headers: { 'x-csrf-token': token } })
      .then((response) => {
        this.updateToken(response)
        this.setState({
          archiveVisible: false,
          saving: false,
          contact: response.data,
          errors: null
        })
      })
      .catch((error) => {
        if (error.response) this.updateToken(error.response)
        this.setState({
          archiveVisible: false,
          saving: false,
          errors: { error: error.message }
        })
      })
  }

  changeArchiveReason = (event) => {
    if (event.target.name === 'archived_reason') {
      this.setState({ archived_reason_dropdown: event.target.value })
    } else {
      this.setState({ archived_reason_other: event.target.value })
    }
  }

  showArchiveSection = (event) => {
    event.preventDefault()
    event.target.blur()
    this.setState({archiveVisible: true})
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  hideArchiveSection = (event) => {
    event.preventDefault()
    event.target.blur()
    this.setState({
      archiveVisible: false,
      errors: null
    })
  }

  archiveSection () {
    return (
      <form onSubmit={this.archive}>
        <div className='form-group'>
          <label className='form-label-bold' htmlFor='archived_reason'>
            Reason for archiving contact
          </label>

          <select className='form-control' name='archived_reason' onChange={this.changeArchiveReason} value={this.state.archived_reason_dropdown}>
            <option value=''>Select reason</option>
            { REASONS_FOR_ARCHIVE.map(reason => <option value={reason}>{reason}</option>) }
            <option value='Other'>Other</option>
          </select>
        </div>

        { (this.state.archived_reason_dropdown === 'Other') &&
        <InputText name='archived_reason_other' label='Other' value={this.state.archived_reason_other} onChange={this.changeArchiveReason} />
        }

        <div className='button-bar'>
          <button className='button button-warning' type='submit'>Archive now</button>
          <a className='button-link button-cancel js-button-cancel' href='#' onClick={this.hideArchiveSection}>Cancel</a>
        </div>
      </form>
    )
  }

  archivedInfoSection () {
    const {contact} = this.state
    return (
      <p className='panel panel-border-narrow'>
        This contact has been archived on {formatDate(contact.archived_on)} by {contact.archived_by.first_name} {contact.archived_by.last_name}. <br />
        Reason: {contact.archived_reason}
      </p>
    )
  }

  render () {
    if (this.state.saving) {
      return (
        <div className='saving'>Saving...</div>
      )
    }
    const { contactId, children, backLink } = this.props
    const { contact } = this.state
    const path = this.props.routes[1].path

    if (!contact) {
      return (<h1>Error...</h1>)
    }

    return (
      <div>
        { backLink && <a className='back-link' href={backLink.url}>{backLink.title}</a> }
        <h1 className='heading-xlarge record-title'>
          { contact.first_name } { contact.last_name }
          { contact.archived &&
          <span className='status-badge status-badge--archived'>Archived</span>
          }
        </h1>
        { contact.archived && this.archivedInfoSection() }
        { this.state.errors && <ErrorList errors={this.state.errors} /> }
        { this.state.archiveVisible && this.archiveSection() }

        <div className='tabs tabs--inline'>
          <nav className='tabs-nav'>
            <ul className='tabs-list'>
              <li>
                <Link className={(!path || path === 'edit') && 'selected'} to={`/contact/${contactId}`}>Details</Link>
              </li>
              <li>
                <Link className={(path === 'interactions') && 'selected'} to={`/contact/${contactId}/interactions`}>Interactions</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          { children && React.cloneElement(children, {
            contact,
            contactId,
            showArchiveSection: this.showArchiveSection,
            unarchive: this.unarchive,
            archiveVisible: this.state.archiveVisible,
            updateContact: this.updateContact
          })}
        </div>

      </div>
    )
  }
}

module.exports = ContactApp
