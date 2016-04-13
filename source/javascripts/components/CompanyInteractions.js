import React from 'react';
import {Link} from 'react-router';
import Time from 'react-time';

class CompanyInteractions extends React.Component {

  renderInteraction(interaction, i) {
    return (
      <li key={i} className="interaction">
        <p className="interaction-date"><Time value={interaction.date} format="DD MMM YY" /></p>
        <h2 className="interaction-heading">
          <Link to="/">{interaction.description}</Link>
        </h2>
        <p className="interaction-type">{interaction.type}</p>
        <p className="interaction-meta">Advisor: <Link to="/">{interaction.advisor}</Link></p>
        <p className="interaction-meta">Contact: <Link to="/">{interaction.contact}</Link></p>
      </li>
    );
  }

  render() {
    const interactions = this.props.company.interactions;

    return (
      <ul className="interactions">
        {interactions.map(this.renderInteraction)}
      </ul>
    );
  }
}

CompanyInteractions.propTypes = {
  company: React.PropTypes.object,
};

export default CompanyInteractions;
