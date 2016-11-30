const React = require('react');
const { Link } = require('react-router');

function contactDetailsSection(props) {
  const contact = props.contact;
  const { contactId } = props.params;

  if (typeof window !== 'undefined') {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  return (
    <div>
      <table className="table-detail">
        <tbody>
          <tr>
            <th width="30%">Company</th>
            <td><a href={`/company/DIT/${contact.company.id}`}>{ contact.company.name }</a></td>
          </tr>

          <tr>
            <th>Title</th>
            <td>{ contact.title.name }</td>
          </tr>
          <tr>
            <th>Role</th>
            <td>{ contact.role.name }</td>
          </tr>

          { (contact.teams && contact.teams.length > 0) &&
            <tr>
              <th>Teams</th>
              <td>
                { contact.teams.map((team) => {
                  return (<span>{team.name}</span>);
                })}
              </td>
            </tr>
          }

          <tr>
            <th>Phone number</th>
            <td>{ contact.telephone_number }</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{ contact.email }</td>
          </tr>

          { (!contact.address_same_as_company) &&
            <tr>
              <th>Address</th>
              <td>
                { contact.address_1 && `${contact.address_1}, ` }
                { contact.address_2 && `${contact.address_2}, ` }
                { contact.address_town && `${contact.address_town}, ` }
                { contact.address_county && `${contact.address_county}, ` }
                { contact.address_postcode &&
                <span className="meta--address__postcode">
                  {`${contact.address_postcode}, `}
                </span>
                }
                { (contact.address_country && contact.address_country) &&
                contact.address_country.name
                }
              </td>
            </tr>
          }
          <tr>
            <th>Alternative phone</th>
            <td>{ contact.telephone_alternative }</td>
          </tr>
          <tr>
            <th>Alternative email</th>
            <td>{ contact.email_alternative }</td>
          </tr>
          <tr>
            <th>Notes</th>
            <td>{ contact.notes }</td>
          </tr>
        </tbody>
      </table>

      { !props.archiveVisible &&
        <div className="button-bar">
          { !contact.id &&
          <Link to={`/contact/${contactId}/edit`} className="button button-secondary js-button-edit">Edit contact
            details</Link>
          }

          { (!contact.archived) ?
            <div>
              <Link to={`/contact/${contactId}/edit`} className="button button-secondary js-button-edit">
                Edit contact details
              </Link>
              <button className="button button-secondary" onClick={props.showArchiveSection}>Archive contact</button>
            </div>
            :
            <div>
              <a className="button button-disabled">Edit contact details</a>
              <button className="button button-secondary" onClick={props.unarchive}>Unarchive now</button>
            </div>
          }
        </div>
      }

    </div>
  );
}

contactDetailsSection.propTypes = {
  contact: React.PropTypes.object,
  archiveVisible: React.PropTypes.bool,
  showArchiveSection: React.PropTypes.func,
  unarchive: React.PropTypes.func,
};


module.exports = contactDetailsSection;
