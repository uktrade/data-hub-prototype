import React from 'react';
import axios from 'axios';
import {BaseForm} from './baseform';
import {AddressComponent as Address} from '../components/address.component';
import {AutosuggestComponent as Autosuggest} from '../components/autosuggest.component';
import {inputTextComponent as InputText} from '../components/inputtext.component';
import {errorListComponent as ErrorList} from '../components/errorlist.component';


const LABELS = {
  'company': 'Company',
  'title': 'Title',
  'first_name': 'First name',
  'last_name': 'Last name',
  'role': 'Role',
  'telephone_number': 'Phone',
  'email': 'Email address',
  'address': 'Address',
  'telephone_alternative': 'Alternative phone (optional)',
  'email_alternative': 'Alternative email (optional)',
  'notes': 'Notes (optional)',
  'primary': 'Is this person a primary contact?',
  'teams': 'Which team is this person the primary contact for?'
};

const defaultContact = {
  company: {
    id: '',
    name: ''
  },
  address_same_as_company: true,
  title: {
    id: '',
    name: ''
  },
  first_name: '',
  last_name: '',
  role: {
    id: '',
    name: ''
  },
  telephone_number: '',
  email: '',
  primary: false,
  address: {
    address_1: '',
    address_2: '',
    address_town: '',
    address_county: '',
    address_postcode: '',
    address_country: ''
  },
  telephone_alternative: '',
  email_alternative: '',
  notes: '',
  teams: [{
    id: '',
    name: ''
  }]
};

export class ContactForm extends BaseForm {

  constructor(props) {
    super(props);

    let state = {
      saving: false,
      showCompanyField: true
    };

    if (props.contact) {
      state.formData = Object.assign({}, props.contact);
      state.showCompanyField = false;
    } else {
      state.formData = {};
    }

    if (props.company) {
      state.showCompanyField = false;
      state.formData.company = props.company;
    }

    if (props.lead) {

      let lead = props.lead;

      state.formData.first_name = lead.firstName;
      state.formData.last_name = lead.lastName;
      state.formData.notes = lead.notes;
      state.formData.telephone_number = lead.phone;
      state.formData.email = lead.email;
      state.formData.leadId = lead._id;
    }

    this.setDefaults(state.formData, defaultContact);

    this.state = state;
  }

  save = () => {
    if (this.state.showAddress === false) {
      this.state.formData.address = defaultContact.address;
    }

    if (this.state.primary === false) {
      this.state.formData.teams = [];
    }

    axios.post('/contact/', { contact: this.state.formData })
      .then((response) => {
        window.location.href = `/contact/${response.data.id}/view`;
      })
      .catch((error) => {
        this.setState({
          errors: error.response.data.errors,
          saving: false
        });
      });
  };

  getBackUrl() {

    // if called with a company id, go back to company
    if (this.props.company) {
      return `/company/company_company/${this.props.company.id}#contacts`;
    } else if (this.props.contact) {
      return `/contact/${this.props.contact.id}/view`;
    } else if (this.props.lead) {
      return null;
    }

    return '/';
  }

  addPrimaryTeam = (event) => {
    event.preventDefault();
    let teams = this.state.formData.teams;
    teams.push({id: null, name: ''});
    this.changeFormData('teams', teams);
  };

  updatePrimaryTeam = (newValue, index) => {
    let teams = this.state.formData.teams;
    teams[index] = newValue.value;
    this.changeFormData('teams', teams);
  };


