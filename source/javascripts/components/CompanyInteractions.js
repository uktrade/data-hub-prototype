import React from 'react';
import {Link} from 'react-router';
import Time from 'react-time';

class CompanyInteractions extends React.Component {

  renderInteraction(interaction, i) {
    return (
      <li key={i} className="interaction">
        <p className="interaction-date"><Time value={interaction.date} format="DD MMM YY" /></p>
        <h2 className="interaction-heading">
          <Link to="/">{interaction.subject}</Link>
        </h2>
        <p className="interaction-type">{interaction.type}</p>
        <p className="interaction-meta">Advisor: <a href="#">{interaction.advisor}</a></p>
        <p className="interaction-meta">Contact: <a href="#">{interaction.contact}</a></p>
      </li>
    );
  }

  render() {
    return (
      <ul className="interactions">
        {this.props.company.interactions.map(this.renderInteraction)}
      </ul>
    );
  }
}

CompanyInteractions.propTypes = {
  company: React.PropTypes.object,
};

export default CompanyInteractions;
