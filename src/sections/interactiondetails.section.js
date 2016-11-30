/* global document: true */
const React = require('react');
const interactionRepository = require('../repositorys/interactionrepository');
const { Link } = require('react-router');
const formatDate = require('../lib/date').formatDate;

function interactionDetailsSection(props) {
  const interaction = props.interaction;

  if (typeof window !== 'undefined') {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  return (
    <div>
      <h1 className="heading-xlarge record-title">
        Interaction details
      </h1>

      <table className="table-detail">
        <tbody>
          <tr>
            <th width="30%">Company</th>
            <td>
              <a href={`/company/DIT/${interaction.company.id}`}>
                { interaction.company.name }</a>
            </td>
          </tr>
          <tr>
            <th width="30%">Interaction type</th>
            <td>{ interaction.interaction_type.name }</td>
          </tr>
          <tr>
            <th>Subject</th>
            <td>{ interaction.subject }</td>
          </tr>
          <tr>
            <th>Interaction notes</th>
            <td>{ interaction.notes }</td>
          </tr>
          <tr>
            <th>Date of interaction</th>
            <td>{ formatDate(interaction.date_of_interaction) }</td>
          </tr>
          <tr>
            <th>Company contact</th>
            <td>
              <a href={`/contact/${interaction.contact.id}`}>
                { interaction.contact.first_name } { interaction.contact.last_name }
              </a>
            </td>
          </tr>
          <tr>
            <th>DIT advisor</th>
            <td>{ interaction.dit_advisor.first_name } { interaction.dit_advisor.last_name }</td>
          </tr>
          <tr>
            <th>Service offer</th>
            <td>{ interaction.service.name }</td>
          </tr>
          <tr>
            <th>Service provider</th>
            <td>{ interaction.dit_team.name }</td>
          </tr>
        </tbody>
      </table>

      { !interaction.company.archived ?
        <Link to={`/interaction/${interaction.id}/edit`} className="button button-secondary">
          Edit interaction details
        </Link>
        :
        <a className="button button-disabled">Edit interaction details</a>
      }
    </div>
  );
}

interactionDetailsSection.loadProps = (context, cb) => {
  const params = context.params;
  interactionRepository.getInteraction(params.token, params.interactionId)
    .then((interaction) => {
      cb(null, { interaction, interactionId: params.interactionId });
    })
    .catch((error) => {
      cb(error);
    });
};

interactionDetailsSection.propTypes = {
  interaction: React.PropTypes.object,
  source: React.PropTypes.string,
};


module.exports = interactionDetailsSection;
