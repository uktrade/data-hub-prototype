const React = require('react');
const axios = require('axios');
const { Link } = require('react-router');
const BaseForm = require('./baseform');
const Autosuggest = require('../components/autosuggest.component');
const SelectWithId = require('../components/selectwithid.component');
const DateInput = require('../components/dateinput.component');
const InputText = require('../components/inputtext.component');
const ErrorList = require('../components/errorlist.component');
const interactionRepository = require('../repositorys/interactionrepository');
const companyRepository = require('../repositorys/companyrepository');
const contactRepository = require('../repositorys/contactrepository');

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
  date_of_interaction: '',
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

    if (params.interactionId) {
      interactionRepository.getInteraction(params.token, params.interactionId)
        .then((interaction) => {
          cb(null, { interaction });
        })
        .catch((error) => {
          cb(error);
        });
    } else if (params.companyId) {
      companyRepository.getCompany(params.token, params.companyId, 'DIT')
        .then((company) => {
          cb(null, { company });
        })
        .catch((error) => {
          cb(error);
        });
    } else if (params.contactId) {
      contactRepository.getContact(params.token, params.contactId)
        .then((contact) => {
          cb(null, { contact });
        })
        .catch((error) => {
          cb(error);
        });
    } else {
      cb();
    }
  }

  constructor(props) {
    super(props);

    let state = {
      saving: false,
      showCompanyField: true,
      showContactField: true
    };

    if (props.interaction) {
      state.formData = props.interaction;
      state.showCompanyField = false;
      state.showContactField = false;
    } else if (props.contact) {
      state.formData = {
        company: props.contact.company,
        contact: props.contact
      };
      state.showCompanyField = false;
      state.showContactField = false;
    } else if (props.company) {
      state.formData = {
        company: props.company,
      };
      state.showCompanyField = false;
    } else {
      state.formData = {};
    }

    this.setDefaults(state.formData, defaultInteraction);

    this.state = state;
  }

  save = () => {
    this.setState({saving: true});
    axios.post('/api/interaction/',
      { interaction: this.state.formData },
      { headers: {'x-csrf-token': window.csrfToken }}
      )
      .then((response) => {
        this.setState({saving: false});
        window.location.href = `/interaction/${response.data.id}`;
      })
      .catch((error) => {
        window.csrfToken = error.response.headers['x-csrf-token'];
        this.setState({
          errors: error.response.data.errors,
          saving: false
        });
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

    return (
      <div>
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
          />
          :
          <div className="form-group">
            <div className="form-label">Company</div>
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
          <label className="form-label" htmlFor="description">{LABELS.notes}</label>
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
          />
          :
          <div className="form-group">
            <div className="form-label">{LABELS.contact}</div>
            <strong>{ formData.contact.first_name } { formData.contact.last_name }</strong>
          </div>
        }

        <DateInput
          label="Date of interaction"
          name="date_of_interaction"
          value={formData.date_of_interaction}
          onChange={this.updateField}
          errors={this.getErrors('date_of_interaction')}
        />

        <Autosuggest
          name="dit_advisor"
          label={LABELS.dit_advisor}
          value={formData.dit_advisor}
          lookupUrl='/api/accountmanagerlookup'
          onChange={this.updateField}
          errors={this.getErrors('dit_advisor')}
        />

        <Autosuggest
          name="service"
          label={LABELS.service}
          value={formData.service}
          optionsUrl='/api/meta/service'
          onChange={this.updateField}
          errors={this.getErrors('service')}
        />

        <Autosuggest
          name="dit_team"
          label={LABELS.dit_team}
          value={formData.dit_team}
          lookupUrl='/api/teamlookup'
          onChange={this.updateField}
          errors={this.getErrors('dit_team')}
        />

        <div className="button-bar">
          <button className="button button--save" type="button" onClick={this.save}>Save</button>
          { this.getBackLink() }
        </div>
      </div>
    );
  }
}

module.exports = InteractionForm;
