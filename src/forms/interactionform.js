const React = require('react');
const axios = require('axios');
const { Link, browserHistory } = require('react-router');
const BaseForm = require('./baseform');
const Autosuggest = require('../components/autosuggest.component');
const SelectWithId = require('../components/selectwithid.component');
const DateInput = require('../components/dateinput.component');
const InputText = require('../components/inputtext.component');
const ErrorList = require('../components/errorlist.component');
const interactionRepository = require('../repositorys/interactionrepository');
const companyRepository = require('../repositorys/companyrepository');
const contactRepository = require('../repositorys/contactrepository');
const getBackLink = require('../lib/urlstuff').getBackLink;

const LABELS = {
  'company': 'Company',
  'contact': 'Company contact',
  'dit_advisor': 'DIT advisor',
  'interaction_type': 'Interaction type',
  'subject': 'Subject',
  'notes': 'Interaction notes',
  'data_of_interaction': 'Date of interaction',
  'service': 'Service offer',
  'dit_team': 'Service provider'
};
const defaultInteraction = {
  company: {
    id: '',
    name: ''
  },
  contact: {
    id: '',
    name: ''
  },
  dit_advisor: {
    id: '',
    name: ''
  },
  interaction_type: {
    id: '',
    name: ''
  },
  subject: '',
  notes: '',
  date: '',
  service: {
    id: '',
    name: ''
  },
  dit_team: {
    id: '',
    name: ''
  }
};

class InteractionForm extends BaseForm {
  static loadProps(context, cb) {
    const params = context.params;
    const backLink = getBackLink(params);
    let user;
    if (params.user) {
      user = params.user;
    } else if (window && window.DIT.user) {
      user = window.DIT.user;
    }

    if (params.interactionId) {
      interactionRepository.getInteraction(params.token, params.interactionId)
        .then((interaction) => {
          cb(null, { interaction, user, backLink });
        })
        .catch((error) => {
          cb(error);
        });
    } else if (params.companyId) {
      companyRepository.getCompany(params.token, params.companyId, 'DIT')
        .then((company) => {
          cb(null, { company, user, backLink });
        })
        .catch((error) => {
          cb(error);
        });
    } else if (params.contactId) {
      contactRepository.getContact(params.token, params.contactId)
        .then((contact) => {
          cb(null, { contact, user, backLink });
        })
        .catch((error) => {
          cb(error);
        });
    } else {
      cb(null, { user, backLink });
    }
  }

  // Construct the initial state
  // The form can be called wither with an interaction to edit
  // or from the contact and company screens, which will pre populate
  // some information.
  // Depending on where the user came from the form decides if it should let
  // the user enter/edit the company/contact or simply show it.
  // If adding a new record we also set the default advisor to the logged in user
  constructor(props) {
    super(props);

    let state = {
      saving: false,
      showCompanyField: true,
      showContactField: true
    };

    if (props.interaction) {
      // If editing an interaction
      state.formData = props.interaction;
      state.showCompanyField = false;
      state.showContactField = false;
    } else if (props.contact) {
      // if adding an interaction from contact screen
      state.formData = {
        company: props.contact.company,
        contact: props.contact,
        dit_advisor: props.user,
      };
      state.showCompanyField = false;
      state.showContactField = false;
    } else if (props.company) {
      // if adding an interaction from company screen
      state.formData = {
        company: props.company,
        dit_advisor: props.user,
      };
      state.showCompanyField = false;
    } else {
      state.formData = {
        dit_advisor: props.user,
      };
    }

    this.setDefaults(state.formData, defaultInteraction);
    this.state = state;
  }

  // Save the interaction to the json api. Note that the CSRF token for
  // JSON calls is global on the web page, this is a pattern used as in some
  // screens json calls are done for things other than saving, such as archiving.
  save = () => {
    this.setState({saving: true});
    axios.post('/api/interaction/',
      { interaction: this.state.formData },
      { headers: {'x-csrf-token': window.csrfToken }}
      )
      .then((response) => {
        window.csrfToken = response.headers['x-csrf-token'];
        browserHistory.push(`/interaction/${response.data.id}`);
    })
      .catch((error) => {
        if (error.response && error.response.headers) {
          window.csrfToken = error.response.headers['x-csrf-token'];
          this.setState({
            errors: error.response.data.errors,
            saving: false
          });
        }
      });
  };