  render() {

    const formData = this.state.formData;
    const backUrl = this.getBackUrl();

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
        <Autosuggest
          name="title"
          label={LABELS.title}
          value={formData.title}
          optionsUrl='/api/meta/title'
          onChange={this.updateField}
          errors={this.getErrors('title')}
        />
        <InputText
          label={LABELS.first_name}
          name="first_name"
          value={formData.first_name}
          onChange={this.updateField}
          errors={this.getErrors('firstName')}
        />
        <InputText
          label={LABELS.last_name}
          name="last_name"
          value={formData.last_name}
          onChange={this.updateField}
          errors={this.getErrors('last_name')}
        />
        <Autosuggest
          name="role"
          label={LABELS.role}
          value={formData.role}
          optionsUrl='/api/meta/role'
          onChange={this.updateField}
          errors={this.getErrors('role')}
        />
        <fieldset className="inline form-group form-group__checkbox-group form-group__radiohide">
          <legend className="form-label">{LABELS.primary}</legend>
          <label
            className={formData.primary ? 'block-label selected' : 'block-label'}
            htmlFor="primary-yes">
            <input
              id="primary-yes"
              type="radio"
              name="primary"
              value="Yes"
              checked={formData.primary}
              onChange={this.updateField}
            />
            Yes
          </label>
          <label
            className={!formData.primary ? 'block-label selected' : 'block-label'}
            htmlFor="primary-no">
            <input
              id="primary-no"
              type="radio"
              name="primary"
              value="No"
              checked={!formData.primary}
              onChange={this.updateField}
            />
            No
          </label>
        </fieldset>
        { formData.primary &&
          <div className="indented-info">
            {formData.teams.each((team, index) => {
              return (<Autosuggest
                name="teams"
                label={LABELS.teams}
                value={formData.team}
                lookupUrl='/api/teamlookup'
                onChange={(update) => {
                  this.updatePrimaryTeam(update, index);
                }}
                errors={this.getErrors('teams')}
              />);
            })}
            <a className="add-another-button" onClick={this.addPrimaryTeam}>
              Add another country
            </a>
          </div>
        }
        <InputText
          label={LABELS.telephone_number}
          name="telephone_number"
          value={formData.telephone_number}
          onChange={this.updateField}
          errors={this.getErrors('telephone_number')}
        />
        <InputText
          label={LABELS.email}
          name="email"
          value={formData.email}
          onChange={this.updateField}
          errors={this.getErrors('email')}
        />
        <fieldset className="inline form-group form-group__checkbox-group form-group__radiohide">
          <legend className="form-label">Is the contact's address the same as the company address?</legend>
          <label className={this.state.formData.address_same_as_company ? 'block-label selected' : 'block-label'}>
            <input
              type="radio"
              value="Yes"
              name="address_same_as_company"
              checked={this.state.formData.address_same_as_company}
              onChange={this.updateField}
            />
            Yes
          </label>
          <label className={this.state.formData.address_same_as_company ? 'block-label' : 'block-label selected'}>
            <input
              type="radio"
              value="No"
              name="address_same_as_company"
              checked={!this.state.formData.address_same_as_company}
              onChange={this.updateField}
            />
            No
          </label>
        </fieldset>
        { !this.state.formData.address_same_as_company &&
          <div className="indented-info">
            <Address
                name='address'
                label={LABELS.address}
                onChange={this.updateField}
                errors={this.getErrors('address')}
                value={formData.address}
              />
          </div>
        }
        <InputText
          label={LABELS.telephone_alternative}
          name="telephone_alternative"
          value={formData.telephone_alternative}
          onChange={this.updateField}
          errors={this.getErrors('telephone_alternative')}
        />
        <InputText
          label={LABELS.email_alternative}
          name="email_alternative"
          value={formData.email_alternative}
          onChange={this.updateField}
          errors={this.getErrors('email_alternative')}
        />
        <div className="form-group ">
          <label className="form-label" htmlFor="description">Notes (optional)</label>
          <textarea
            id="notes"
            className="form-control"
            name="notes"
            rows="5"
            onChange={this.updateField}
            value={formData.notes}/>
        </div>
        <div className="button-bar">
          <button className="button button--save" type="button" onClick={this.save}>Save</button>
          {backUrl && <a className="button-link button--cancel" href={backUrl}>Cancel</a>}
        </div>
      </div>

    );
  }

}
