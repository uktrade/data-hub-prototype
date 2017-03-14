/* globals document:true */
const React = require('react')
const ContactTable = require('../components/contacttable.component')
const itemCollectionService = require('../services/itemcollectionservice')

function CompanyContacts (props) {
  const { company } = props
  const contacts = company.contacts || []
  const addUrl = `/contact/add?companyId=${company.id}`

  if ((!company.archived && !contacts) || (!company.archived && contacts.length === 0)) {
    if (company.id) {
      return (<a className='button button-secondary' href={addUrl}>Add new contact</a>)
    } else {
      return (<a className='button button-disabled'>Add new contact</a>)
    }
  }

  if (typeof window !== 'undefined') {
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  if (contacts.length === 0 && !company.archived) {
    return (
      <a className='button' href={addUrl}>Add new contact</a>
    )
  } else if (contacts.length === 0 && company.archived) {
    return (
      <a className='button button-disabled'>Add new contact</a>
    )
  }

  // calculate times
  const timeSinceNewContact = itemCollectionService.getTimeSinceLastAddedItem(contacts)
  const contactsInLastYear = itemCollectionService.getItemsAddedInLastYear(contacts)
  const validContacts = contacts.filter(contact => !contact.archived)
  const archivedContacts = contacts.filter(contact => contact.archived)

  return (
    <div>
      <div className='grid-row'>
        <div className='column-one-third'>
          <div className='data'>
            <h2 className='bold-xlarge data__title'>{ timeSinceNewContact.amount }</h2>
            <p className='bold-xsmall data__description'>{ timeSinceNewContact.unit } since last new contact entry</p>
          </div>
        </div>
        <div className='column-one-third'>
          <div className='data'>
            <h2 id='added-count' className='bold-xlarge data__title'>{ contactsInLastYear.length }</h2>
            <p className='bold-xsmall data__description'>contacts added in the last 12 months</p>
          </div>
        </div>

        <div className='column-one-third'>
          <p className='actions'>
            { !company.archived ? <a className='button button-secondary' href={addUrl}>Add new contact</a>
              : <a className='button button-disabled'>Add new contact</a>
            }
          </p>
        </div>
      </div>

      <ContactTable contacts={validContacts} company={company} />

      {(archivedContacts && archivedContacts.length > 0) &&
        <div id='archived-section'>
          <br /> < br />
          <h3 className='heading-small'>Archived contacts</h3>
          <ContactTable contacts={archivedContacts} company={company} />
        </div>
      }
    </div>

  )
}

CompanyContacts.propTypes = {
  company: React.PropTypes.object,
  contacts: React.PropTypes.array
}

module.exports = CompanyContacts