  lookupContacts = (term) => {
    return new Promise((resolve) => {
      axios.get(`/api/contactlookup?company=${this.state.formData.company.id}&contact=${term}`)
        .then(response => {
          resolve(response.data);
        });
    });
  };

  getBackLink() {
    // if called with a company id, go back to company
    if (this.props.company) {
      return (<a className="button-link button--cancel js-button-cancel" href={`/company/company_company/${this.props.company.id}/interactions`}>Cancel</a>);
    } else if (this.props.contact) {
      return (<a className="button-link button--cancel js-button-cancel" href={`/contact/${this.props.contact.id}/interactions`}>Cancel</a>);
    } else if (this.props.interaction) {
      return (<Link className="button-link button--cancel js-button-cancel" href={`/interaction/${this.props.interaction.id}`}>Cancel</Link>);
    }
    return (<a href="/" className="button-link button--cancel js-button-cancel">Cancel</a>);
  }

  render() {
    if (this.state.saving) {
      return this.getSaving();
    }
    const formData = this.state.formData;
    const backLink = this.props.backLink;

    return (
      <div>
        { backLink && <a className="back-link" href={backLink.url}>{backLink.title}</a> }
        { this.props.params.interactionId ?
          <h1 className="heading-xlarge record-title">Edit interaction</h1>
          :
          <h1 className="heading-xlarge record-title">Add interaction</h1>
        }

        { this.state.errors &&
        <ErrorList labels={LABELS} errors={this.state.errors}/>
        }

        { this.state.showCompanyField ?
          <Autosuggest
            name="company"
            label={LABELS.company}
            value={formData.company}
            lookupUrl='/api/suggest'
            onChange={this.updateField}
            errors={this.getErrors('title')}
            searchingFor="a company"
          />
          :
          <div className="form-group">
            <div className="form-label-bold">Company</div>
            <strong>{ formData.company.name }</strong>
          </div>
        }

        <SelectWithId
          value={formData.interaction_type.id || null}
          url="/api/meta/typesofinteraction"
          name="interaction_type"
          label={LABELS.interaction_type}
          errors={this.getErrors('interaction_type')}
          onChange={this.updateField}
        />
        <InputText
          label={LABELS.subject}
          name="subject"
          value={formData.subject}
          onChange={this.updateField}
          errors={this.getErrors('subject')}
        />
        <div className="form-group ">
          <label className="form-label-bold" htmlFor="description">{LABELS.notes}</label>
          <textarea
            id="notes"
            className="form-control"
            name="notes"
            rows="5"
            onChange={this.updateField}
            value={formData.notes}/>
        </div>

        { this.state.showContactField ?
          <Autosuggest
            name="contact"
            label={LABELS.contact}
            value={formData.contact}
            fetchSuggestions={this.lookupContacts}
            onChange={this.updateField}
            errors={this.getErrors('contact')}
            searchingFor="a contact"
          />
          :
          <div className="form-group">
            <div className="form-label-bold">{LABELS.contact}</div>
            <strong>{ formData.contact.first_name } { formData.contact.last_name }</strong>
          </div>
        }

        <DateInput
          label="Date of interaction"
          name="date"
          value={formData.date}
          onChange={this.updateField}
          errors={this.getErrors('date')}
        />
        <Autosuggest
          name="dit_advisor"
          label={LABELS.dit_advisor}
          value={formData.dit_advisor}
          lookupUrl='/api/accountmanagerlookup'
          onChange={this.updateField}
          errors={this.getErrors('dit_advisor')}
          searchingFor="an advisor"
        />
        <Autosuggest
          name="service"
          label={LABELS.service}
          value={formData.service}
          optionsUrl='/api/meta/service'
          onChange={this.updateField}
          errors={this.getErrors('service')}
          searchingFor="a service"
        />
        <Autosuggest
          name="dit_team"
          label={LABELS.dit_team}
          value={formData.dit_team}
          lookupUrl='/api/teamlookup'
          onChange={this.updateField}
          errors={this.getErrors('dit_team')}
          searchingFor="a team"
        />
        <div className="save-bar">
          <button className="button button--save" type="button" onClick={this.save}>Save</button>
          { this.getBackLink() }
        </div>
      </div>
    );
  }
}

module.exports = InteractionForm;
