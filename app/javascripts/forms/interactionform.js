import React from 'react';
import axios from 'axios';
import {BaseForm} from './baseform';
import {AutosuggestComponent as Autosuggest} from '../components/autosuggest.component';
import {RadioWithIdComponent as RadioWithId} from '../components/radiowithid.component';
import {DateInputComponent as DateInput} from '../components/dateinput.component';

import {inputTextComponent as InputText} from '../components/inputtext.component';
import {errorListComponent as ErrorList} from '../components/errorlist.component';


const LABELS = {
  'company': 'Company',
  'contact': 'Company contact',
  'dit_advisor': 'DIT advisor',
  'interaction_type': 'Interaction type',
  'subject': 'Subject',
  'notes': 'Interaction notes',
  'data_of_interaction': 'Date of interaction',
  'service': 'Service offer (optional)',
  'dit_team': 'Service provider (optional)'
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

export class InteractionForm extends BaseForm {

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
    } else if (props.company) {
      state.formData = {
        company: props.company,
      };
      state.showCompanyField = false;
    } else if (props.contact) {
      state.formData = {
        company: props.contact.company,
        contact: props.contact
      };
      state.showCompanyField = false;
      state.showContactField = false;
    } else {
      state.formData = {};
    }

    this.setDefaults(state.formData, defaultInteraction);

    this.state = state;
  }

  save = () => {

    axios.post('/interaction/', { interaction: this.state.formData })
      .then((response) => {
        window.location.href = `/interaction/${response.data.id}/view`;
      })
      .catch((error) => {
        this.setState({
          errors: error.response.data.errors,
          saving: false
        });
      });
  };

  lookupContacts = (term) => {
    return axios.get(`/api/contactlookup?company=${this.state.formData.company.id}&contact=${term}`)
      .then(response => {
        return response.data.map(({id, first_name, last_name}) => {
          return {
            id,
            name: `${first_name} ${last_name}`
          };
        });
      });
  };

  render() {

    const formData = this.state.formData;


    return (
      <div>
        { this.state.errors &&
        <ErrorList labels={LABELS} errors={this.state.errors}/>
        }

        { this.state.showCompanyField ?
          <Autosuggest
            label={LABELS.company}
            lookupUrl='/api/suggest'
            onChange={this.updateField}
            errors={this.getErrors('title')}
            name="company"
            value={formData.company}
          />
          :
          <div className="form-group">
            <div className="form-label">Company</div>
            <strong>{ formData.company.name }</strong>
          </div>
        }

        <RadioWithId
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
            label={LABELS.contact}
            fetchSuggestions={this.lookupContacts}
            onChange={this.updateField}
            errors={this.getErrors('contact')}
            name="contact"
            value={formData.contact}
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
          label={LABELS.dit_advisor}
          lookupUrl='/api/accountmanagerlookup'
          onChange={this.updateField}
          errors={this.getErrors('dit_advisor')}
          name="dit_advisor"
          value={formData.dit_advisor}
        />

        <Autosuggest
          label={LABELS.service}
          suggestionUrl='/api/meta/service'
          onChange={this.updateField}
          errors={this.getErrors('service')}
          name="service"
          value={formData.service}
        />

        <Autosuggest
          label={LABELS.dit_team}
          lookupUrl='/api/teamlookup'
          onChange={this.updateField}
          errors={this.getErrors('dit_team')}
          name="dit_team"
          value={formData.dit_team}
        />

        <div className="button-bar">
          <button className="button button--save" type="button" onClick={this.save}>Save</button>
          <a className="button-link button--cancel js-button-cancel" href="/">Cancel</a>
        </div>
      </div>

    );
  }

}
