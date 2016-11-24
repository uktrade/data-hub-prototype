const React = require('react');
const ContactTable = require('../components/contacttable.component');
const itemCollectionService = require('../services/itemcollectionservice');

function CompanyContacts(props) {
  const { company, contacts } = props;

  if (!contacts || contacts.length === 0) {
    return (<a className="button button-secondary" href={`/contact/add?company_id=${company.id}`}>Add new contact</a>);
  }

  // filter active/archived

  // calculate times
  const timeSinceNewContact = itemCollectionService.getTimeSinceLastAddedItem(contacts);
  const contactsInLastYear = itemCollectionService.getItemsAddedSince(contacts);
  const validContacts = contacts.filter(contact => !contact.archived);
  const archivedContacts = contacts.filter(contact => contact.archived);

  if (typeof window !== 'undefined') {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  return (
    <div>
      <div className="grid-row">
        <div className="column-one-third">
          <div className="data">
            <h2 className="bold-xlarge data__title">{ timeSinceNewContact.amount }</h2>
            <p className="bold-xsmall data__description">{ timeSinceNewContact.unit } since last new contact entry</p>
          </div>
        </div>
        <div className="column-one-third">
          <div className="data">
            <h2 id="added-count" className="bold-xlarge data__title">{ contactsInLastYear.length }</h2>
            <p className="bold-xsmall data__description">contacts added in the last 12 months</p>
          </div>
        </div>
        <div className="column-one-third">
          <p className="actions">
            { !company.archived ?
              <a className="button button-secondary" href={`/contact/add?company_id=${company.id}`}>Add new contact</a>
              :
              <a className="button button-disabled">Add new contact</a>
            }
          </p>
        </div>
      </div>

      <ContactTable contacts={validContacts} />

      {(archivedContacts && archivedContacts.length > 0) &&
        <div id="archived-section">
          <br /> < br />
          <h3 className="heading-small">Archived contacts</h3>
          <ContactTable contacts={archivedContacts} />
        </div>
      }
    </div>

  );
}

CompanyContacts.propTypes = {
  company: React.PropTypes.object.isRequired,
  contacts: React.PropTypes.array.isRequired,
};

module.exports = CompanyContacts;
