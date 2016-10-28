import React, { Component } from 'react';

var monthNames = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sept', 'Oct',
  'Nov', 'Dec'
];

function formatDate(date) {
  const parts = date.split('-');
  const dateTime = new Date(parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10));
  const day = dateTime.getDate();
  const monthIndex = dateTime.getMonth();
  const year = dateTime.getFullYear();
  return `${day} ${monthNames[monthIndex]} ${year}`;
}

class CompanyInteractionTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'date_of_interaction',
      sortAsc: false
    };
  }

  interactionSorter = (a, b) => {

    let aValue;
    let bValue;

    if (this.state.sortKey == 'contact') {
      aValue = `${a.contact.last_name} ${a.contact.first_name}`.toLocaleLowerCase();
      bValue = `${b.contact.last_name} ${b.contact.first_name}`.toLocaleLowerCase();
    } else if (this.state.sortKey == 'advisor') {
      aValue = `${a.advisor.split(' ')[1]} ${a.advisor.split(' ')[0]}`.toLocaleLowerCase();
      bValue = `${b.advisor.split(' ')[1]} ${b.advisor.split(' ')[0]}`.toLocaleLowerCase();
    } else {
      aValue = a[this.state.sortKey];
      bValue = b[this.state.sortKey];
    }

    let result = 0;
    if (aValue < bValue) result = -1;
    if (aValue > bValue) result = 1;

    if (!this.state.sortAsc) {
      result = result - (result * 2);
    }

    return result;
  };

  changeSort = (key) => {

    if (this.state.sortKey === key) {
      this.setState({
        sortKey: this.state.sortKey,
        sortAsc: !this.state.sortAsc
      });
    } else {
      this.setState({
        sortKey: key,
        sortAsc: true
      });
    }
  };

  renderInteraction = (interaction) => {

    const link = `/interaction/${interaction.id}/view`;

    return (
      <tr key={interaction.id}>
        <td className="date">{formatDate(interaction.date_of_interaction)}</td>
        <td className="type">{interaction.interaction_type.name}</td>
        <td className="advisor">
          <a href="#">{interaction.dit_advisor.first_name} {interaction.dit_advisor.last_name}</a>
        </td>
        <td className="contact">
          <a href={`/contact/${interaction.contact.id}/view`}>
            {interaction.contact.first_name} {interaction.contact.last_name}
            </a>
        </td>
        <td className="subject"><a href={link}>{interaction.subject}</a></td>
      </tr>
    );
  };

  columnClass(key) {
    if (this.state.sortKey === key && this.state.sortAsc) {
      return key.toLocaleLowerCase() + ' asc';
    } else if (this.state.sortKey === key && !this.state.sortAsc) {
      return key.toLocaleLowerCase() + ' desc';
    }
    return key.toLocaleLowerCase();
  }

  render() {

    if (!this.props.interactions) {
      return <div/>;
    }

    let rows = this.props.interactions.sort(this.interactionSorter).map(this.renderInteraction);

    return (
      <table className="data-table interaction-table">
        <thead>
        <tr>
          <th
            className={this.columnClass('date')}
            onClick={() => {this.changeSort('date');}}
          >Date</th>
          <th
            className={this.columnClass('type')}
            onClick={() => {this.changeSort('type');}}
          >Type</th>
          <th
            className={this.columnClass('advisor')}
            onClick={() => {this.changeSort('advisor');}}
          >Advisor</th>
          <th
            className={this.columnClass('contact')}
            onClick={() => {this.changeSort('contact');}}
          >Company contact</th>
          <th
            className={this.columnClass('subject')}
            onClick={() => { this.changeSort('subject');}}
          >Subject</th>
        </tr>
        </thead>
        <tbody>
        { rows }
        </tbody>
      </table>

    );

  }

}

CompanyInteractionTable.propTypes = {
  company: React.PropTypes.object.isRequired,
  interactions: React.PropTypes.array
};

export default CompanyInteractionTable;
