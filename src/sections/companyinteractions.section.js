const React = require('react');
const InteractionTable = require('../components/interactiontable.component');
const itemCollectionService = require('../services/itemcollectionservice');

function CompanyInteractions(props) {
  const { company, interactions, contacts } = props;

  if (typeof window !== 'undefined') {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  if (interactions.length === 0 && !company.archived && contacts.length > 0) {
    return (
      <a className="button button-secondary" href={`/interaction/add?company_id=${company.id}`}>Add new interaction</a>
    );
  } else if (interactions.length === 0 && (company.archived || contacts.length === 0)) {
    return (
      <a className="button button-disabled">Add new interaction</a>
    );
  }

  // calculate times
  const timeSinceNewInteraction = itemCollectionService.getTimeSinceLastAddedItem(company.interactions);
  const interactionsInLastYear = itemCollectionService.getItemsAddedInLastYear(company.interactions);


  return (
    <div>
      <div className="grid-row">
        <div className="column-one-third">
          <div className="data">
            <h2 className="bold-xlarge data__title">{ timeSinceNewInteraction.amount }</h2>
            <p className="bold-xsmall data__description">{ timeSinceNewInteraction.unit } since last new interaction entry</p>
          </div>
        </div>
        <div className="column-one-third">
          <div className="data">
            <h2 id="added-count" className="bold-xlarge data__title">{ interactionsInLastYear.length }</h2>
            <p className="bold-xsmall data__description">interactions added in the last 12 months</p>
          </div>
        </div>
        <div className="column-one-third">
          <p className="actions">
            { !company.archived ?
              <a className="button button-secondary" href={`/interaction/add?company_id=${company.id}`}>Add new interaction</a>
              :
              <a className="button button-disabled">Add new interaction</a>
            }
          </p>
        </div>
      </div>

      <InteractionTable interactions={interactions} company={company} />
    </div>
  );
}

CompanyInteractions.propTypes = {
  company: React.PropTypes.object,
  interactions: React.PropTypes.array,
};

module.exports = CompanyInteractions;
