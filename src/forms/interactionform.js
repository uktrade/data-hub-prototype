const React = require('react');
const axios = require('axios');
const BaseForm = require('./baseform');
const Autosuggest = require('../components/autosuggest.component');
const SelectWithId = require('../components/selectwithid.component');
const DateInput = require('../components/dateinput.component');
const InputText = require('../components/inputtext.component');
const ErrorList = require('../components/errorlist.component');


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
    axios.post('/interaction/',
      { interaction: this.state.formData },
      { headers: {'x-csrf-token': window.csrfToken }}
      )
      .then((response) => {
        window.location.href = `/interaction/${response.data.id}/view`;
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

  getBackUrl() {
    if (this.props.interaction) {
      return `/interaction/${this.props.interaction.id}/view`;
    } else if (this.props.contact) {
      return `/contact/${this.props.contact.id}/interactions`;
    } else if (this.props.company) {
      return `/company/${this.props.company.id}/interactions`;
    }

    return '/';
  }

  render() {

    const formData = this.state.formData;

    let backUrl = this.getBackUrl();

    return (
      <div>
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
          <a className="button-link button--cancel js-button-cancel" href={backUrl}>Cancel</a>
        </div>
      </div>

    );
  }

}

module.exports = InteractionForm;
