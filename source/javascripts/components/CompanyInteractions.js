import React from 'react';
import ContactLink from './ContactLink';
import { Link } from 'react-router';
import Time from 'react-time';

class CompanyInteractions extends React.Component {

  renderInteraction(interaction, i) {
    return (
      <li key={i}>
        <Link className="interaction" to="/">
          <h2 className="heading interaction-heading">{interaction.type}</h2>
          <div className="interaction-date"><Time value={interaction.date} format="DD MMM YY" /></div>
          <div className="interaction-description">{interaction.description}</div>
          <div className="interaction-advisor">Advisor: {interaction.advisor}</div>
          <div className="interaction-contact">Contact: {interaction.contact}</div>
        </Link>
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
